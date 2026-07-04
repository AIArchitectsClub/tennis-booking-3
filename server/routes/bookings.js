import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../requireAuth.js'

const router = Router()

function mapBooking(row) {
  return {
    id: row.id,
    courtId: row.court_id,
    date: row.date,
    time: row.time,
    playerName: row.player_name,
    createdAt: row.created_at,
  }
}

function mapSlot(row) {
  return {
    id: row.id,
    courtId: row.court_id,
    date: row.date,
    time: row.time,
  }
}

// All booked slots across every user, without player names - used to grey out taken slots.
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, court_id, date, time FROM bookings ORDER BY date, time')
    res.json(result.rows.map(mapSlot))
  } catch (err) {
    next(err)
  }
})

// The current user's own bookings, for the "My Bookings" view.
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY date, time', [
      req.user.id,
    ])
    res.json(result.rows.map(mapBooking))
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  const { courtId, date, time } = req.body || {}

  if (!courtId || !date || !time) {
    return res.status(400).json({ error: 'courtId, date, and time are required' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (court_id, date, time, player_name, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [courtId, date, time, req.user.name, req.user.id],
    )
    res.status(201).json(mapBooking(result.rows[0]))
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That slot has just been booked. Please pick another.' })
    }
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Unknown court' })
    }
    next(err)
  }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.user.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
