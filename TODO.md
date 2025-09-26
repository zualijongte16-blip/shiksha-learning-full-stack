# TODO: Add Admin Login to Login Form

- [x] Add admin user to db.json with role 'admin', email 'admin@shiksha.edu', hashed password for 'admin123'
- [x] Update authController.js loginUser function to handle role === 'admin' with email and password
- [x] Update LoginForm.js to add "Admin Login" toggle button and corresponding form fields (email and password)
- [x] Test the admin login functionality (Use email: admin@shiksha.edu, password: admin123)

# TODO: Create Admin Dashboard

- [x] Create AdminDashboard.js component with sidebar navigation and main content area
- [x] Create AdminDashboard.css for styling
- [x] Update AuthContainer.js to route admin login to AdminDashboard
- [x] Create adminController.js with API endpoints for dashboard data
- [x] Create adminRoutes.js for admin API routes
- [x] Update server.js to include admin routes
- [x] Implement Dashboard Overview with key stats, charts, and quick actions
- [x] Implement Student Management section with student profiles and management
- [x] Implement Teacher Management section with teacher profiles and assignments
- [x] Implement Course Management section with course CRUD operations
- [x] Implement Reports & Analytics section with charts and reports
- [x] Add responsive design for mobile compatibility
