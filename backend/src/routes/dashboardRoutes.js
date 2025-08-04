const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard routes
router.get('/incomereceivable', dashboardController.getDashboardStats);

module.exports = router;