import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

console.log('Theater routes initialized'); // Add debug log

router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Theater routes working' });
});

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

// Create theater (for theater owner)
router.post('/', async (req, res) => {
  console.log('Received theater creation request:', req.body);
  const { name, location, capacity, owner_id } = req.body;
  try {
    // Validate input
    if (!name || !location || !capacity || !owner_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify theater owner exists
    const [owners] = await pool.execute(
      'SELECT id FROM theater_owner WHERE id = ?',
      [owner_id]
    );

    if (owners.length === 0) {
      return res.status(404).json({ 
        error: 'Theater owner not found',
        details: 'Invalid owner_id provided' 
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO theater (name, location, capacity, owner_id) VALUES (?, ?, ?, ?)',
      [name, location, capacity, owner_id]
    );
    
    const [newTheater] = await pool.execute(
      'SELECT * FROM theater WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      location,
      capacity,
      owner_id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Theater creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create theater',
      details: error.message 
    });
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
