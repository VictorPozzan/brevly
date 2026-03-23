import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const connectionString = process.env.DATABASE_URL!

const migrationClient = postgres(connectionString, { max: 1 })
const db = drizzle(migrationClient)

const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), 'migrations')

console.log('Rodando migrations...')
await migrate(db, { migrationsFolder })
console.log('Migrations concluídas!')

await migrationClient.end()
