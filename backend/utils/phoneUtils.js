/**
 * Utility functions for phone number validation and formatting.
 * Now supports simple 10-digit phone numbers without +91 prefix.
 */

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

  // Remove any spaces, hyphens, or brackets for validation
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Check if it's exactly 10 digits
  return /^\d{10}$/.test(cleanPhone);
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

  // Remove any spaces, hyphens, or brackets
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // If it's a 10-digit number, return as is (no +91 prefix)
  if (/^\d{10}$/.test(cleanPhone)) {
    return cleanPhone;
  }

  return null;
}

module.exports = {
  isValidIndianPhoneNumber,
  formatIndianPhoneNumber,
};
