import express from 'express';
import { pool } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all food items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM food');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add food to booking
router.post('/booking', authenticateToken, async (req, res) => {
  const { booking_id, food_items } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Insert food items
    for (const item of food_items) {
      await connection.query(
        'INSERT INTO food_booking (booking_id, food_id, quantity) VALUES (?, ?, ?)',
        [booking_id, item.food_id, item.quantity]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Food items added to booking' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

export const foodRoutes = router;