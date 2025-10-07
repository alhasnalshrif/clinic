const { db } = require('../db');
const { paymentPlans, paymentInstallments, patients } = require('../db/schema');
const { eq, desc, and, lte } = require('drizzle-orm');

class PaymentPlanController {
  // Get all payment plans
  async getAllPaymentPlans(req, res) {
    try {
      const plans = await db.select().from(paymentPlans).orderBy(desc(paymentPlans.createdAt));
      res.json(plans);
    } catch (error) {
      console.error('Error fetching payment plans:', error);
      res.status(500).json({ error: 'Failed to fetch payment plans' });
    }
  }

  // Get payment plans for a specific patient
  async getPatientPaymentPlans(req, res) {
    try {
      const { patientId } = req.params;
      const plans = await db.select()
        .from(paymentPlans)
        .where(eq(paymentPlans.patientId, parseInt(patientId)))
        .orderBy(desc(paymentPlans.createdAt));
      res.json(plans);
    } catch (error) {
      console.error('Error fetching patient payment plans:', error);
      res.status(500).json({ error: 'Failed to fetch patient payment plans' });
    }
  }

  // Get a single payment plan with installments
  async getPaymentPlan(req, res) {
    try {
      const { id } = req.params;
      
      const plan = await db.select()
        .from(paymentPlans)
        .where(eq(paymentPlans.id, parseInt(id)));
      
      if (!plan || plan.length === 0) {
        return res.status(404).json({ error: 'Payment plan not found' });
      }

      const installments = await db.select()
        .from(paymentInstallments)
        .where(eq(paymentInstallments.paymentPlanId, parseInt(id)))
        .orderBy(paymentInstallments.installmentNumber);

      res.json({ ...plan[0], installments });
    } catch (error) {
      console.error('Error fetching payment plan:', error);
      res.status(500).json({ error: 'Failed to fetch payment plan' });
    }
  }

