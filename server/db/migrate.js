import { pathToFileURL } from 'node:url'
import { pool } from './pool.js'

const schema = `
  CREATE TABLE IF NOT EXISTS courts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    surface TEXT NOT NULL,
    indoor BOOLEAN NOT NULL DEFAULT false,
    court_count INTEGER NOT NULL,
    price_per_hour NUMERIC NOT NULL,
    open_hour INTEGER NOT NULL,
    close_hour INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id TEXT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    player_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (court_id, date, time)
  );

  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE;
`

export async function migrate() {
  try {
    await pool.query(schema)
  } catch (err) {
    if (err.code === '42P01' && err.message.includes('"user"')) {
      throw new Error(
        'The Better Auth "user" table does not exist yet. Run "npm run auth:migrate" once before migrating the app schema.',
      )
    }
    throw err
  }
}

const isMain = import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  migrate()
    .then(() => {
      console.log('Migration complete')
      return pool.end()
    })
    .catch((err) => {
      console.error('Migration failed', err)
      process.exit(1)
    })
}
