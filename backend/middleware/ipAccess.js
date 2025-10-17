const https = require('https');
const http = require('http');

// In-memory store for allowed IPs (in production, use database)
let allowedIPs = new Set();
let ipAccessLogs = [];

// Initialize with some default IPs (you can modify these)
const initializeDefaultIPs = () => {
    // Add localhost and common development IPs
    allowedIPs.add('127.0.0.1');
    allowedIPs.add('::1');
    allowedIPs.add('localhost');

    // You can add more IPs here or load from environment variables
    if (process.env.ALLOWED_IPS) {
        const envIPs = process.env.ALLOWED_IPS.split(',');
        envIPs.forEach(ip => allowedIPs.add(ip.trim()));
    }
};

// Middleware to check IP access
const checkIPAccess = (req, res, next) => {
    const clientIP = getClientIP(req);
    const timestamp = new Date().toISOString();

    // Log the access attempt
    const logEntry = {
        timestamp,
        ip: clientIP,
        method: req.method,
        path: req.path,
        userAgent: req.get('User-Agent') || 'Unknown'
    };

    ipAccessLogs.push(logEntry);

    // Keep only last 1000 entries
    if (ipAccessLogs.length > 1000) {
        ipAccessLogs = ipAccessLogs.slice(-1000);
    }

    // Check if IP is allowed
    if (isIPAllowed(clientIP)) {
        req.clientIP = clientIP;
        next();
    } else {
        console.log(`🚫 Blocked access from IP: ${clientIP} at ${timestamp}`);
        return res.status(403).json({
            message: 'Access denied',
            error: 'IP_NOT_ALLOWED',
            ip: clientIP,
            suggestion: 'Please contact administrator to add your IP address to the allowed list'
        });
    }
};

// Get client IP address
const getClientIP = (req) => {
    // Check for IP in various headers (in order of preference)
    const headers = [
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip',
        'x-cluster-client-ip',
        'x-forwarded',
        'forwarded-for',
        'forwarded'
    ];

    for (const header of headers) {
        const value = req.headers[header];
        if (value) {
            // x-forwarded-for can contain multiple IPs, get the first one
            const ip = value.split(',')[0].trim();
            if (ip && ip !== 'unknown') {
                return ip;
            }
        }
    }

    // Fallback to connection remote address
    return req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.connection?.socket?.remoteAddress ||
           'unknown';
};

// Check if IP is allowed
const isIPAllowed = (ip) => {
    // Always allow localhost/private IPs for development
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
        return true;
    }

    // Check if IP is in allowed list
    if (allowedIPs.has(ip)) {
        return true;
    }

    // Check for CIDR matches (basic implementation)
    for (const allowedIP of allowedIPs) {
        if (allowedIP.includes('/')) {
            if (isIPInCIDR(ip, allowedIP)) {
                return true;
            }
        }
    }

    return false;
};

// Simple CIDR matching function
const isIPInCIDR = (ip, cidr) => {
    const [range, bits] = cidr.split('/');
    const mask = parseInt(bits);
    const ipNum = ipToNumber(ip);
    const rangeNum = ipToNumber(range);
    const maskNum = ~(0xFFFFFFFF >>> mask);

    return (ipNum & maskNum) === (rangeNum & maskNum);
};

// Convert IP to number for CIDR calculation
const ipToNumber = (ip) => {
    if (ip.includes(':')) {
        // IPv6 - simplified handling
        return 0;
    }

    return ip.split('.').reduce((acc, octet) => {
        return (acc << 8) + parseInt(octet);
    }, 0) >>> 0;
};

// Add IP to allowed list
const addAllowedIP = (ip, comment = '') => {
    allowedIPs.add(ip);
    console.log(`✅ Added IP to allowed list: ${ip}${comment ? ` (${comment})` : ''}`);
    return true;
};

// Remove IP from allowed list
const removeAllowedIP = (ip) => {
    const removed = allowedIPs.delete(ip);
    if (removed) {
        console.log(`❌ Removed IP from allowed list: ${ip}`);
    }
    return removed;
};

// Get all allowed IPs
const getAllowedIPs = () => {
    return Array.from(allowedIPs);
};

// Get access logs
const getAccessLogs = (limit = 100) => {
    return ipAccessLogs.slice(-limit);
};

// Get current IP address (for Atlas whitelist)
const getCurrentIPAddress = async () => {
    try {
        const ip = await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'api.ipify.org',
                port: 443,
                path: '/',
                method: 'GET',
                timeout: 5000
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data.trim());
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}`));
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Timeout'));
            });

            req.end();
        });

        return ip;
    } catch (error) {
        // Fallback to http
        try {
            const ip = await new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: 'icanhazip.com',
                    port: 80,
                    path: '/',
                    method: 'GET',
                    timeout: 5000
                }, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            resolve(data.trim());
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}`));
                        }
                    });
                });

                req.on('error', reject);
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('Timeout'));
                });

                req.end();
            });

            return ip;
        } catch (fallbackError) {
            throw new Error('Could not determine IP address');
        }
    }
};

// Initialize default IPs when module loads
initializeDefaultIPs();

module.exports = {
    checkIPAccess,
    getClientIP,
    isIPAllowed,
    addAllowedIP,
    removeAllowedIP,
    getAllowedIPs,
    getAccessLogs,
    getCurrentIPAddress
};