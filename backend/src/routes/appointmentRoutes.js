const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { optionalAuth } = require('../middleware/auth');

// Appointment CRUD routes (matching Django REST patterns)
router.get('/', optionalAuth, appointmentController.getAppointments);
router.get('/:id/', optionalAuth, appointmentController.getAppointment);
router.post('/', optionalAuth, appointmentController.createAppointment);
router.put('/:id/', optionalAuth, appointmentController.updateAppointment);
router.patch('/:id/', optionalAuth, appointmentController.updateAppointment);
router.delete('/:id/', optionalAuth, appointmentController.deleteAppointment);

module.exports = router;