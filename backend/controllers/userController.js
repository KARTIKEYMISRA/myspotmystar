const pool = require('../config/database');
const { generateBookingId } = require('../utils/idGenerator');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, email, name, phone, city, profile_image, created_at FROM users WHERE user_id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    
    const result = await pool.query(
      `UPDATE users SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        city = COALESCE($3, city),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $4
      RETURNING user_id, name, email, phone, city`,
      [name, phone, city, req.user.id]
    );
    
    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Browse artists
exports.browseArtists = async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT artist_id, name, category, city, bio, price_min, price_max, 
             profile_image, is_verified, rating, total_bookings
      FROM artists
      WHERE is_active = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    
    if (city) {
      paramCount++;
      query += ` AND city ILIKE $${paramCount}`;
      params.push(`%${city}%`);
    }
    
    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR bio ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY is_verified DESC, rating DESC, total_bookings DESC`;
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};

// Get artist details
exports.getArtistDetails = async (req, res) => {
  try {
    const { artist_id } = req.params;
    
    const artistResult = await pool.query(
      `SELECT artist_id, name, category, city, bio, price_min, price_max,
              profile_image, portfolio_links, gallery_images, is_verified, 
              rating, total_bookings, created_at
       FROM artists
       WHERE artist_id = $1 AND is_active = true`,
      [artist_id]
    );
    
    if (artistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    const reviewsResult = await pool.query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.user_id
       WHERE r.artist_id = $1
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [artist_id]
    );
    
    res.json({
      artist: artistResult.rows[0],
      reviews: reviewsResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch artist details' });
  }
};

// Create booking request
exports.createBooking = async (req, res) => {
  try {
    const { artist_id, event_date, event_time, event_location, event_type, message } = req.body;
    
    // Check if artist exists and is active
    const artistCheck = await pool.query(
      'SELECT artist_id FROM artists WHERE artist_id = $1 AND is_active = true',
      [artist_id]
    );
    
    if (artistCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found or inactive' });
    }
    
    const bookingId = await generateBookingId();
    
    const result = await pool.query(
      `INSERT INTO bookings (booking_id, user_id, artist_id, event_date, event_time, event_location, event_type, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [bookingId, req.user.id, artist_id, event_date, event_time, event_location, event_type, message]
    );
    
    res.status(201).json({
      message: 'Booking request sent successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get user bookings
exports.getBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT b.*, a.name as artist_name, a.category, a.profile_image, a.phone as artist_phone
      FROM bookings b
      JOIN artists a ON b.artist_id = a.artist_id
      WHERE b.user_id = $1
    `;
    
    const params = [req.user.id];
    
    if (status) {
      query += ' AND b.status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Add to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { artist_id } = req.body;
    
    await pool.query(
      'INSERT INTO favorites (user_id, artist_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, artist_id]
    );
    
    res.json({ message: 'Artist added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Remove from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { artist_id } = req.params;
    
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND artist_id = $2',
      [req.user.id, artist_id]
    );
    
    res.json({ message: 'Artist removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.artist_id, a.name, a.category, a.city, a.profile_image, a.rating, a.is_verified
       FROM favorites f
       JOIN artists a ON f.artist_id = a.artist_id
       WHERE f.user_id = $1 AND a.is_active = true
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
