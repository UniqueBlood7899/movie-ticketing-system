import express from 'express';
import { pool } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, s.*, m.title as movie_title, m.image_url,
             t.name as theater_name, t.location
      FROM booking b
      JOIN shows s ON b.show_id = s.id
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `, [req.user.id]);

    // Format the bookings data
    const bookings = rows.map(row => ({
      id: row.id,
      booking_date: row.booking_date,
      seats: Array.isArray(row.seats) ? row.seats : 
             typeof row.seats === 'string' ? row.seats.split(',') :
             JSON.parse(row.seats), // Try parsing if it's a JSON string
      total_amount: row.total_amount,
      show: {
        id: row.show_id,
        show_time: row.show_time,
        price: row.price,
        movie: {
          title: row.movie_title,
          image_url: row.image_url
        },
        theater: {
          name: row.theater_name,
          location: row.location
        }
      }
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  const { show_id, seats, food_items } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get show details and price
    const [shows] = await connection.query(
      'SELECT price FROM shows WHERE id = ?', 
      [show_id]
    );

    if (shows.length === 0) {
      throw new Error('Show not found');
    }

    // Calculate total amount including food items
    let total_amount = shows[0].price * seats.length;

    if (food_items && food_items.length > 0) {
      const foodIds = food_items.map(item => item.food_id);
      const [foodPrices] = await connection.query(
        'SELECT id, price FROM food WHERE id IN (?)',
        [foodIds]
      );

      const foodTotal = food_items.reduce((total, item) => {
        const food = foodPrices.find(f => f.id === item.food_id);
        return total + (food ? food.price * item.quantity : 0);
      }, 0);

      total_amount += foodTotal;
    }

    // Insert into booking table
    const [result] = await connection.query(
      'INSERT INTO booking (user_id, show_id, seats, total_amount) VALUES (?, ?, ?, ?)',
      [req.user.id, show_id, JSON.stringify(seats), total_amount]
    );

    // Add food items to booking if any
    if (food_items && food_items.length > 0) {
      const foodValues = food_items.map(item => 
        [result.insertId, item.food_id, item.quantity]
      );

      await connection.query(
        'INSERT INTO food_booking (booking_id, food_id, quantity) VALUES ?',
        [foodValues]
      );
    }

    await connection.commit();

    // Get complete booking details
    const [bookingDetails] = await connection.query(`
      SELECT b.*, s.show_time, s.price,
             m.title as movie_title,
             t.name as theater_name
      FROM booking b
      JOIN shows s ON b.show_id = s.id
      JOIN movie m ON s.movie_id = m.id
      JOIN theater t ON s.theater_id = t.id
      WHERE b.id = ?
    `, [result.insertId]);

    res.status(201).json(bookingDetails[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

export const bookingRoutes = router;