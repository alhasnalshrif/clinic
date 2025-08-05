#!/usr/bin/env node

/**
 * Setup script to create default users for the clinic system
 * Run with: node setup-users.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

// Default users to create
const defaultUsers = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@clinic.com',
    firstName: 'مدير',
    lastName: 'النظام',
    group: 'admin'
  },
  {
    username: 'doctor1',
    password: 'doctor123',
    email: 'doctor@clinic.com',
    firstName: 'أحمد',
    lastName: 'الطبيب',
    group: 'doctor'
  },
  {
    username: 'nurse1',
    password: 'nurse123',
    email: 'nurse@clinic.com',
    firstName: 'فاطمة',
    lastName: 'الممرضة',
    group: 'nurse'
  },
  {
    username: 'reception1',
    password: 'reception123',
    email: 'reception@clinic.com',
    firstName: 'محمد',
    lastName: 'الاستقبال',
    group: 'receptionist'
  },
  {
    username: 'manager1',
    password: 'manager123',
    email: 'manager@clinic.com',
    firstName: 'سارة',
    lastName: 'المدير',
    group: 'manager'
  }
];

async function createUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/register/`, userData);
    console.log(`✅ Created user: ${userData.username} (${userData.group})`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error?.includes('already exists')) {
      console.log(`⚠️  User ${userData.username} already exists`);
    } else {
      console.error(`❌ Failed to create user ${userData.username}:`, 
        error.response?.data?.error || error.message);
    }
    return null;
  }
}

async function setupUsers() {
  console.log('🚀 Setting up default users...\n');

  for (const userData of defaultUsers) {
    await createUser(userData);
  }

  console.log('\n✅ User setup completed!');
  console.log('\nDefault login credentials:');
  console.log('=' * 40);
  
  defaultUsers.forEach(user => {
    console.log(`${user.group.padEnd(12)} | ${user.username.padEnd(12)} | ${user.password}`);
  });
  
  console.log('\n📝 Remember to change these passwords in production!');
}

// Check if backend is running
async function checkBackend() {
  try {
    await axios.get(`${BASE_URL}/register/`);
    return true;
  } catch (error) {
    if (error.response?.status === 405) {
      // Method not allowed means endpoint exists
      return true;
    }
    return false;
  }
}

// Main execution
(async () => {
  console.log('🔍 Checking if backend is running...');
  
  const isRunning = await checkBackend();
  if (!isRunning) {
    console.error('❌ Backend is not running!');
    console.log('Please start the backend server first:');
    console.log('cd backend && npm start');
    process.exit(1);
  }
  
  console.log('✅ Backend is running\n');
  await setupUsers();
})();
