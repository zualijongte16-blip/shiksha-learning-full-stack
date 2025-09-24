const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const readDb = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all materials for a specific course
exports.getMaterialsByCourse = (req, res) => {
  const db = readDb();
  const courseId = parseInt(req.params.courseId);
  const materials = (db.materials || []).filter(m => m.courseId === courseId);
  res.json(materials);
};

// Get all materials uploaded by a specific teacher
exports.getMaterialsByTeacher = (req, res) => {
  const db = readDb();
  const teacherId = req.params.teacherId;
  const materials = (db.materials || []).filter(m => m.teacherId === teacherId);
  res.json(materials);
};

// Upload a new material
exports.uploadMaterial = (req, res) => {
  const db = readDb();
  const { title, description, courseId, teacherId, fileType } = req.body;

  if (!title || !description || !courseId || !teacherId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newMaterial = {
    id: (db.materials || []).length + 1,
    title,
    description,
    courseId: parseInt(courseId),
    teacherId,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    fileType: fileType || 'document',
    uploadDate: new Date().toISOString()
  };

  if (!db.materials) {
    db.materials = [];
  }

  db.materials.push(newMaterial);
  writeDb(db);

  res.status(201).json({ message: 'Material uploaded successfully', material: newMaterial });
};

// Delete a material
exports.deleteMaterial = (req, res) => {
  const db = readDb();
  const materialId = parseInt(req.params.id);
  const materialIndex = (db.materials || []).findIndex(m => m.id === materialId);

  if (materialIndex === -1) {
    return res.status(404).json({ message: 'Material not found' });
  }

  db.materials.splice(materialIndex, 1);
  writeDb(db);

  res.json({ message: 'Material deleted successfully' });
};

// Get all materials (for admin purposes)
exports.getAllMaterials = (req, res) => {
  const db = readDb();
  res.json(db.materials || []);
};
