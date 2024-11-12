//server/routes/users.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../index.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  try {
    // Check if user exists
    const [users] = await pool.query('SELECT id FROM user WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO user (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: result.insertId, name, email, phone } });
  } catch (error) {
    console.error('Registration error:', error); // Add this line
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Register
router.post('/admin/register', async (req, res) => {
  const { name, email, password, contact } = req.body;
  
  try {
    // Check if admin exists
    const [admins] = await pool.query('SELECT id FROM admin WHERE email = ?', [email]);
    if (admins.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const [result] = await pool.query(
      'INSERT INTO admin (name, email, password, contact) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, contact]
    );

    const token = jwt.sign({ id: result.insertId, role: 'admin' }, process.env.JWT_SECRET);
    res.status(201).json({ 
      token, 
      user: { id: result.insertId, name, email, contact },
      role: 'admin'
    });
  } catch (error) {
    console.error('Admin Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admins] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { id: admin.id, name: admin.name, email: admin.email, contact: admin.contact },
      role: 'admin'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const userRoutes = router;