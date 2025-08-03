const { db } = require('../db');
const { treatments, patients } = require('../db/schema');
const { eq } = require('drizzle-orm');

class TreatmentController {
  // Get all treatments
  async getTreatments(req, res) {
    try {
      const allTreatments = await db.select({
        id: treatments.id,
        title: treatments.title,
        token: treatments.token,
        description: treatments.description,
        toothPosition: treatments.toothPosition,
        dentalTest: treatments.dentalTest,
        createdAt: treatments.createdAt,
        updatedAt: treatments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        }
      })
        .from(treatments)
        .leftJoin(patients, eq(treatments.patientId, patients.id));

      res.json(allTreatments);
    } catch (error) {
      console.error('Get treatments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get treatment by ID
  async getTreatment(req, res) {
    try {
      const { id } = req.params;
      
      const treatment = await db.select({
        id: treatments.id,
        title: treatments.title,
        token: treatments.token,
        description: treatments.description,
        toothPosition: treatments.toothPosition,
        dentalTest: treatments.dentalTest,
        createdAt: treatments.createdAt,
        updatedAt: treatments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        }
      })
        .from(treatments)
        .leftJoin(patients, eq(treatments.patientId, patients.id))
        .where(eq(treatments.id, parseInt(id)));

      if (!treatment || treatment.length === 0) {
        return res.status(404).json({ error: 'Treatment not found' });
      }

      res.json(treatment[0]);
    } catch (error) {
      console.error('Get treatment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get treatments by patient ID
  async getTreatmentsByPatient(req, res) {
    try {
      const { patientId } = req.params;
      
      const patientTreatments = await db.select({
        id: treatments.id,
        title: treatments.title,
        token: treatments.token,
        description: treatments.description,
        toothPosition: treatments.toothPosition,
        dentalTest: treatments.dentalTest,
        createdAt: treatments.createdAt,
        updatedAt: treatments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        }
      })
        .from(treatments)
        .leftJoin(patients, eq(treatments.patientId, patients.id))
        .where(eq(treatments.patientId, parseInt(patientId)));

      res.json(patientTreatments);
    } catch (error) {
      console.error('Get treatments by patient error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new treatment
  async createTreatment(req, res) {
    try {
      const { patientId, title, token, description, toothPosition, dentalTest } = req.body;

      if (!patientId || !title || !token) {
        return res.status(400).json({ error: 'Patient ID, title, and token are required' });
      }

      // Create treatment
      const newTreatment = await db.insert(treatments).values({
        patientId: parseInt(patientId),
        title,
        token: parseInt(token),
        description: description || null,
        toothPosition: toothPosition || null,
        dentalTest: dentalTest || null,
      }).returning();

      // Return treatment with patient info
      const treatmentWithPatient = await db.select({
        id: treatments.id,
        title: treatments.title,
        token: treatments.token,
        description: treatments.description,
        toothPosition: treatments.toothPosition,
        dentalTest: treatments.dentalTest,
        createdAt: treatments.createdAt,
        updatedAt: treatments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        }
      })
        .from(treatments)
        .leftJoin(patients, eq(treatments.patientId, patients.id))
        .where(eq(treatments.id, newTreatment[0].id));

      res.status(201).json(treatmentWithPatient[0]);
    } catch (error) {
      console.error('Create treatment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update treatment
  async updateTreatment(req, res) {
    try {
      const { id } = req.params;
      const { title, token, description, toothPosition, dentalTest } = req.body;

      const updatedTreatment = await db.update(treatments)
        .set({
          title,
          token: token ? parseInt(token) : undefined,
          description,
          toothPosition,
          dentalTest,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(treatments.id, parseInt(id)))
        .returning();

      if (!updatedTreatment || updatedTreatment.length === 0) {
        return res.status(404).json({ error: 'Treatment not found' });
      }

      // Return treatment with patient info
      const treatmentWithPatient = await db.select({
        id: treatments.id,
        title: treatments.title,
        token: treatments.token,
        description: treatments.description,
        toothPosition: treatments.toothPosition,
        dentalTest: treatments.dentalTest,
        createdAt: treatments.createdAt,
        updatedAt: treatments.updatedAt,
        patient: {
          id: patients.id,
          name: patients.name,
          phone: patients.phone,
          age: patients.age,
        }
      })
        .from(treatments)
        .leftJoin(patients, eq(treatments.patientId, patients.id))
        .where(eq(treatments.id, parseInt(id)));

      res.json(treatmentWithPatient[0]);
    } catch (error) {
      console.error('Update treatment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete treatment
  async deleteTreatment(req, res) {
    try {
      const { id } = req.params;

      const deletedTreatment = await db.delete(treatments)
        .where(eq(treatments.id, parseInt(id)))
        .returning();

      if (!deletedTreatment || deletedTreatment.length === 0) {
        return res.status(404).json({ error: 'Treatment not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete treatment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new TreatmentController();