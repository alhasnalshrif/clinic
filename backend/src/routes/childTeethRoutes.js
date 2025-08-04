const express = require('express');
const router = express.Router();
const teethChartController = require('../controllers/teethChartController');
const { optionalAuth } = require('../middleware/auth');

// Child teeth chart routes
router.get('/', optionalAuth, teethChartController.getAllChildTeethCharts);
router.get('/:id/', optionalAuth, teethChartController.getChildTeethChartById);
router.put('/:id/', optionalAuth, teethChartController.updateChildTeethChart);
router.patch('/:id/', optionalAuth, teethChartController.updateChildTeethChart);

// Route to get child teeth chart by patient ID
router.get('/patient/:patientId/', optionalAuth, teethChartController.getChildTeethChart);

module.exports = router;