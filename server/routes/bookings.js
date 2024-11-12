import express from 'express';
import { pool } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, s.*, m.title as movie_title, t.name as theater_name
      FROM booking b
      JOIN \`show\` s ON b.show_id = s.id
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE b.user_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  const { show_id, seats } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get show details and price
    const [shows] = await connection.query('SELECT price FROM `show` WHERE id = ?', [show_id]);
    if (shows.length === 0) {
      throw new Error('Show not found');
    }

    const total_amount = shows[0].price * seats.length;

    // Create booking
    const [result] = await connection.query(
      'INSERT INTO booking (user_id, show_id, seats, total_amount) VALUES (?, ?, ?, ?)',
      [req.user.id, show_id, JSON.stringify(seats), total_amount]
    );

    await connection.commit();
    res.status(201).json({ id: result.insertId, show_id, seats, total_amount });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

export const bookingRoutes = router;