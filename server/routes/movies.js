import express from 'express';
import { pool } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get movies with theater info
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, t.name as theater_name, t.location 
      FROM movie m 
      LEFT JOIN theater t ON m.theater_id = t.id
    `);
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
  const { title, duration, genre, description, image_url, release_date, admin_id, theater_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO movie (title, duration, genre, description, image_url, release_date, admin_id, theater_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, duration, genre, description, image_url, release_date, admin_id, theater_id]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update movie
router.put('/:id', async (req, res) => {
  const { title, duration, genre, description, image_url, release_date } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE movie SET title = ?, duration = ?, genre = ?, description = ?, image_url = ?, release_date = ? WHERE id = ?',
      [title, duration, genre, description, image_url, release_date, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete movie
router.delete('/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if movie exists and is not referenced in shows
    const [shows] = await connection.query(
      'SELECT id FROM shows WHERE movie_id = ?',
      [req.params.id]
    );

    if (shows.length > 0) {
      throw new Error('Cannot delete movie: It has associated shows');
    }

    // Delete the movie
    const [result] = await connection.query(
      'DELETE FROM movie WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Movie not found');
    }

    await connection.commit();
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting movie:', error);
    res.status(error.message.includes('not found') ? 404 : 400)
      .json({ error: error.message });
  } finally {
    connection.release();
  }
});

export const movieRoutes = router;