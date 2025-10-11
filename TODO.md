# TODO for Shiksha3 Registration Page Redesign

## Steps to Complete:

- [x] Update shiksha3/frontend/src/components/SignupForm.js: 
  - Simplify form fields to: Name (single input combining first/last), Phone, Password, Confirm Password.
  - Add client-side validation for password matching and phone format (reuse existing validatePhone).
  - Remove class, address, registration fee, and duplicate user logic if not needed; keep email if backend expects, but image shows no email.
  - Update layout: Full blue background (#A5D8FF), left side with female illustration (use placeholder or CSS), right white form card with title "NEW ACCOUNT?", fields with light backgrounds, "REGISTER" button.
  - Submit to http://localhost:5001/api/auth/register with { name, phone, password } (adapt backend if needed, but for now send without password as temp is set).
  - Add link to login.

- [x] Update shiksha3/frontend/src/components/Form.css:
  - Add global styles for page: body background light blue.
  - Styles for container: flex layout with left illustration (position absolute or flex), right form card (white, rounded, shadow).
  - Form title: "NEW ACCOUNT?" centered, bold.
  - Inputs: full width, padding, light blue background (#dbeafe), border, focus effects.
  - Button: Blue (#3b82f6), full width, "REGISTER" text.
  - Add plant icon at bottom right (use SVG or image).
  - Ensure responsive for mobile.

- [ ] Test the changes:
  - Run frontend dev server: cd shiksha3/frontend && npm install && npm start (if not running).
  - Use browser_action to launch http://localhost:3000/signup or relevant route, verify visual match to image, submit form with valid data (e.g., name: "Test User", phone: "+919876543210", password: "123", confirm: "123"), check for success/error.
  - Verify backend receives request (mock-server logs).

- [x] Update TODO.md: Mark completed steps and note any issues.
