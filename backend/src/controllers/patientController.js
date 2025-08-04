const { db } = require('../db');
const { patients, adultTeethCharts, childTeethCharts, users } = require('../db/schema');
const { eq } = require('drizzle-orm');

class PatientController {
  // Get all patients
  async getPatients(req, res) {
    try {
      const allPatients = await db.select({
        id: patients.id,
        name: patients.name,
        phone: patients.phone,
        bloodgroup: patients.bloodgroup,
        sex: patients.sex,
        age: patients.age,
        createdAt: patients.createdAt,
        updatedAt: patients.updatedAt,
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(patients)
        .leftJoin(users, eq(patients.doctorId, users.id));

      res.json(allPatients);
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get patient by ID
  async getPatient(req, res) {
    try {
      const { id } = req.params;
      
      const patient = await db.select({
        id: patients.id,
        name: patients.name,
        phone: patients.phone,
        bloodgroup: patients.bloodgroup,
        sex: patients.sex,
        age: patients.age,
        createdAt: patients.createdAt,
        updatedAt: patients.updatedAt,
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(patients)
        .leftJoin(users, eq(patients.doctorId, users.id))
        .where(eq(patients.id, parseInt(id)));

      if (!patient || patient.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.json(patient[0]);
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new patient
  async createPatient(req, res) {
    try {
      const { doctor, name, phone, bloodgroup, sex, age } = req.body;

      if (!doctor || !name) {
        return res.status(400).json({ error: 'Doctor and name are required' });
      }

      // Find doctor by username
      const doctorUser = await db.select()
        .from(users)
        .where(eq(users.username, doctor));

      if (!doctorUser || doctorUser.length === 0) {
        return res.status(400).json({ error: 'Doctor not found' });
      }

      // Create patient
      const newPatient = await db.insert(patients).values({
        doctorId: doctorUser[0].id,
        name,
        phone: phone || null,
        bloodgroup: bloodgroup || null,
        sex: sex || 'MALE',
        age: age || null,
      }).returning();

      // Create adult teeth chart
      await db.insert(adultTeethCharts).values({
        patientId: newPatient[0].id,
      });

      // Create child teeth chart
      await db.insert(childTeethCharts).values({
        patientId: newPatient[0].id,
      });

      // Return patient with doctor info
      const patientWithDoctor = await db.select({
        id: patients.id,
        name: patients.name,
        phone: patients.phone,
        bloodgroup: patients.bloodgroup,
        sex: patients.sex,
        age: patients.age,
        createdAt: patients.createdAt,
        updatedAt: patients.updatedAt,
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(patients)
        .leftJoin(users, eq(patients.doctorId, users.id))
        .where(eq(patients.id, newPatient[0].id));

      res.status(201).json(patientWithDoctor[0]);
    } catch (error) {
      console.error('Create patient error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update patient
  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, bloodgroup, sex, age } = req.body;

      const updatedPatient = await db.update(patients)
        .set({
          name,
          phone,
          bloodgroup,
          sex,
          age,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(patients.id, parseInt(id)))
        .returning();

      if (!updatedPatient || updatedPatient.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Return patient with doctor info
      const patientWithDoctor = await db.select({
        id: patients.id,
        name: patients.name,
        phone: patients.phone,
        bloodgroup: patients.bloodgroup,
        sex: patients.sex,
        age: patients.age,
        createdAt: patients.createdAt,
        updatedAt: patients.updatedAt,
        doctor: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
        .from(patients)
        .leftJoin(users, eq(patients.doctorId, users.id))
        .where(eq(patients.id, parseInt(id)));

      res.json(patientWithDoctor[0]);
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete patient
  async deletePatient(req, res) {
    try {
      const { id } = req.params;

      const deletedPatient = await db.delete(patients)
        .where(eq(patients.id, parseInt(id)))
        .returning();

      if (!deletedPatient || deletedPatient.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new PatientController();