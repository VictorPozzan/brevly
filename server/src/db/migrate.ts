import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

const migrationClient = postgres(connectionString, { max: 1 })
const db = drizzle(migrationClient)

console.log('Rodando migrations...')
await migrate(db, { migrationsFolder: 'src/db/migrations' })
console.log('Migrations concluídas!')

await migrationClient.end()
