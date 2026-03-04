const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication as admin
router.use(verifyToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:user_id/toggle-status', adminController.toggleUserStatus);
router.delete('/users/:user_id', adminController.deleteUser);

// Artist management
router.get('/artists', adminController.getAllArtists);
router.put('/artists/:artist_id/toggle-status', adminController.toggleArtistStatus);
router.put('/artists/:artist_id/verify', adminController.verifyArtist);
router.delete('/artists/:artist_id', adminController.deleteArtist);

// Brand management
router.get('/brands', adminController.getAllBrands);

// Booking management
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:booking_id/cancel', adminController.cancelBooking);

// Category management
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.addCategory);

module.exports = router;
