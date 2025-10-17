// backend/routes/materialRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const materialController = require('../controllers/materialController');

const router = express.Router();

// --- Multer Storage Configuration ---
// This tells Multer where to save the files and how to name them.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be saved in the 'backend/uploads/' directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // The filename will be unique: timestamp + original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// --- Define API Routes ---

// POST /api/materials/upload
// The 'upload.single('materialFile')' part is the middleware.
// It tells Multer to expect a single file from a form field named 'materialFile'.
router.post('/upload', upload.single('materialFile'), materialController.uploadMaterial);

// GET /api/materials/course/:courseId
router.get('/course/:courseId', materialController.getMaterialsByCourse);

// DELETE /api/materials/:id
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;