const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { optionalAuth } = require('../middleware/auth');

// Patient CRUD routes (matching Django REST patterns)
router.get('/', optionalAuth, patientController.getPatients);
router.get('/:id/', optionalAuth, patientController.getPatient);
router.post('/', optionalAuth, patientController.createPatient);
router.put('/:id/', optionalAuth, patientController.updatePatient);
router.patch('/:id/', optionalAuth, patientController.updatePatient);
router.delete('/:id/', optionalAuth, patientController.deletePatient);

module.exports = router;