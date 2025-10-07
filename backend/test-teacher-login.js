const axios = require('axios');

async function testTeacherLogin() {
  try {
    console.log('Testing teacher login with ID: 2001, password: 2001');
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      role: 'teacher',
      uniqueId: '2001',
      password: '2001'
    });
    console.log('✅ Login successful:', response.data);
  } catch (error) {
    console.error('❌ Login failed:', error.response ? error.response.data : error.message);
  }
}

testTeacherLogin();