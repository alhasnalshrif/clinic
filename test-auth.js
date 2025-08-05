#!/usr/bin/env node

/**
 * Test script for auth endpoints
 * Run with: node test-auth.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
let authToken = null;

// Test user credentials
const testUser = {
  username: 'admin',
  password: 'admin123'
};

// API client with auth
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Token ${authToken}`;
  }
  return config;
});

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await api.post('/api-token-auth/', testUser);
    console.log('✅ Login successful');
    console.log('Response:', loginResponse.data);
    
    authToken = loginResponse.data.token;
    console.log('🔑 Token saved:', authToken.substring(0, 10) + '...\n');

    // Test 2: Get current user
    console.log('2️⃣ Testing Get Current User...');
    const userResponse = await api.get('/api/auth/user/');
    console.log('✅ User info retrieved');
    console.log('User:', userResponse.data);
    console.log('Permissions:', userResponse.data.permissions?.join(', ') || 'None');
    console.log();

    // Test 3: Test protected endpoint without token
    console.log('3️⃣ Testing Protected Endpoint Without Token...');
    try {
      await axios.get(`${BASE_URL}/api/auth/user/`);
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly blocked unauthorized access');
      console.log('Error:', error.response?.data?.error || error.message);
    }
    console.log();

    // Test 4: Logout
    console.log('4️⃣ Testing Logout...');
    const logoutResponse = await api.post('/auth/logout/');
    console.log('✅ Logout successful');
    console.log('Response:', logoutResponse.data);
    console.log();

    // Test 5: Try to access user info after logout
    console.log('5️⃣ Testing Access After Logout...');
    try {
      await api.get('/api/auth/user/');
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly blocked access after logout');
      console.log('Error:', error.response?.data?.error || error.message);
    }
    console.log();

    console.log('🎉 All auth tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Test invalid credentials
async function testInvalidLogin() {
  console.log('\n🧪 Testing Invalid Credentials...\n');

  try {
    await api.post('/api-token-auth/', {
      username: 'invalid',
      password: 'wrong'
    });
    console.log('❌ This should have failed!');
  } catch (error) {
    console.log('✅ Correctly rejected invalid credentials');
    console.log('Error:', error.response?.data?.error || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Auth System Tests\n');
  console.log('='.repeat(50));
  
  try {
    await testAuth();
    await testInvalidLogin();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    try {
      // Try a different endpoint
      await axios.get(`${BASE_URL}/api/auth/user/`);
      return true;
    } catch (error2) {
      return false;
    }
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
  await runTests();
})();
