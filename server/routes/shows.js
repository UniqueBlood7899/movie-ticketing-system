import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

// Get all shows with movie and theater details
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, m.*, t.*
      FROM \`show\` s
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shows by movie ID
router.get('/movie/:movieId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, t.name as theater_name, t.location
      FROM \`show\` s
      JOIN theater t ON s.theater_id = t.id
      WHERE s.movie_id = ?
    `, [req.params.movieId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const showRoutes = router;