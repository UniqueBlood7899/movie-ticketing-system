import express from 'express';
import { pool } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, s.*, m.title as movie_title, t.name as theater_name
      FROM booking b
      JOIN shows s ON b.show_id = s.id
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE b.user_id = ?
    `, [req.user.id]);
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
      FROM shows s
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
    // Validate input
    if (!movie_id || !theater_id || !show_time || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate movie and theater exist
    const [movie] = await pool.query('SELECT id FROM movie WHERE id = ?', [movie_id]);
    const [theater] = await pool.query('SELECT id FROM theater WHERE id = ?', [theater_id]);

    if (movie.length === 0) return res.status(404).json({ error: 'Movie not found' });
    if (theater.length === 0) return res.status(404).json({ error: 'Theater not found' });

    // Insert show
    const [result] = await pool.query(
      'INSERT INTO shows (movie_id, theater_id, show_time, price) VALUES (?, ?, ?, ?)',
      [movie_id, theater_id, show_time, price]
    );

    // Update theater with show_id
    await pool.query('UPDATE theater SET show_id = ? WHERE id = ?', [result.insertId, theater_id]);

    // Get complete show details
    const [shows] = await pool.query(`
      SELECT s.*, m.title, m.duration, m.genre, m.image_url,
             t.name as theater_name, t.location 
      FROM shows s
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE s.id = ?
    `, [result.insertId]);

    res.status(201).json(shows[0]);
  } catch (error) {
    console.error('Show creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get shows with complete info
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, m.title, m.duration, m.genre, m.image_url,
             t.name as theater_name, t.location 
      FROM shows s
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const showRoutes = router;