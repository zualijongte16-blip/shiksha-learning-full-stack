const axios = require('axios');

async function testTeacherLogin() {
  try {
    console.log('Testing teacher login with ID 2001...');

    const response = await axios.post('http://localhost:5001/api/auth/login', {
      uniqueId: '2001',
      password: '2001', // Default password is same as teacher ID
      role: 'teacher'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ Login failed:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testTeacherLogin();