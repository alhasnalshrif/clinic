const { db } = require('../db');
const { smsMessages, patients } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

class SMSController {
  // Get SMS statistics
  async getSMSStats(req, res) {
    try {
      // Get all messages
      const allMessages = await db.select().from(smsMessages);
      
      // Calculate stats
      const totalMessages = allMessages.length;
      const delivered = allMessages.filter(msg => msg.status === 'delivered').length;
      const pending = allMessages.filter(msg => msg.status === 'pending').length;
      
      // Get today's messages
      const today = new Date().toISOString().split('T')[0];
      const sentToday = allMessages.filter(msg => 
        msg.sentAt && msg.sentAt.startsWith(today)
      ).length;

      res.json({
        totalMessages,
        sentToday,
        delivered,
        pending
      });
    } catch (error) {
      console.error('Get SMS stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all SMS messages
  async getSMSMessages(req, res) {
    try {
      const messages = await db.select({
        id: smsMessages.id,
        patientId: smsMessages.patientId,
        phone: smsMessages.phone,
        message: smsMessages.message,
        status: smsMessages.status,
        sentAt: smsMessages.sentAt,
        deliveredAt: smsMessages.deliveredAt,
        createdAt: smsMessages.createdAt,
        patient: {
          id: patients.id,
          name: patients.name,
        }
      })
        .from(smsMessages)
        .leftJoin(patients, eq(smsMessages.patientId, patients.id))
        .orderBy(desc(smsMessages.createdAt));

      res.json(messages);
    } catch (error) {
      console.error('Get SMS messages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Send SMS message
  async sendSMS(req, res) {
    try {
      const { patientId, phone, message } = req.body;

      if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
      }

      const newMessage = await db.insert(smsMessages).values({
        patientId: patientId ? parseInt(patientId) : null,
        phone,
        message,
        status: 'pending',
      }).returning();

      // In a real implementation, you would integrate with an SMS gateway here
      // For now, we'll just mark it as sent
      setTimeout(async () => {
        await db.update(smsMessages)
          .set({
            status: 'sent',
            sentAt: new Date().toISOString(),
          })
          .where(eq(smsMessages.id, newMessage[0].id));
      }, 1000);

      res.status(201).json(newMessage[0]);
    } catch (error) {
      console.error('Send SMS error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update SMS status
  async updateSMSStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedMessage = await db.update(smsMessages)
        .set({
          status,
          deliveredAt: status === 'delivered' ? new Date().toISOString() : null,
        })
        .where(eq(smsMessages.id, parseInt(id)))
        .returning();

      if (!updatedMessage || updatedMessage.length === 0) {
        return res.status(404).json({ error: 'SMS message not found' });
      }

      res.json(updatedMessage[0]);
    } catch (error) {
      console.error('Update SMS status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new SMSController();
