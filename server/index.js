import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import courtsRouter from './routes/courts.js'
import bookingsRouter from './routes/bookings.js'
import { migrate } from './db/migrate.js'
import { seed } from './db/seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')

const app = express()

// Must be mounted before express.json() - Better Auth parses the raw request body itself.
app.use('/api/auth', toNodeHandler(auth))

app.use(express.json())

app.use('/api/courts', courtsRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

app.use(express.static(distDir))
app.use((req, res) => res.sendFile(path.join(distDir, 'index.html')))

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 3001

async function start() {
  await migrate()
  await seed()
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
