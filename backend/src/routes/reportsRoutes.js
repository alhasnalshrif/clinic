const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { optionalAuth } = require('../middleware/auth');

// Reports routes
router.get('/', optionalAuth, reportsController.getReports);

module.exports = router;
