import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movie');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movie WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create movie
router.post('/', async (req, res) => {
  const { title, duration, genre, description, image_url, release_date, admin_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO movie (title, duration, genre, description, image_url, release_date, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, duration, genre, description, image_url, release_date, admin_id]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const movieRoutes = router;