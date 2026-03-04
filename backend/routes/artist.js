const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { verifyToken, requireArtist } = require('../middleware/auth');

// All routes require authentication as artist
router.use(verifyToken);
router.use(requireArtist);

// Profile routes
router.get('/profile', artistController.getProfile);
router.put('/profile', artistController.updateProfile);

// Booking routes
router.get('/bookings', artistController.getBookings);
router.put('/bookings/:booking_id/accept', artistController.acceptBooking);
router.put('/bookings/:booking_id/reject', artistController.rejectBooking);

// Earnings
router.get('/earnings', artistController.getEarnings);

module.exports = router;
