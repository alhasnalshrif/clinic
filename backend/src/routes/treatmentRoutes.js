const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { optionalAuth } = require('../middleware/auth');

// Treatment CRUD routes (matching Django REST patterns)
router.get('/', optionalAuth, treatmentController.getTreatments);
router.get('/:id/', optionalAuth, treatmentController.getTreatment);
router.post('/', optionalAuth, treatmentController.createTreatment);
router.put('/:id/', optionalAuth, treatmentController.updateTreatment);
router.patch('/:id/', optionalAuth, treatmentController.updateTreatment);
router.delete('/:id/', optionalAuth, treatmentController.deleteTreatment);

// Additional route for filtering treatments by patient
router.get('/patient/:patientId/', optionalAuth, treatmentController.getTreatmentsByPatient);

module.exports = router;