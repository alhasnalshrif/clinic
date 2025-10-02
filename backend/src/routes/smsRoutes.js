const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const { optionalAuth } = require('../middleware/auth');

// SMS routes
router.get('/stats', optionalAuth, smsController.getSMSStats);
router.get('/', optionalAuth, smsController.getSMSMessages);
router.post('/', optionalAuth, smsController.sendSMS);
router.put('/:id', optionalAuth, smsController.updateSMSStatus);

module.exports = router;
