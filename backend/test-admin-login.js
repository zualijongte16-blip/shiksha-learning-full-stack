const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing Admin login with ID AD001...');

    const response = await axios.post('http://localhost:5001/api/auth/login', {
      uniqueId: 'AD001',
      password: 'admin123',
      role: 'admin'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Admin Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ Admin Login failed:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testAdminLogin();