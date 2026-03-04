const pool = require('../config/database');

const schema = `
-- Users Table (4-digit ID)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(4) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  profile_image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artists Table (5-digit ID)
CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  artist_id VARCHAR(5) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  category VARCHAR(100),
  bio TEXT,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  profile_image VARCHAR(500),
  portfolio_links TEXT[],
  gallery_images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brands Table (6-digit ID)
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  brand_id VARCHAR(6) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  industry VARCHAR(100),
  website VARCHAR(255),
  profile_image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table (7-digit alphanumeric ID)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR(7) UNIQUE NOT NULL,
  user_id VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE,
  artist_id VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time TIME,
  event_location VARCHAR(255),
  event_type VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'requested',
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE,
  artist_id VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, artist_id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR(7) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  user_id VARCHAR(4) REFERENCES users(user_id) ON DELETE CASCADE,
  artist_id VARCHAR(5) REFERENCES artists(artist_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id VARCHAR(10) NOT NULL,
  reporter_type VARCHAR(20) NOT NULL,
  reported_id VARCHAR(10) NOT NULL,
  reported_type VARCHAR(20) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  user_id VARCHAR(10) NOT NULL,
  user_type VARCHAR(20) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_artists_category ON artists(category);
CREATE INDEX IF NOT EXISTS idx_artists_city ON artists(city);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- Insert default admin
INSERT INTO admins (email, password, name) 
VALUES ('admin@spotmystar.com', '$2a$10$xQZ9J9Z9Z9Z9Z9Z9Z9Z9ZuK', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Musician', 'Live music performances', 'music'),
('Dancer', 'Dance performances', 'dance'),
('Singer', 'Vocal performances', 'mic'),
('DJ', 'DJ and music mixing', 'disc'),
('Comedian', 'Stand-up comedy', 'laugh'),
('Magician', 'Magic shows', 'wand'),
('Photographer', 'Photography services', 'camera'),
('Makeup Artist', 'Makeup and styling', 'brush')
ON CONFLICT (name) DO NOTHING;
`;

async function migrate() {
  try {
    console.log('Running database migrations...');
    await pool.query(schema);
    console.log('✓ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
