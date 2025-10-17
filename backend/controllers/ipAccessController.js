const ipAccessMiddleware = require('../middleware/ipAccess');

// Get current IP address and access status
const getCurrentIPStatus = async (req, res) => {
    try {
        const clientIP = ipAccessMiddleware.getClientIP(req);
        const isAllowed = ipAccessMiddleware.isIPAllowed(clientIP);
        const allowedIPs = ipAccessMiddleware.getAllowedIPs();

        // Try to get external IP for Atlas reference
        let currentExternalIP = null;
        try {
            currentExternalIP = await ipAccessMiddleware.getCurrentIPAddress();
        } catch (error) {
            console.log('Could not fetch external IP:', error.message);
        }

        res.json({
            success: true,
            data: {
                yourIP: clientIP,
                isAllowed,
                allowedIPs,
                externalIP: currentExternalIP,
                timestamp: new Date().toISOString(),
                mongoAtlasHelp: {
                    message: 'If you\'re having MongoDB Atlas connection issues, add your IP to the Atlas Network Access list',
                    suggestedIP: currentExternalIP || clientIP,
                    atlasSteps: [
                        '1. Go to MongoDB Atlas Dashboard',
                        '2. Navigate to Network Access',
                        '3. Click "Add IP Address"',
                        '4. Add the IP shown above',
                        '5. Or use "Allow Access from Anywhere" (0.0.0.0/0) for development'
                    ]
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting IP status',
            error: error.message
        });
    }
};

// Get access logs
const getAccessLogs = (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const logs = ipAccessMiddleware.getAccessLogs(limit);

        res.json({
            success: true,
            data: {
                logs,
                total: logs.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting access logs',
            error: error.message
        });
    }
};

// Add IP to allowed list (admin only)
const addIP = (req, res) => {
    try {
        const { ip, comment } = req.body;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        // Basic IP validation
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^localhost$|^::1$/;
        if (!ipRegex.test(ip) && !ip.includes('/')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid IP address format'
            });
        }

        const added = ipAccessMiddleware.addAllowedIP(ip, comment);

        if (added) {
            res.json({
                success: true,
                message: `IP ${ip} added to allowed list`,
                data: {
                    ip,
                    comment,
                    allowedIPs: ipAccessMiddleware.getAllowedIPs()
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'IP was already in the allowed list'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding IP',
            error: error.message
        });
    }
};

// Remove IP from allowed list (admin only)
const removeIP = (req, res) => {
    try {
        const { ip } = req.params;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP address is required'
            });
        }

        const removed = ipAccessMiddleware.removeAllowedIP(ip);

        if (removed) {
            res.json({
                success: true,
                message: `IP ${ip} removed from allowed list`,
                data: {
                    ip,
                    allowedIPs: ipAccessMiddleware.getAllowedIPs()
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'IP was not found in the allowed list'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing IP',
            error: error.message
        });
    }
};

// Get all allowed IPs
const getAllowedIPs = (req, res) => {
    try {
        const allowedIPs = ipAccessMiddleware.getAllowedIPs();

        res.json({
            success: true,
            data: {
                allowedIPs,
                count: allowedIPs.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting allowed IPs',
            error: error.message
        });
    }
};

// Test database connection (for troubleshooting)
const testDatabaseConnection = async (req, res) => {
    try {
        const mongoose = require('mongoose');

        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            return res.json({
                success: true,
                message: 'Database connection is working',
                state: 'connected',
                database: mongoose.connection.name,
                host: mongoose.connection.host
            });
        }

        // Try to connect
        await mongoose.connect(process.env.MONGO_URI);

        res.json({
            success: true,
            message: 'Database connection test successful',
            state: 'connected',
            database: mongoose.connection.name,
            host: mongoose.connection.host
        });

    } catch (error) {
        console.log('Database connection test failed:', error.message);

        let errorType = 'UNKNOWN';
        let suggestion = '';

        if (error.message.includes('authentication failed') || error.message.includes('IP')) {
            errorType = 'IP_WHITELIST';
            suggestion = 'Check MongoDB Atlas Network Access settings and add your IP address';
        } else if (error.message.includes('connection timed out')) {
            errorType = 'CONNECTION_TIMEOUT';
            suggestion = 'Check network connectivity and MongoDB Atlas cluster status';
        } else if (error.message.includes('password')) {
            errorType = 'AUTHENTICATION';
            suggestion = 'Check username and password in connection string';
        }

        res.status(500).json({
            success: false,
            message: 'Database connection test failed',
            error: error.message,
            errorType,
            suggestion,
            mongoAtlasHelp: {
                message: 'This is likely a MongoDB Atlas configuration issue',
                steps: [
                    '1. Verify your connection string in .env file',
                    '2. Check Network Access in Atlas dashboard',
                    '3. Add your IP address to the IP Access List',
                    '4. Or temporarily use 0.0.0.0/0 to allow all IPs'
                ]
            }
        });
    }
};

module.exports = {
    getCurrentIPStatus,
    getAccessLogs,
    addIP,
    removeIP,
    getAllowedIPs,
    testDatabaseConnection
};