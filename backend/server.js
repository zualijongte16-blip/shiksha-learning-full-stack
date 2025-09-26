// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Add path module
const connectDB = require('./data/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const adminRoutes = require('./routes/adminRoutes');
// ... import your other route files here

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Make the 'uploads' folder static ---
// This allows the frontend to access files via URLs like 'http://localhost:5001/uploads/filename.pdf'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Use API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
// ... use your other routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
