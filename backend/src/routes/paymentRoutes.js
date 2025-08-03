const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth');

// Payment/Bill CRUD routes (matching Django REST patterns)
router.get('/', optionalAuth, paymentController.getPayments);
router.get('/:id/', optionalAuth, paymentController.getPayment);
router.post('/', optionalAuth, paymentController.createPayment);
router.put('/:id/', optionalAuth, paymentController.updatePayment);
router.patch('/:id/', optionalAuth, paymentController.updatePayment);
router.delete('/:id/', optionalAuth, paymentController.deletePayment);

module.exports = router;