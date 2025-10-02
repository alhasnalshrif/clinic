const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');
const { optionalAuth } = require('../middleware/auth');

// Medical History CRUD routes
router.get('/:patientId', optionalAuth, medicalHistoryController.getMedicalHistory);
router.post('/', optionalAuth, medicalHistoryController.createMedicalHistory);
router.put('/:id', optionalAuth, medicalHistoryController.updateMedicalHistory);
router.delete('/:id', optionalAuth, medicalHistoryController.deleteMedicalHistory);

module.exports = router;
