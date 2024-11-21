import express from 'express'
import { pool } from '../index.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get booking logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching booking logs...')
    const [logs] = await pool.query('SELECT * FROM booking_log ORDER BY changed_at DESC')
    console.log('Booking logs fetched successfully')
    res.json(logs)
  } catch (error) {
    console.error('Error fetching booking logs:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get booking logs for specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const [logs] = await pool.execute(
      'CALL GetBookingLogsForUser(?)',
      [userId]
    )
    res.json(logs[0]) // First element contains the result set
  } catch (error) {
    console.error('Error fetching user booking logs:', error)
    res.status(500).json({ error: error.message })
  }
})



export const bookingLogsRoutes = router