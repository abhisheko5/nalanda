const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerValidator, loginValidator } = require('../validators');

// POST /api/auth/register - Register new user
router.post('/register', registerValidator, validate, authController.register);

// POST /api/auth/login - User login
router.post('/login', loginValidator, validate, authController.login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', protect, authController.getProfile);

module.exports = router;