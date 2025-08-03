const express = require('express');
const router = express.Router();
const teethChartController = require('../controllers/teethChartController');
const { optionalAuth } = require('../middleware/auth');

// Adult teeth chart routes
router.get('/', optionalAuth, teethChartController.getAllAdultTeethCharts);
router.get('/:id/', optionalAuth, teethChartController.getAdultTeethChartById);
router.put('/:id/', optionalAuth, teethChartController.updateAdultTeethChart);
router.patch('/:id/', optionalAuth, teethChartController.updateAdultTeethChart);

// Route to get adult teeth chart by patient ID
router.get('/patient/:patientId/', optionalAuth, teethChartController.getAdultTeethChart);

module.exports = router;