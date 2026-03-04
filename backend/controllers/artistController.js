const pool = require('../config/database');

// Get artist profile
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT artist_id, email, name, phone, city, category, bio, price_min, price_max, profile_image, portfolio_links, gallery_images, is_verified, rating, total_bookings, created_at FROM artists WHERE artist_id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update artist profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city, category, bio, price_min, price_max, portfolio_links, gallery_images } = req.body;
    
    const result = await pool.query(
      `UPDATE artists SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        city = COALESCE($3, city),
        category = COALESCE($4, category),
        bio = COALESCE($5, bio),
        price_min = COALESCE($6, price_min),
        price_max = COALESCE($7, price_max),
        portfolio_links = COALESCE($8, portfolio_links),
        gallery_images = COALESCE($9, gallery_images),
        updated_at = CURRENT_TIMESTAMP
      WHERE artist_id = $10
      RETURNING artist_id, name, email, category, city`,
      [name, phone, city, category, bio, price_min, price_max, portfolio_links, gallery_images, req.user.id]
    );
    
    res.json({
      message: 'Profile updated successfully',
      artist: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get booking requests for artist
exports.getBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT b.*, u.name as user_name, u.phone as user_phone, u.email as user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      WHERE b.artist_id = $1
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

// Accept booking
exports.acceptBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { price } = req.body;
    
    const result = await pool.query(
      `UPDATE bookings SET status = 'accepted', price = $1, updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $2 AND artist_id = $3 AND status = 'requested'
       RETURNING *`,
      [price, booking_id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or already processed' });
    }
    
    res.json({
      message: 'Booking accepted',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to accept booking' });
  }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $1 AND artist_id = $2 AND status = 'requested'
       RETURNING *`,
      [booking_id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or already processed' });
    }
    
    res.json({
      message: 'Booking rejected',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject booking' });
  }
};

// Get earnings dashboard
exports.getEarnings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN price ELSE 0 END), 0) as total_earnings,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN price END), 0) as avg_booking_price
       FROM bookings
       WHERE artist_id = $1`,
      [req.user.id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};
