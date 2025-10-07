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
const superadminRoutes = require('./routes/superadminRoutes');
const testRoutes = require('./routes/testRoutes');
// ... import your other route files here

// --- Middleware ---
// Enable CORS for frontend origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:5001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5001'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));
app.use(express.json());

// --- Make the 'uploads' folder static ---
// This allows the frontend to access files via URLs like 'http://localhost:5001/uploads/filename.pdf'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Use API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/tests', testRoutes);
// ... use your other routes here

// Serve coursesF/merncourses/public as static files at /courses
app.use('/courses', express.static(path.join(__dirname, '../coursesF/merncourses/public')));

module.exports = app;
