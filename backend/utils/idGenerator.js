const pool = require('../config/database');

// Generate unique 4-digit User ID
async function generateUserId() {
  let userId;
  let exists = true;
  
  while (exists) {
    userId = Math.floor(1000 + Math.random() * 9000).toString();
    const result = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [userId]);
    exists = result.rows.length > 0;
  }
  
  return userId;
}

// Generate unique 5-digit Artist ID
async function generateArtistId() {
  let artistId;
  let exists = true;
  
  while (exists) {
    artistId = Math.floor(10000 + Math.random() * 90000).toString();
    const result = await pool.query('SELECT artist_id FROM artists WHERE artist_id = $1', [artistId]);
    exists = result.rows.length > 0;
  }
  
  return artistId;
}

// Generate unique 6-digit Brand ID
async function generateBrandId() {
  let brandId;
  let exists = true;
  
  while (exists) {
    brandId = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await pool.query('SELECT brand_id FROM brands WHERE brand_id = $1', [brandId]);
    exists = result.rows.length > 0;
  }
  
  return brandId;
}

// Generate unique 7-digit alphanumeric Booking ID
async function generateBookingId() {
  let bookingId;
  let exists = true;
  
  while (exists) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    bookingId = 'BK';
    for (let i = 0; i < 5; i++) {
      bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const result = await pool.query('SELECT booking_id FROM bookings WHERE booking_id = $1', [bookingId]);
    exists = result.rows.length > 0;
  }
  
  return bookingId;
}

module.exports = {
  generateUserId,
  generateArtistId,
  generateBrandId,
  generateBookingId
};
