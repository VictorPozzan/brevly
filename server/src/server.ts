import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { env } from './env.js'
import { linksRoutes } from './routes/links.js'

const app = fastify({ logger: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(cors, {
  origin: '*',
})

await app.register(linksRoutes)

const address = await app.listen({ port: env.PORT, host: '0.0.0.0' })
console.log(`Servidor rodando em ${address}`)
