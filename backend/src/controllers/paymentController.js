const { db } = require('../db');
const { bills, appointments, patients, users } = require('../db/schema');
const { eq } = require('drizzle-orm');

class PaymentController {
  // Get all bills/payments
  async getPayments(req, res) {
    try {
      const allPayments = await db.select({
        id: bills.id,
        amountPaid: bills.amountPaid,
        currentBalanceBefore: bills.currentBalanceBefore,
        newBalanceAfter: bills.newBalanceAfter,
        datePaid: bills.datePaid,
        appointment: {
          id: appointments.id,
          token: appointments.token,
          date: appointments.date,
          time: appointments.time,
          reason: appointments.reason,
          patient: {
            id: patients.id,
            name: patients.name,
            phone: patients.phone,
          },
          doctor: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        }
      })
        .from(bills)
        .leftJoin(appointments, eq(bills.appointmentId, appointments.id))
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id));

      res.json(allPayments);
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get payment by ID
  async getPayment(req, res) {
    try {
      const { id } = req.params;
      
      const payment = await db.select({
        id: bills.id,
        amountPaid: bills.amountPaid,
        currentBalanceBefore: bills.currentBalanceBefore,
        newBalanceAfter: bills.newBalanceAfter,
        datePaid: bills.datePaid,
        appointment: {
          id: appointments.id,
          token: appointments.token,
          date: appointments.date,
          time: appointments.time,
          reason: appointments.reason,
          patient: {
            id: patients.id,
            name: patients.name,
            phone: patients.phone,
          },
          doctor: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        }
      })
        .from(bills)
        .leftJoin(appointments, eq(bills.appointmentId, appointments.id))
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(eq(bills.id, parseInt(id)));

      if (!payment || payment.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment[0]);
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update payment/bill
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { amountPaid, currentBalanceBefore, newBalanceAfter } = req.body;

      const updatedPayment = await db.update(bills)
        .set({
          amountPaid: amountPaid || 0,
          currentBalanceBefore: currentBalanceBefore || 0,
          newBalanceAfter: newBalanceAfter || 0,
          datePaid: new Date().toISOString(),
        })
        .where(eq(bills.id, parseInt(id)))
        .returning();

      if (!updatedPayment || updatedPayment.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      // Return payment with relations
      const paymentWithRelations = await db.select({
        id: bills.id,
        amountPaid: bills.amountPaid,
        currentBalanceBefore: bills.currentBalanceBefore,
        newBalanceAfter: bills.newBalanceAfter,
        datePaid: bills.datePaid,
        appointment: {
          id: appointments.id,
          token: appointments.token,
          date: appointments.date,
          time: appointments.time,
          reason: appointments.reason,
          patient: {
            id: patients.id,
            name: patients.name,
            phone: patients.phone,
          },
          doctor: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        }
      })
        .from(bills)
        .leftJoin(appointments, eq(bills.appointmentId, appointments.id))
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(eq(bills.id, parseInt(id)));

      res.json(paymentWithRelations[0]);
    } catch (error) {
      console.error('Update payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create payment (though usually auto-created with appointments)
  async createPayment(req, res) {
    try {
      const { appointmentId, amountPaid, currentBalanceBefore, newBalanceAfter } = req.body;

      if (!appointmentId) {
        return res.status(400).json({ error: 'Appointment ID is required' });
      }

      // Check if bill already exists for this appointment
      const existingBill = await db.select()
        .from(bills)
        .where(eq(bills.appointmentId, parseInt(appointmentId)));

      if (existingBill && existingBill.length > 0) {
        return res.status(400).json({ error: 'Bill already exists for this appointment' });
      }

      // Create bill
      const newBill = await db.insert(bills).values({
        appointmentId: parseInt(appointmentId),
        amountPaid: amountPaid || 0,
        currentBalanceBefore: currentBalanceBefore || 0,
        newBalanceAfter: newBalanceAfter || 0,
      }).returning();

      // Return bill with relations
      const billWithRelations = await db.select({
        id: bills.id,
        amountPaid: bills.amountPaid,
        currentBalanceBefore: bills.currentBalanceBefore,
        newBalanceAfter: bills.newBalanceAfter,
        datePaid: bills.datePaid,
        appointment: {
          id: appointments.id,
          token: appointments.token,
          date: appointments.date,
          time: appointments.time,
          reason: appointments.reason,
          patient: {
            id: patients.id,
            name: patients.name,
            phone: patients.phone,
          },
          doctor: {
            id: users.id,
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        }
      })
        .from(bills)
        .leftJoin(appointments, eq(bills.appointmentId, appointments.id))
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(eq(bills.id, newBill[0].id));

      res.status(201).json(billWithRelations[0]);
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete payment
  async deletePayment(req, res) {
    try {
      const { id } = req.params;

      const deletedPayment = await db.delete(bills)
        .where(eq(bills.id, parseInt(id)))
        .returning();

      if (!deletedPayment || deletedPayment.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete payment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new PaymentController();