const { db } = require('../db');
const { bills, appointments } = require('../db/schema');
const { sql, eq, and, gte, lte } = require('drizzle-orm');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's financial data
    const todayStats = await db
      .select({
        totalPaid: sql`COALESCE(SUM(${bills.amountPaid}), 0)`,
        totalReceivable: sql`COALESCE(SUM(${bills.newBalanceAfter}), 0)`,
      })
      .from(bills)
      .innerJoin(appointments, eq(bills.appointmentId, appointments.id))
      .where(eq(appointments.date, today));

    // Get all-time financial data
    const allTimeStats = await db
      .select({
        totalPaid: sql`COALESCE(SUM(${bills.amountPaid}), 0)`,
        totalReceivable: sql`COALESCE(SUM(${bills.newBalanceAfter}), 0)`,
      })
      .from(bills);

    const result = {
      today_total_gross_income: todayStats[0]?.totalPaid || 0,
      today_total_receivable: todayStats[0]?.totalReceivable || 0,
      all_total_gross_income: allTimeStats[0]?.totalPaid || 0,
      all_total_receivable: allTimeStats[0]?.totalReceivable || 0,
    };

    res.json(result);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats,
};