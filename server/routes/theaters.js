import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

console.log('Theater routes initialized');

router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Theater routes working' });
});

// Get all theaters with show info
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, s.show_time, s.price, 
             m.title as movie_title, m.duration
      FROM theater t
      LEFT JOIN shows s ON t.show_id = s.id
      LEFT JOIN movie m ON s.movie_id = m.id
    `);
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

// Get theater shows
router.get('/:theaterId/shows', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, 
             m.title, m.duration, m.genre, m.image_url, m.description,
             t.name as theater_name, t.location
      FROM shows s
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE s.theater_id = ?
      ORDER BY s.show_time ASC
    `, [req.params.theaterId]);
    
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
        id: row.theater_id,
        name: row.theater_name,
        location: row.location
      }
    }));
    
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create theater
router.post('/', async (req, res) => {
  const { name, location, capacity, owner_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO theater (name, location, capacity, owner_id) VALUES (?, ?, ?, ?)',
      [name, location, capacity, owner_id]
    );

    const [theater] = await pool.query(`
      SELECT t.*, s.show_time, s.price 
      FROM theater t
      LEFT JOIN shows s ON t.show_id = s.id
      WHERE t.id = ?
    `, [result.insertId]);

    res.status(201).json(theater[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update theater status (for admin)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.execute(
      'UPDATE theater SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get theaters by owner ID
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM theater WHERE owner_id = ?',
      [req.params.ownerId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as theaterRoutes };