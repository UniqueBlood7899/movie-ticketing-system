import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

console.log('Theater routes initialized'); // Add debug log

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
