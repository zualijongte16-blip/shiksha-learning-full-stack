require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function sendSms(phoneNumber, message) {
  try {
    const messageInstance = await client.messages.create({
      body: message,
      from: fromPhone,
      to: phoneNumber
    });
    console.log(`SMS sent to ${phoneNumber}: SID ${messageInstance.sid}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send SMS to ${phoneNumber}:`, error);
    // Return detailed error message for debugging
    return { success: false, error: error.message, fullError: error };
  }
}

module.exports = sendSms;
