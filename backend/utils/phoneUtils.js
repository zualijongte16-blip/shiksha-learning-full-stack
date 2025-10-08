/**
 * Utility functions for phone number validation and formatting for Indian numbers.
 */

const INDIA_PHONE_PREFIXES = ['60', '811', '812', '813', '814', '815', '816', '817', '818', '819'];

/**
 * Validates if the phone number is in valid Indian format.
 * Allowed formats:
 * - Starts with +91 followed by 10 digits

 * - Starts with allowed prefixes followed by correct number of digits to total 10 digits
 *

 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - true if valid, false otherwise
 */
function isValidIndianPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;

  // Check if starts with +91 and 10 digits
  const regexPlus91 = /^\+91\d{10}$/;
  if (regexPlus91.test(phoneNumber)) {
    return true;
  }


  // Check if total length is 10 digits and starts with allowed prefix
  if (phoneNumber.length === 10) {
    for (const prefix of INDIA_PHONE_PREFIXES) {
      if (phoneNumber.startsWith(prefix)) {
        return true;
      }

    }
  }

  return false;
}

/**
 * Formats the phone number to a standard Indian format.
 * If phone number starts with allowed prefix, prepend +91.
 * If already starts with +91, return as is.
 * Otherwise, return null.

 *

 * @param {string} phoneNumber - The phone number to format
 * @returns {string|null} - Formatted phone number or null if invalid
 */
function formatIndianPhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;

  if (phoneNumber.startsWith('+91') && phoneNumber.length === 13) {
    return phoneNumber;
  }


  // Check if it's a valid 10-digit number starting with allowed prefix
  if (phoneNumber.length === 10) {
    for (const prefix of INDIA_PHONE_PREFIXES) {
      if (phoneNumber.startsWith(prefix)) {
        return '+91' + phoneNumber;
      }

    }
  }

  return null;
}

module.exports = {
  isValidIndianPhoneNumber,
  formatIndianPhoneNumber,
};
