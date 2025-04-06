import { defineConfig } from 'drizzle-kit'
import { configDotenv } from 'dotenv'

if (process.env['NODE_ENV'] !== 'production') {
  configDotenv()
}

if (!process.env['DATABASE_URL']) {
  throw new Error('DATABASE_URL is required')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema',
  out: './drizzle',
  dbCredentials: {
    url: process.env['DATABASE_URL'],
  },
  casing: 'snake_case',
})
