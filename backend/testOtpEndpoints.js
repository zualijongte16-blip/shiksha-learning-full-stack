const axios = require('axios');
// Import Node.js's built-in module for reading terminal input
const readline = require('readline');

// --- Configuration ---
const baseUrl = 'http://localhost:5000';
const testUser = {
  email: 'testuser@example.com',
  role: 'student',
  newPassword: 'newPassword123'
};

// Create an interface to read from and write to the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Part 1: Requests a password reset token/OTP.
 */
async function requestPasswordReset() {
  try {
    console.log(`\nAttempting to request a password reset for ${testUser.email}...`);
    const response = await axios.post(`${baseUrl}/reset-password`, {
      email: testUser.email,
      role: testUser.role
    });
    console.log('✅ Success:', response.data);
    return true; // Indicate that the request was successful
  } catch (error) {
    console.error('❌ Error requesting reset:', error.response ? error.response.data : error.message);
    return false; // Indicate failure
  }
}

/**
 * Part 2: Verifies the OTP and sets the new password.
 * @param {string} otp - The one-time password provided by the user.
 */
async function verifyOtpAndResetPassword(otp) {
  try {
    console.log(`\nVerifying OTP and setting new password...`);
    const response = await axios.post(`${baseUrl}/verify-otp-reset-password`, {
      email: testUser.email,
      role: testUser.role,
      otp: otp, // Use the OTP from the user input
      newPassword: testUser.newPassword
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error verifying OTP:', error.response ? error.response.data : error.message);
  }
}

/**
 * Main function to orchestrate the two-step test flow.
 */
async function runInteractiveTest() {
  const wasRequestSuccessful = await requestPasswordReset();

  // Only ask for the OTP if the first step succeeded
  if (wasRequestSuccessful) {
    // Prompt the user to enter the OTP in the terminal
    rl.question('\nPlease check your email/SMS and enter the OTP here: ', async (otp) => {
      // The 'otp' variable now holds the user's input
      await verifyOtpAndResetPassword(otp.trim()); // .trim() removes any accidental whitespace
      rl.close(); // Close the readline interface
    });
  } else {
    console.log('\nAborting test because the initial reset request failed.');
    rl.close();
  }
}

// --- Run the Test ---
runInteractiveTest();