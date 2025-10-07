const { db } = require('../db');
const { treatmentPlans, treatmentPlanPhases, patients, users } = require('../db/schema');
const { eq, and, desc } = require('drizzle-orm');

class TreatmentPlanController {
  // Get all treatment plans
  async getAllTreatmentPlans(req, res) {
    try {
      const plans = await db.select().from(treatmentPlans).orderBy(desc(treatmentPlans.createdAt));
      res.json(plans);
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      res.status(500).json({ error: 'Failed to fetch treatment plans' });
    }
  }

  // Get treatment plans for a specific patient
  async getPatientTreatmentPlans(req, res) {
    try {
      const { patientId } = req.params;
      const plans = await db.select()
        .from(treatmentPlans)
        .where(eq(treatmentPlans.patientId, parseInt(patientId)))
        .orderBy(desc(treatmentPlans.createdAt));
      res.json(plans);
    } catch (error) {
      console.error('Error fetching patient treatment plans:', error);
      res.status(500).json({ error: 'Failed to fetch patient treatment plans' });
    }
  }

  // Get a single treatment plan with phases
  async getTreatmentPlan(req, res) {
    try {
      const { id } = req.params;
      
      const plan = await db.select()
        .from(treatmentPlans)
        .where(eq(treatmentPlans.id, parseInt(id)));
      
      if (!plan || plan.length === 0) {
        return res.status(404).json({ error: 'Treatment plan not found' });
      }

      const phases = await db.select()
        .from(treatmentPlanPhases)
        .where(eq(treatmentPlanPhases.treatmentPlanId, parseInt(id)))
        .orderBy(treatmentPlanPhases.phaseNumber);

      res.json({ ...plan[0], phases });
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      res.status(500).json({ error: 'Failed to fetch treatment plan' });
    }
  }

  // Create a new treatment plan
  async createTreatmentPlan(req, res) {
    try {
      const {
        patientId,
        doctorId,
        title,
        description,
        priority,
        totalCost,
        estimatedDuration,
        startDate,
        endDate,
        notes,
        phases
      } = req.body;

      if (!patientId || !doctorId || !title) {
        return res.status(400).json({ error: 'Patient ID, doctor ID, and title are required' });
      }

      // Create treatment plan
      const newPlan = await db.insert(treatmentPlans).values({
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        title,
        description: description || null,
        priority: priority || 'medium',
        totalCost: totalCost || 0,
        estimatedDuration: estimatedDuration || null,
        startDate: startDate || null,
        endDate: endDate || null,
        notes: notes || null,
      }).returning();

      // Create phases if provided
      if (phases && Array.isArray(phases) && phases.length > 0) {
        const phasesData = phases.map((phase, index) => ({
          treatmentPlanId: newPlan[0].id,
          phaseNumber: index + 1,
          title: phase.title,
          description: phase.description || null,
          cost: phase.cost || 0,
          estimatedDuration: phase.estimatedDuration || null,
          startDate: phase.startDate || null,
          notes: phase.notes || null,
        }));

        await db.insert(treatmentPlanPhases).values(phasesData);
      }

      res.status(201).json(newPlan[0]);
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      res.status(500).json({ error: 'Failed to create treatment plan' });
    }
  }

  // Update treatment plan
  async updateTreatmentPlan(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedPlan = await db.update(treatmentPlans)
        .set({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(treatmentPlans.id, parseInt(id)))
        .returning();

      if (!updatedPlan || updatedPlan.length === 0) {
        return res.status(404).json({ error: 'Treatment plan not found' });
      }

      res.json(updatedPlan[0]);
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      res.status(500).json({ error: 'Failed to update treatment plan' });
    }
  }

  // Update treatment plan status
  async updateTreatmentPlanStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, completionDate } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updates = {
        status,
        updatedAt: new Date().toISOString(),
      };

      if (status === 'completed' && completionDate) {
        updates.completionDate = completionDate;
      }

      const updatedPlan = await db.update(treatmentPlans)
        .set(updates)
        .where(eq(treatmentPlans.id, parseInt(id)))
        .returning();

      if (!updatedPlan || updatedPlan.length === 0) {
        return res.status(404).json({ error: 'Treatment plan not found' });
      }

      res.json(updatedPlan[0]);
    } catch (error) {
      console.error('Error updating treatment plan status:', error);
      res.status(500).json({ error: 'Failed to update treatment plan status' });
    }
  }

  // Delete treatment plan
  async deleteTreatmentPlan(req, res) {
    try {
      const { id } = req.params;

      // Delete phases first
      await db.delete(treatmentPlanPhases)
        .where(eq(treatmentPlanPhases.treatmentPlanId, parseInt(id)));

      // Delete treatment plan
      const deletedPlan = await db.delete(treatmentPlans)
        .where(eq(treatmentPlans.id, parseInt(id)))
        .returning();

      if (!deletedPlan || deletedPlan.length === 0) {
        return res.status(404).json({ error: 'Treatment plan not found' });
      }

      res.json({ message: 'Treatment plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      res.status(500).json({ error: 'Failed to delete treatment plan' });
    }
  }

  // Add phase to treatment plan
  async addPhase(req, res) {
    try {
      const { id } = req.params;
      const { title, description, cost, estimatedDuration, startDate, notes } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Phase title is required' });
      }

      // Get current max phase number
      const existingPhases = await db.select()
        .from(treatmentPlanPhases)
        .where(eq(treatmentPlanPhases.treatmentPlanId, parseInt(id)));

      const phaseNumber = existingPhases.length + 1;

      const newPhase = await db.insert(treatmentPlanPhases).values({
        treatmentPlanId: parseInt(id),
        phaseNumber,
        title,
        description: description || null,
        cost: cost || 0,
        estimatedDuration: estimatedDuration || null,
        startDate: startDate || null,
        notes: notes || null,
      }).returning();

      res.status(201).json(newPhase[0]);
    } catch (error) {
      console.error('Error adding phase:', error);
      res.status(500).json({ error: 'Failed to add phase' });
    }
  }

  // Update phase
  async updatePhase(req, res) {
    try {
      const { id, phaseId } = req.params;
      const updates = req.body;

      const updatedPhase = await db.update(treatmentPlanPhases)
        .set({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(treatmentPlanPhases.id, parseInt(phaseId)))
        .returning();

      if (!updatedPhase || updatedPhase.length === 0) {
        return res.status(404).json({ error: 'Phase not found' });
      }

      res.json(updatedPhase[0]);
    } catch (error) {
      console.error('Error updating phase:', error);
      res.status(500).json({ error: 'Failed to update phase' });
    }
  }

  // Delete phase
  async deletePhase(req, res) {
    try {
      const { id, phaseId } = req.params;

      const deletedPhase = await db.delete(treatmentPlanPhases)
        .where(eq(treatmentPlanPhases.id, parseInt(phaseId)))
        .returning();

      if (!deletedPhase || deletedPhase.length === 0) {
        return res.status(404).json({ error: 'Phase not found' });
      }

      res.json({ message: 'Phase deleted successfully' });
    } catch (error) {
      console.error('Error deleting phase:', error);
      res.status(500).json({ error: 'Failed to delete phase' });
    }
  }
}

module.exports = new TreatmentPlanController();
