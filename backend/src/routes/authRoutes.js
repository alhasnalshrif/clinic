const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Authentication routes
router.post('/api-token-auth/', authController.getAuthToken);
router.get('/api/auth/user/', authenticateToken, authController.getCurrentUser);
router.post('/register/', authController.createUser);

module.exports = router;