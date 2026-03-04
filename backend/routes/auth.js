const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// User routes
router.post('/user/register', validateRegistration, authController.registerUser);
router.post('/user/login', validateLogin, authController.loginUser);

// Artist routes
router.post('/artist/register', validateRegistration, authController.registerArtist);
router.post('/artist/login', validateLogin, authController.loginArtist);

// Brand routes
router.post('/brand/register', validateRegistration, authController.registerBrand);
router.post('/brand/login', validateLogin, authController.loginBrand);

// Admin routes
router.post('/admin/login', validateLogin, authController.loginAdmin);

module.exports = router;
