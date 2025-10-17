const express = require('express');
const router = express.Router();
const ipAccessController = require('../controllers/ipAccessController');
const { requireAdmin } = require('../middleware/auth');

// Public routes (for troubleshooting)
router.get('/status', ipAccessController.getCurrentIPStatus);
router.get('/test-db', ipAccessController.testDatabaseConnection);

// Admin-only routes
router.get('/logs', requireAdmin, ipAccessController.getAccessLogs);
router.get('/allowed', requireAdmin, ipAccessController.getAllowedIPs);
router.post('/add', requireAdmin, ipAccessController.addIP);
router.delete('/remove/:ip', requireAdmin, ipAccessController.removeIP);

module.exports = router;