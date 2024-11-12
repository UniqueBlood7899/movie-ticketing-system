-- server/schema.sql
-- Create database
CREATE DATABASE IF NOT EXISTS movie_booking;
USE movie_booking;

-- Admin table
CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  contact VARCHAR(20)
);

-- Theater owner table
CREATE TABLE theater_owner (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  contact VARCHAR(20)
);

-- Theater table
CREATE TABLE theater (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES theater_owner(id)
);

-- Movie table
CREATE TABLE movie (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  release_date DATE NOT NULL,
  admin_id INT,
  FOREIGN KEY (admin_id) REFERENCES admin(id)
);

-- Show table
CREATE TABLE `show` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  movie_id INT,
  theater_id INT,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movie(id),
  FOREIGN KEY (theater_id) REFERENCES theater(id)
);

-- User table
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20)
);

-- Booking table
CREATE TABLE booking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  show_id INT,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  seats JSON NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (show_id) REFERENCES `show`(id)
);

-- Food table
CREATE TABLE food (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Food booking table
CREATE TABLE food_booking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT,
  food_id INT,
  quantity INT NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES booking(id),
  FOREIGN KEY (food_id) REFERENCES food(id)
);