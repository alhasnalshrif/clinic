const { db } = require('./src/db');
const { users, patients, appointments, treatments, bills, adultTeethCharts, childTeethCharts, authTokens } = require('./src/db/schema');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@clinic.com',
      firstName: 'Admin',
      lastName: 'User',
      group: 'ADMIN',
      isStaff: true,
      isSuperuser: true,
    }).returning();

    // Create manager user
    const hashedPassword2 = await bcrypt.hash('manager123', 10);
    const managerUser = await db.insert(users).values({
      username: 'manager',
      password: hashedPassword2,
      email: 'manager@clinic.com',
      firstName: 'Manager',
      lastName: 'User',
      group: 'MANAGER',
    }).returning();

    // Create auth tokens
    const adminToken = crypto.randomBytes(20).toString('hex');
    const managerToken = crypto.randomBytes(20).toString('hex');

    await db.insert(authTokens).values([
      { key: adminToken, userId: adminUser[0].id },
      { key: managerToken, userId: managerUser[0].id }
    ]);

    // Create sample patients
    const patient1 = await db.insert(patients).values({
      doctorId: adminUser[0].id,
      name: 'John Doe',
      phone: '+1234567890',
      bloodgroup: 'A+',
      sex: 'MALE',
      age: 30,
    }).returning();

    const patient2 = await db.insert(patients).values({
      doctorId: managerUser[0].id,
      name: 'Jane Smith',
      phone: '+0987654321',
      bloodgroup: 'B+',
      sex: 'FEMALE',
      age: 25,
    }).returning();

    // Create teeth charts for patients (auto-created by triggers in Django, manual here)
    await db.insert(adultTeethCharts).values([
      { patientId: patient1[0].id },
      { patientId: patient2[0].id }
    ]);

    await db.insert(childTeethCharts).values([
      { patientId: patient1[0].id },
      { patientId: patient2[0].id }
    ]);

    // Create sample appointments
    const appointment1 = await db.insert(appointments).values({
      patientId: patient1[0].id,
      doctorId: adminUser[0].id,
      token: 1001,
      date: '2024-01-15',
      time: '09:00',
      reason: 'Regular checkup',
    }).returning();

    const appointment2 = await db.insert(appointments).values({
      patientId: patient2[0].id,
      doctorId: managerUser[0].id,
      token: 1002,
      date: '2024-01-16',
      time: '14:30',
      reason: 'Tooth cleaning',
    }).returning();

    // Create bills for appointments
    await db.insert(bills).values([
      { 
        appointmentId: appointment1[0].id,
        amountPaid: 150,
        currentBalanceBefore: 0,
        newBalanceAfter: 150
      },
      { 
        appointmentId: appointment2[0].id,
        amountPaid: 0,
        currentBalanceBefore: 0,
        newBalanceAfter: 0
      }
    ]);

    // Create sample treatments
    await db.insert(treatments).values([
      {
        patientId: patient1[0].id,
        title: 'Cavity Filling',
        token: 1001,
        description: 'Filled cavity in upper right molar',
        toothPosition: 'UR_6',
        dentalTest: 'X-ray examination'
      },
      {
        patientId: patient2[0].id,
        title: 'Teeth Cleaning',
        token: 1002,
        description: 'Professional dental cleaning',
        toothPosition: 'All',
        dentalTest: 'Visual examination'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`👤 Admin user: admin / admin123 (token: ${adminToken})`);
    console.log(`👤 Manager user: manager / manager123 (token: ${managerToken})`);
    console.log(`👥 Created ${patient1[0].id}, ${patient2[0].id} sample patients`);
    console.log(`📅 Created ${appointment1[0].id}, ${appointment2[0].id} sample appointments`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('🌱 Seeding complete!');
    process.exit(0);
  });
}

module.exports = seedDatabase;