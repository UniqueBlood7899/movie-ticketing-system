//server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { movieRoutes } from './routes/movies.js';
import { theaterRoutes } from './routes/theaters.js';
import { showRoutes } from './routes/shows.js';
import { bookingRoutes } from './routes/bookings.js';
import { userRoutes } from './routes/users.js';
import { foodRoutes } from './routes/food.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});