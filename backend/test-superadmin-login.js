const axios = require('axios');

async function testSuperAdminLogin() {
  try {
    console.log('Testing SuperAdmin login with ID SA001...');

    const response = await axios.post('http://localhost:5001/api/auth/login', {
      uniqueId: 'SA001',
      password: 'superadmin123',
      role: 'superadmin'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SuperAdmin Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ SuperAdmin Login failed:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testSuperAdminLogin();