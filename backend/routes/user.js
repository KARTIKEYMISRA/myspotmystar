const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireUser } = require('../middleware/auth');

// All routes require authentication as user
router.use(verifyToken);
router.use(requireUser);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Artist browsing
router.get('/artists', userController.browseArtists);
router.get('/artists/:artist_id', userController.getArtistDetails);

// Booking routes
router.post('/bookings', userController.createBooking);
router.get('/bookings', userController.getBookings);

// Favorites
router.post('/favorites', userController.addFavorite);
router.delete('/favorites/:artist_id', userController.removeFavorite);
router.get('/favorites', userController.getFavorites);

module.exports = router;
