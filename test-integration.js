#!/usr/bin/env node

/**
 * Integration test to verify all endpoints work correctly
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testEndpoints() {
  console.log('🧪 Testing Backend API Endpoints...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`,
      expectedStatus: 200
    },
    {
      name: 'Dashboard Stats',
      url: `${BASE_URL}/dashboard/incomereceivable`,
      expectedStatus: 200
    },
    {
      name: 'SMS Stats',
      url: `${BASE_URL}/sms/stats`,
      expectedStatus: 200,
      expectedFields: ['totalMessages', 'sentToday', 'delivered', 'pending']
    },
    {
      name: 'Reports',
      url: `${BASE_URL}/reports/?startDate=2024-01-01&endDate=2024-12-31`,
      expectedStatus: 200,
      expectedFields: ['financial', 'patients', 'treatments', 'appointments']
    },
    {
      name: 'Medical History (patient 1)',
      url: `${BASE_URL}/medical-history/1`,
      expectedStatus: 200
    },
    {
      name: 'Payments',
      url: `${BASE_URL}/payment/`,
      expectedStatus: 200
    },
    {
      name: 'Patients',
      url: `${BASE_URL}/patient/`,
      expectedStatus: 200
    },
    {
      name: 'Appointments',
      url: `${BASE_URL}/appointments/`,
      expectedStatus: 200
    },
    {
      name: 'Treatments',
      url: `${BASE_URL}/treatments/`,
      expectedStatus: 200
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const response = await axios.get(test.url);
      
      if (response.status === test.expectedStatus) {
        // Check expected fields if specified
        if (test.expectedFields) {
          const hasAllFields = test.expectedFields.every(field => 
            response.data.hasOwnProperty(field)
          );
          
          if (hasAllFields) {
            console.log(`✅ ${test.name} - PASSED`);
            passed++;
          } else {
            console.log(`❌ ${test.name} - FAILED (missing fields)`);
            console.log(`   Expected fields: ${test.expectedFields.join(', ')}`);
            console.log(`   Got fields: ${Object.keys(response.data).join(', ')}`);
            failed++;
          }
        } else {
          console.log(`✅ ${test.name} - PASSED`);
          passed++;
        }
      } else {
        console.log(`❌ ${test.name} - FAILED (wrong status: ${response.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  console.log('🔍 Checking if backend is running...\n');
  
  const isRunning = await checkBackend();
  if (!isRunning) {
    console.error('❌ Backend is not running!');
    console.log('Please start the backend server first:');
    console.log('cd backend && npm start');
    process.exit(1);
  }
  
  console.log('✅ Backend is running\n');
  await testEndpoints();
})();
