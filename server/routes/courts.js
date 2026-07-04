import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../requireAuth.js'

const router = Router()

function mapCourt(row) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    surface: row.surface,
    indoor: row.indoor,
    courtCount: row.court_count,
    pricePerHour: Number(row.price_per_hour),
    openHour: row.open_hour,
    closeHour: row.close_hour,
  }
}

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM courts ORDER BY name')
    res.json(result.rows.map(mapCourt))
  } catch (err) {
    next(err)
  }
})

export default router
