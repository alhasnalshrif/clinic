const express = require('express');
const router = express.Router();
const paymentPlanController = require('../controllers/paymentPlanController');

// Payment plan routes
router.get('/', paymentPlanController.getAllPaymentPlans);
router.get('/patient/:patientId', paymentPlanController.getPatientPaymentPlans);
router.get('/overdue', paymentPlanController.getOverdueInstallments);
router.get('/:id', paymentPlanController.getPaymentPlan);
router.post('/', paymentPlanController.createPaymentPlan);
router.put('/:id', paymentPlanController.updatePaymentPlan);
router.patch('/:id/cancel', paymentPlanController.cancelPaymentPlan);
router.delete('/:id', paymentPlanController.deletePaymentPlan);

// Installment routes
router.post('/:id/installments/:installmentId/pay', paymentPlanController.payInstallment);

module.exports = router;
