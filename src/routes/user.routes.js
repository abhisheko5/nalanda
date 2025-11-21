const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { mongoIdValidator, paginationValidator } = require('../validators');

// All user management routes are admin only

// GET /api/users - List all users
router.get('/', protect, adminOnly, paginationValidator, validate, userController.getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', protect, adminOnly, mongoIdValidator, validate, userController.getUser);

// PUT /api/users/:id - Update user
router.put('/:id', protect, adminOnly, mongoIdValidator, validate, userController.updateUser);

// DELETE /api/users/:id - Deactivate user
router.delete('/:id', protect, adminOnly, mongoIdValidator, validate, userController.deleteUser);

module.exports = router;