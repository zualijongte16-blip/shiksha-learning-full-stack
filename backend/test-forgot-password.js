const axios = require('axios');

async function testForgotPassword() {
  try {
    console.log('Testing forgot password endpoint...');

    const response = await axios.post('http://localhost:3001/api/auth/forgot-password', {
      identifier: 'test@example.com'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error Request (no response):', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

testForgotPassword();
