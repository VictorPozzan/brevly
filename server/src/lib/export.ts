import { stringify } from 'csv-stringify/sync'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'
import { db } from '../db/client.js'
import { links } from '../db/schema.js'
import { r2 } from './r2.js'
import { env } from '../env.js'
import { asc } from 'drizzle-orm'

export async function exportLinksToR2(): Promise<string> {
  const allLinks = await db
    .select({
      id: links.id,
      originalUrl: links.originalUrl,
      shortCode: links.shortCode,
      accessCount: links.accessCount,
      createdAt: links.createdAt,
    })
    .from(links)
    .orderBy(asc(links.createdAt))

  const rows = allLinks.map((link) => ({
    ID: link.id,
    'URL Original': link.originalUrl,
    'URL Encurtada': link.shortCode,
    Acessos: link.accessCount,
    'Criado em': link.createdAt.toISOString(),
  }))

  const csv = stringify(rows, { header: true })

  const fileName = `export-${nanoid()}.csv`

  await r2.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: fileName,
      Body: csv,
      ContentType: 'text/csv',
    })
  )

  return `${env.CLOUDFLARE_PUBLIC_URL}/${fileName}`
}
