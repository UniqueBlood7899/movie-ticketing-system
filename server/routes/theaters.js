import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

// Get all theaters
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM theater');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get theater by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM theater WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const theaterRoutes = router;