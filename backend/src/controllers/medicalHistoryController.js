const { db } = require('../db');
const { medicalHistory, patients } = require('../db/schema');
const { eq } = require('drizzle-orm');

class MedicalHistoryController {
  // Get medical history for a patient
  async getMedicalHistory(req, res) {
    try {
      const { patientId } = req.params;
      
      const records = await db.select({
        id: medicalHistory.id,
        patientId: medicalHistory.patientId,
        patientName: medicalHistory.patientName,
        date: medicalHistory.date,
        type: medicalHistory.type,
        description: medicalHistory.description,
        severity: medicalHistory.severity,
        status: medicalHistory.status,
        doctor: medicalHistory.doctor,
        createdAt: medicalHistory.createdAt,
        updatedAt: medicalHistory.updatedAt,
      })
        .from(medicalHistory)
        .where(eq(medicalHistory.patientId, parseInt(patientId)));

      res.json(records);
    } catch (error) {
      console.error('Get medical history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create medical history record
  async createMedicalHistory(req, res) {
    try {
      const { patientId, patientName, date, type, description, severity, status, doctor } = req.body;

      if (!patientId || !date || !type) {
        return res.status(400).json({ error: 'Patient ID, date, and type are required' });
      }

      const newRecord = await db.insert(medicalHistory).values({
        patientId: parseInt(patientId),
        patientName,
        date,
        type,
        description,
        severity,
        status,
        doctor,
      }).returning();

      res.status(201).json(newRecord[0]);
    } catch (error) {
      console.error('Create medical history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update medical history record
  async updateMedicalHistory(req, res) {
    try {
      const { id } = req.params;
      const { patientName, date, type, description, severity, status, doctor } = req.body;

      const updatedRecord = await db.update(medicalHistory)
        .set({
          patientName,
          date,
          type,
          description,
          severity,
          status,
          doctor,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(medicalHistory.id, parseInt(id)))
        .returning();

      if (!updatedRecord || updatedRecord.length === 0) {
        return res.status(404).json({ error: 'Medical history record not found' });
      }

      res.json(updatedRecord[0]);
    } catch (error) {
      console.error('Update medical history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete medical history record
  async deleteMedicalHistory(req, res) {
    try {
      const { id } = req.params;

      const deletedRecord = await db.delete(medicalHistory)
        .where(eq(medicalHistory.id, parseInt(id)))
        .returning();

      if (!deletedRecord || deletedRecord.length === 0) {
        return res.status(404).json({ error: 'Medical history record not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete medical history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MedicalHistoryController();
