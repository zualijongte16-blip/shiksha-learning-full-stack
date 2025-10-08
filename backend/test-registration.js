const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration with a unique phone number...');

    // Use a definitely unique phone number
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      class: '8',
      address: 'Test Address',
      email: 'test' + Date.now() + '@example.com',
      phone: '811' + Date.now().toString().slice(-7), // Creates a unique phone number with valid prefix
      registrationFee: 1500
    };

    console.log('Test data:', testData);

    const response = await axios.post('http://localhost:5001/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Registration successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Registration failed:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();