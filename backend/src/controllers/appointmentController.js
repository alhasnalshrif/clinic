const { db } = require('../db');
const { appointments, patients, users, bills } = require('../db/schema');
const { eq } = require('drizzle-orm');

class AppointmentController {
  // Get all appointments
  async getAppointments(req, res) {
    try {
      const allAppointments = await db.select({
        id: appointments.id,
        token: appointments.token,
        date: appointments.date,
        time: appointments.time,
        reason: appointments.reason,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        },
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .orderBy(appointments.date);

      res.json(allAppointments);
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get appointment by ID
  async getAppointment(req, res) {
    try {
      const { id } = req.params;
      
      const appointment = await db.select({
        id: appointments.id,
        token: appointments.token,
        date: appointments.date,
        time: appointments.time,
        reason: appointments.reason,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        },
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(eq(appointments.id, parseInt(id)));

      if (!appointment || appointment.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json(appointment[0]);
    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new appointment
  async createAppointment(req, res) {
    try {
      const { patientId, doctorId, token, date, time, reason } = req.body;

      if (!patientId || !doctorId || !reason) {
        return res.status(400).json({ error: 'Patient ID, doctor ID, and reason are required' });
      }

      // Create appointment
      const newAppointment = await db.insert(appointments).values({
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        token: token || null,
        date: date || null,
        time: time || null,
        reason,
      }).returning();

      // Create bill record
      await db.insert(bills).values({
        appointmentId: newAppointment[0].id,
      });

      // Return appointment with relations
      const appointmentWithRelations = await db.select({
        id: appointments.id,
        token: appointments.token,
        date: appointments.date,
        time: appointments.time,
        reason: appointments.reason,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        },
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(eq(appointments.id, newAppointment[0].id));

      res.status(201).json(appointmentWithRelations[0]);
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update appointment
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const { token, date, time, reason } = req.body;

      const updatedAppointment = await db.update(appointments)
        .set({
          token,
          date,
          time,
          reason,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(appointments.id, parseInt(id)))
        .returning();

      if (!updatedAppointment || updatedAppointment.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Return appointment with relations
      const appointmentWithRelations = await db.select({
        id: appointments.id,
        token: appointments.token,
        date: appointments.date,
        time: appointments.time,
        reason: appointments.reason,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        },
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(eq(appointments.id, parseInt(id)));

      res.json(appointmentWithRelations[0]);
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete appointment
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;

      const deletedAppointment = await db.delete(appointments)
        .where(eq(appointments.id, parseInt(id)))
        .returning();

      if (!deletedAppointment || deletedAppointment.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AppointmentController();