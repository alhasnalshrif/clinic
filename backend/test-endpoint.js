const axios = require('axios');

async function testAuthEndpoint() {
  try {
    console.log('Testing auth endpoint directly...');
    
    const response = await axios.post('http://localhost:8000/api-token-auth/', {
      username: 'admin',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Success!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status);
    console.log('Error message:', error.response?.data);
    console.log('Full error:', error.message);
  }
}

testAuthEndpoint();
