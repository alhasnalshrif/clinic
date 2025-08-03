const { db } = require('../db');
const { adultTeethCharts, childTeethCharts, patients } = require('../db/schema');
const { eq } = require('drizzle-orm');

class TeethChartController {
  // Get adult teeth chart by patient ID
  async getAdultTeethChart(req, res) {
    try {
      const { patientId } = req.params;
      
      const chart = await db.select()
        .from(adultTeethCharts)
        .where(eq(adultTeethCharts.patientId, parseInt(patientId)));

      if (!chart || chart.length === 0) {
        return res.status(404).json({ error: 'Adult teeth chart not found' });
      }

      res.json(chart[0]);
    } catch (error) {
      console.error('Get adult teeth chart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get child teeth chart by patient ID
  async getChildTeethChart(req, res) {
    try {
      const { patientId } = req.params;
      
      const chart = await db.select()
        .from(childTeethCharts)
        .where(eq(childTeethCharts.patientId, parseInt(patientId)));

      if (!chart || chart.length === 0) {
        return res.status(404).json({ error: 'Child teeth chart not found' });
      }

      res.json(chart[0]);
    } catch (error) {
      console.error('Get child teeth chart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update adult teeth chart
  async updateAdultTeethChart(req, res) {
    try {
      const { id } = req.params;
      const teethData = req.body;

      // Remove non-teeth fields
      const { patientId, ...teethUpdates } = teethData;

      const updatedChart = await db.update(adultTeethCharts)
        .set(teethUpdates)
        .where(eq(adultTeethCharts.id, parseInt(id)))
        .returning();

      if (!updatedChart || updatedChart.length === 0) {
        return res.status(404).json({ error: 'Adult teeth chart not found' });
      }

      res.json(updatedChart[0]);
    } catch (error) {
      console.error('Update adult teeth chart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update child teeth chart
  async updateChildTeethChart(req, res) {
    try {
      const { id } = req.params;
      const teethData = req.body;

      // Remove non-teeth fields
      const { patientId, ...teethUpdates } = teethData;

      const updatedChart = await db.update(childTeethCharts)
        .set(teethUpdates)
        .where(eq(childTeethCharts.id, parseInt(id)))
        .returning();

      if (!updatedChart || updatedChart.length === 0) {
        return res.status(404).json({ error: 'Child teeth chart not found' });
      }

      res.json(updatedChart[0]);
    } catch (error) {
      console.error('Update child teeth chart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all adult teeth charts
  async getAllAdultTeethCharts(req, res) {
    try {
      const charts = await db.select({
        id: adultTeethCharts.id,
        patientId: adultTeethCharts.patientId,
        patient: {
          id: patients.id,
          name: patients.name,
        },
        ...Object.fromEntries(
          Object.keys(adultTeethCharts).filter(key => key.startsWith('UR_') || key.startsWith('UL_') || key.startsWith('LL_') || key.startsWith('LR_'))
            .map(key => [key, adultTeethCharts[key]])
        )
      })
        .from(adultTeethCharts)
        .leftJoin(patients, eq(adultTeethCharts.patientId, patients.id));

      res.json(charts);
    } catch (error) {
      console.error('Get all adult teeth charts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all child teeth charts
  async getAllChildTeethCharts(req, res) {
    try {
      const charts = await db.select({
        id: childTeethCharts.id,
        patientId: childTeethCharts.patientId,
        patient: {
          id: patients.id,
          name: patients.name,
        },
        ...Object.fromEntries(
          Object.keys(childTeethCharts).filter(key => key.startsWith('UR_') || key.startsWith('UL_') || key.startsWith('LL_') || key.startsWith('LR_'))
            .map(key => [key, childTeethCharts[key]])
        )
      })
        .from(childTeethCharts)
        .leftJoin(patients, eq(childTeethCharts.patientId, patients.id));

      res.json(charts);
    } catch (error) {
      console.error('Get all child teeth charts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get adult teeth chart by ID
  async getAdultTeethChartById(req, res) {
    try {
      const { id } = req.params;
      
      const chart = await db.select()
        .from(adultTeethCharts)
        .where(eq(adultTeethCharts.id, parseInt(id)));

      if (!chart || chart.length === 0) {
        return res.status(404).json({ error: 'Adult teeth chart not found' });
      }

      res.json(chart[0]);
    } catch (error) {
      console.error('Get adult teeth chart by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get child teeth chart by ID
  async getChildTeethChartById(req, res) {
    try {
      const { id } = req.params;
      
      const chart = await db.select()
        .from(childTeethCharts)
        .where(eq(childTeethCharts.id, parseInt(id)));

      if (!chart || chart.length === 0) {
        return res.status(404).json({ error: 'Child teeth chart not found' });
      }

      res.json(chart[0]);
    } catch (error) {
      console.error('Get child teeth chart by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new TeethChartController();