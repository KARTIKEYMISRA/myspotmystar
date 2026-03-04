const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Dashboard analytics
exports.getDashboard = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*) FROM artists WHERE is_active = true) as total_artists,
        (SELECT COUNT(*) FROM brands WHERE is_active = true) as total_brands,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
        (SELECT COALESCE(SUM(price), 0) FROM bookings WHERE status = 'completed') as total_revenue
    `);
    
    const recentBookings = await pool.query(`
      SELECT b.*, u.name as user_name, a.name as artist_name
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN artists a ON b.artist_id = a.artist_id
      ORDER BY b.created_at DESC
      LIMIT 10
    `);
    
    res.json({
      stats: stats.rows[0],
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT user_id, email, name, phone, city, is_active, created_at FROM users';
    const params = [];
    
    if (search) {
      query += ' WHERE name ILIKE $1 OR email ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get all artists
exports.getAllArtists = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT artist_id, email, name, phone, city, category, is_verified, is_active, rating, total_bookings, created_at FROM artists';
    const params = [];
    let paramCount = 0;
    
    const conditions = [];
    
    if (search) {
      paramCount++;
      conditions.push(`(name ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }
    
    if (category) {
      paramCount++;
      conditions.push(`category = $${paramCount}`);
      params.push(category);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT brand_id, email, company_name, contact_person, phone, city, industry, is_active, created_at FROM brands';
    const params = [];
    
    if (search) {
      query += ' WHERE company_name ILIKE $1 OR email ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

// Block/Unblock user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE user_id = $1 RETURNING user_id, is_active',
      [user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: result.rows[0].is_active ? 'User activated' : 'User blocked',
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Block/Unblock artist
exports.toggleArtistStatus = async (req, res) => {
  try {
    const { artist_id } = req.params;
    
    const result = await pool.query(
      'UPDATE artists SET is_active = NOT is_active WHERE artist_id = $1 RETURNING artist_id, is_active',
      [artist_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    res.json({
      message: result.rows[0].is_active ? 'Artist activated' : 'Artist blocked',
      artist: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update artist status' });
  }
};

// Verify artist
exports.verifyArtist = async (req, res) => {
  try {
    const { artist_id } = req.params;
    
    const result = await pool.query(
      'UPDATE artists SET is_verified = true WHERE artist_id = $1 RETURNING artist_id, is_verified',
      [artist_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    res.json({
      message: 'Artist verified successfully',
      artist: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify artist' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Delete artist
exports.deleteArtist = async (req, res) => {
  try {
    const { artist_id } = req.params;
    
    await pool.query('DELETE FROM artists WHERE artist_id = $1', [artist_id]);
    
    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete artist' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT b.*, u.name as user_name, u.email as user_email,
             a.name as artist_name, a.email as artist_email, a.category
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN artists a ON b.artist_id = a.artist_id
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE b.status = $1';
      params.push(status);
    }
    
    query += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $1
       RETURNING *`,
      [booking_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      message: 'Booking cancelled successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Get/Manage categories
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    
    const result = await pool.query(
      'INSERT INTO categories (name, description, icon) VALUES ($1, $2, $3) RETURNING *',
      [name, description, icon]
    );
    
    res.status(201).json({
      message: 'Category added successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add category' });
  }
};
