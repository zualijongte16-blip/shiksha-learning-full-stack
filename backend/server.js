// backend/server.js

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path'); // Add path module
const connectDB = require('./data/db');

const app = express();

// Connect to MongoDB
connectDB();

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/testRoutes');
// ... import your other route files here

// --- Middleware ---
// Enable CORS for frontend origins
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3004', 'http://localhost:3005'],
  credentials: true,
}));
app.use(express.json());

// --- Make the 'uploads' folder static ---
// This allows the frontend to access files via URLs like 'http://localhost:5001/uploads/filename.pdf'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Use API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes);
// ... use your other routes here

// Serve coursesF/merncourses/public as static files at /courses
app.use('/courses', express.static(path.join(__dirname, '../coursesF/merncourses/public')));

module.exports = app;
