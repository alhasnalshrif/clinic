const { db } = require('./src/db');
const { users, authTokens } = require('./src/db/schema');
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
      group: 'admin',
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
      group: 'manager',
    }).returning();

    // Create auth tokens
    const adminToken = crypto.randomBytes(20).toString('hex');
    const managerToken = crypto.randomBytes(20).toString('hex');

    await db.insert(authTokens).values([
      { key: adminToken, userId: adminUser[0].id },
      { key: managerToken, userId: managerUser[0].id }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`👤 Admin user: admin / admin123 (token: ${adminToken})`);
    console.log(`👤 Manager user: manager / manager123 (token: ${managerToken})`);
    console.log('');
    console.log('📝 Note: No sample patients or appointments created.');
    console.log('   Use the application to add real data or run setup-users.js for additional users.');
    
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