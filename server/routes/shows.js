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

// Get theater shows with movie details
router.get('/theaters/:theaterId/shows', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
             m.title, m.duration, m.image_url, m.genre, m.description,
             t.name as theater_name, t.location
      FROM \`show\` s
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE s.theater_id = ?
      ORDER BY s.show_time ASC
    `, [req.params.theaterId]);
    
    // Format the response with complete movie details
    const shows = rows.map(row => ({
      id: row.id,
      movie_id: row.movie_id,
      theater_id: row.theater_id,
      show_time: row.show_time,
      price: row.price,
      movie: {
        id: row.movie_id,
        title: row.title,
        duration: row.duration,
        genre: row.genre,
        description: row.description,
        image_url: row.image_url
      },
      theater: {
        name: row.theater_name,
        location: row.location
      }
    }));
    
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create show
router.post('/', async (req, res) => {
  const { movie_id, theater_id, show_time, price } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO `show` (movie_id, theater_id, show_time, price) VALUES (?, ?, ?, ?)',
      [movie_id, theater_id, show_time, price]
    );
    
    // Get the created show with movie details
    const [shows] = await pool.query(`
      SELECT s.*, m.title, m.duration, m.image_url 
      FROM \`show\` s
      JOIN movie m ON s.movie_id = m.id
      WHERE s.id = ?
    `, [result.insertId]);
    
    res.status(201).json(shows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const showRoutes = router;