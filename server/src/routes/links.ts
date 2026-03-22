import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/client.js'
import { links } from '../db/schema.js'
import { exportLinksToR2 } from '../lib/export.js'

const shortCodeSchema = z
  .string()
  .min(3, 'O encurtamento precisa ter pelo menos 3 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, - ou _')

export const linksRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z.string().url('URL inválida'),
          shortCode: shortCodeSchema,
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            originalUrl: z.string(),
            shortCode: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortCode } = request.body

      const existing = await db.query.links.findFirst({
        where: eq(links.shortCode, shortCode),
      })

      if (existing) {
        return reply.status(409).send({ message: 'Essa URL já existe' })
      }

      const [created] = await db
        .insert(links)
        .values({ originalUrl, shortCode })
        .returning()

      return reply.status(201).send(created)
    }
  )

  app.get(
    '/links/export',
    {
      schema: {
        response: {
          200: z.object({ url: z.string().url() }),
        },
      },
    },
    async (_request, reply) => {
      const url = await exportLinksToR2()
      return reply.send({ url })
    }
  )

  app.get(
    '/links',
    {
      schema: {
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              originalUrl: z.string(),
              shortCode: z.string(),
              accessCount: z.number(),
              createdAt: z.date(),
            })
          ),
        },
      },
    },
    async (_request, reply) => {
      const allLinks = await db.query.links.findMany({
        orderBy: (links, { desc }) => [desc(links.createdAt)],
      })

      return reply.send(allLinks)
    }
  )

  app.get(
    '/links/:shortCode',
    {
      schema: {
        params: z.object({ shortCode: z.string() }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            originalUrl: z.string(),
            shortCode: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params

      const link = await db.query.links.findFirst({
        where: eq(links.shortCode, shortCode),
      })

      if (!link) {
        return reply.status(404).send({ message: 'Link não encontrado' })
      }

      return reply.send(link)
    }
  )

  app.patch(
    '/links/:shortCode/access',
    {
      schema: {
        params: z.object({ shortCode: z.string() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params

      const result = await db
        .update(links)
        .set({ accessCount: sql`${links.accessCount} + 1` })
        .where(eq(links.shortCode, shortCode))
        .returning({ id: links.id })

      if (result.length === 0) {
        return reply.status(404).send({ message: 'Link não encontrado' })
      }

      return reply.status(204).send()
    }
  )

  app.delete(
    '/links/:shortCode',
    {
      schema: {
        params: z.object({ shortCode: z.string() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params

      const result = await db
        .delete(links)
        .where(eq(links.shortCode, shortCode))
        .returning({ id: links.id })

      if (result.length === 0) {
        return reply.status(404).send({ message: 'Link não encontrado' })
      }

      return reply.status(204).send()
    }
  )
}