  // Create a new payment plan
  async createPaymentPlan(req, res) {
    try {
      const {
        patientId,
        treatmentPlanId,
        appointmentId,
        title,
        totalAmount,
        numberOfInstallments,
        startDate,
        installmentFrequency, // 'weekly', 'biweekly', 'monthly'
        notes
      } = req.body;

      if (!patientId || !title || !totalAmount || !numberOfInstallments || !startDate) {
        return res.status(400).json({ 
          error: 'Patient ID, title, total amount, number of installments, and start date are required' 
        });
      }

      const installmentAmount = Math.ceil(totalAmount / numberOfInstallments);
      const remainingAmount = totalAmount;

      // Create payment plan
      const newPlan = await db.insert(paymentPlans).values({
        patientId: parseInt(patientId),
        treatmentPlanId: treatmentPlanId ? parseInt(treatmentPlanId) : null,
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        title,
        totalAmount: parseInt(totalAmount),
        paidAmount: 0,
        remainingAmount,
        numberOfInstallments: parseInt(numberOfInstallments),
        installmentAmount,
        startDate,
        nextDueDate: startDate,
        notes: notes || null,
      }).returning();

      // Create installments
      const installmentsData = [];
      let currentDate = new Date(startDate);

      for (let i = 1; i <= numberOfInstallments; i++) {
        installmentsData.push({
          paymentPlanId: newPlan[0].id,
          installmentNumber: i,
          amount: installmentAmount,
          dueDate: currentDate.toISOString().split('T')[0],
        });

        // Calculate next due date based on frequency
        if (installmentFrequency === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (installmentFrequency === 'biweekly') {
          currentDate.setDate(currentDate.getDate() + 14);
        } else { // default to monthly
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      await db.insert(paymentInstallments).values(installmentsData);

      res.status(201).json(newPlan[0]);
    } catch (error) {
      console.error('Error creating payment plan:', error);
      res.status(500).json({ error: 'Failed to create payment plan' });
    }
  }

  // Pay installment
  async payInstallment(req, res) {
    try {
      const { id, installmentId } = req.params;
      const { amount, paidDate, notes } = req.body;

      if (!amount) {
        return res.status(400).json({ error: 'Payment amount is required' });
      }

      // Get installment
      const installment = await db.select()
        .from(paymentInstallments)
        .where(eq(paymentInstallments.id, parseInt(installmentId)));

      if (!installment || installment.length === 0) {
        return res.status(404).json({ error: 'Installment not found' });
      }

      const currentInstallment = installment[0];
      const paidAmount = (currentInstallment.paidAmount || 0) + parseInt(amount);
      const status = paidAmount >= currentInstallment.amount ? 'paid' : 'partial';

      // Update installment
      const updatedInstallment = await db.update(paymentInstallments)
        .set({
          paidAmount,
          paidDate: paidDate || new Date().toISOString().split('T')[0],
          status,
          notes: notes || currentInstallment.notes,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentInstallments.id, parseInt(installmentId)))
        .returning();

      // Update payment plan
      const plan = await db.select()
        .from(paymentPlans)
        .where(eq(paymentPlans.id, parseInt(id)));

      if (plan && plan.length > 0) {
        const currentPlan = plan[0];
        const newPaidAmount = (currentPlan.paidAmount || 0) + parseInt(amount);
        const newRemainingAmount = currentPlan.totalAmount - newPaidAmount;
        const planStatus = newRemainingAmount <= 0 ? 'completed' : 'active';

        // Find next unpaid installment
        const allInstallments = await db.select()
          .from(paymentInstallments)
          .where(eq(paymentInstallments.paymentPlanId, parseInt(id)))
          .orderBy(paymentInstallments.installmentNumber);

        const nextUnpaid = allInstallments.find(inst => inst.status === 'pending' || inst.status === 'partial');

        await db.update(paymentPlans)
          .set({
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
            status: planStatus,
            nextDueDate: nextUnpaid ? nextUnpaid.dueDate : null,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(paymentPlans.id, parseInt(id)));
      }

      res.json(updatedInstallment[0]);
    } catch (error) {
      console.error('Error paying installment:', error);
      res.status(500).json({ error: 'Failed to pay installment' });
    }
  }

  // Update payment plan
  async updatePaymentPlan(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedPlan = await db.update(paymentPlans)
        .set({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentPlans.id, parseInt(id)))
        .returning();

      if (!updatedPlan || updatedPlan.length === 0) {
        return res.status(404).json({ error: 'Payment plan not found' });
      }

      res.json(updatedPlan[0]);
    } catch (error) {
      console.error('Error updating payment plan:', error);
      res.status(500).json({ error: 'Failed to update payment plan' });
    }
  }

  // Cancel payment plan
  async cancelPaymentPlan(req, res) {
    try {
      const { id } = req.params;

      const updatedPlan = await db.update(paymentPlans)
        .set({
          status: 'cancelled',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(paymentPlans.id, parseInt(id)))
        .returning();

      if (!updatedPlan || updatedPlan.length === 0) {
        return res.status(404).json({ error: 'Payment plan not found' });
      }

      res.json(updatedPlan[0]);
    } catch (error) {
      console.error('Error cancelling payment plan:', error);
      res.status(500).json({ error: 'Failed to cancel payment plan' });
    }
  }

  // Get overdue installments
  async getOverdueInstallments(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const overdueInstallments = await db.select()
        .from(paymentInstallments)
        .where(and(
          lte(paymentInstallments.dueDate, today),
          eq(paymentInstallments.status, 'pending')
        ))
        .orderBy(paymentInstallments.dueDate);

      // Update status to overdue
      for (const installment of overdueInstallments) {
        await db.update(paymentInstallments)
          .set({ status: 'overdue' })
          .where(eq(paymentInstallments.id, installment.id));
      }

      res.json(overdueInstallments);
    } catch (error) {
      console.error('Error fetching overdue installments:', error);
      res.status(500).json({ error: 'Failed to fetch overdue installments' });
    }
  }

  // Delete payment plan
  async deletePaymentPlan(req, res) {
    try {
      const { id } = req.params;

      // Delete installments first
      await db.delete(paymentInstallments)
        .where(eq(paymentInstallments.paymentPlanId, parseInt(id)));

      // Delete payment plan
      const deletedPlan = await db.delete(paymentPlans)
        .where(eq(paymentPlans.id, parseInt(id)))
        .returning();

      if (!deletedPlan || deletedPlan.length === 0) {
        return res.status(404).json({ error: 'Payment plan not found' });
      }

      res.json({ message: 'Payment plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment plan:', error);
      res.status(500).json({ error: 'Failed to delete payment plan' });
    }
  }
}

module.exports = new PaymentPlanController();
