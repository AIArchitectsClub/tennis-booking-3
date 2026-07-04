import { betterAuth } from 'better-auth'
import { pool } from './db/pool.js'

// RENDER_EXTERNAL_URL is auto-populated by Render at runtime, so BETTER_AUTH_URL
// doesn't need to be set manually there. Falls back to localhost for local dev.
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 3001}`

export const auth = betterAuth({
  database: pool,
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  // Only needed in dev, where the Vite dev server (a different origin) proxies to
  // Express. In production the app is served from a single origin, so baseURL
  // already covers it and this is left undefined.
  trustedOrigins: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : undefined,
  emailAndPassword: {
    enabled: true,
  },
})
