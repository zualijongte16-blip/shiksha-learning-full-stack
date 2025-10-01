# TODO - Thorough Testing for OTP Sending and Verification

## Backend OTP Functionality Testing

1. Test /reset-password endpoint:
   - Send OTP with valid email/uniqueId and role.
   - Send OTP with missing or invalid email/uniqueId.
   - Send OTP with invalid role.
   - Send OTP for user with missing or invalid phone number.

2. Test /verify-otp-reset-password endpoint:
   - Verify OTP with correct OTP and new password.
   - Verify OTP with incorrect OTP.
   - Verify OTP with expired OTP.
   - Verify OTP with missing fields.

3. Check backend logs:
   - Review logs for detailed Twilio error messages during OTP sending failures.

4. Verify phone number formats:
   - Check user phone numbers in database for valid E.164 format.

5. Check Twilio account:
   - Verify account status, trial restrictions, and SMS sending limits.

## Next Steps
- Execute tests using curl or Postman.
- Analyze results and logs.
- Fix any issues found during testing.
