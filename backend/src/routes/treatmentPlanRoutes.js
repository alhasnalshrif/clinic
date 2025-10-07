const express = require('express');
const router = express.Router();
const treatmentPlanController = require('../controllers/treatmentPlanController');

// Treatment plan routes
router.get('/', treatmentPlanController.getAllTreatmentPlans);
router.get('/patient/:patientId', treatmentPlanController.getPatientTreatmentPlans);
router.get('/:id', treatmentPlanController.getTreatmentPlan);
router.post('/', treatmentPlanController.createTreatmentPlan);
router.put('/:id', treatmentPlanController.updateTreatmentPlan);
router.patch('/:id/status', treatmentPlanController.updateTreatmentPlanStatus);
router.delete('/:id', treatmentPlanController.deleteTreatmentPlan);

// Phase routes
router.post('/:id/phases', treatmentPlanController.addPhase);
router.put('/:id/phases/:phaseId', treatmentPlanController.updatePhase);
router.delete('/:id/phases/:phaseId', treatmentPlanController.deletePhase);

module.exports = router;
