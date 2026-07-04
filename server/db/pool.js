import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string.')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// Neon can close idle connections at any time. Without this handler, the
// Pool's unhandled 'error' event would crash the whole process.
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err)
})
