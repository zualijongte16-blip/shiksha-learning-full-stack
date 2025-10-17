
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database successfully connected');
    } catch (error) {
        console.log("Error connecting to the Database:", error.message);

        // Check if it's likely an IP whitelist issue
        if (error.message && (
            error.message.includes('IP address') ||
            error.message.includes('whitelist') ||
            error.message.includes('not allowed') ||
            error.message.includes('authentication failed') ||
            error.message.includes('connection timed out') ||
            error.name === 'MongoServerSelectionError'
        )) {
            console.log('\n🔒 This looks like an IP whitelist issue with MongoDB Atlas!');
            console.log('📋 To fix this:');
            console.log('   1. Go to your MongoDB Atlas dashboard');
            console.log('   2. Navigate to Network Access');
            console.log('   3. Click "Add IP Address"');
            console.log('   4. Add your current IP address or use "Allow Access from Anywhere"');

            // Try to get current IP address
            try {
                console.log('\n🌐 Getting your current IP address...');
                await getCurrentIPAddress();
            } catch (ipError) {
                console.log('   Could not fetch IP address automatically');
            }

            console.log('\n💡 Alternative solutions:');
            console.log('   - Use 0.0.0.0/0 to allow access from anywhere (less secure)');
            console.log('   - Check your firewall settings');
            console.log('   - Ensure your internet connection is stable');
        }

        console.log("Continuing without database connection. Some features may not work.");
        // Do not exit, allow server to start
    }
};

const getCurrentIPAddress = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.ipify.org',
            port: 443,
            path: '/',
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`   Your current IP address: ${data}`);
                    console.log(`   Add this IP to your MongoDB Atlas Network Access list`);
                    resolve(data);
                } else {
                    // Fallback to http
                    getCurrentIPHTTP().then(resolve).catch(reject);
                }
            });
        });

        req.on('error', (err) => {
            // Fallback to http
            getCurrentIPHTTP().then(resolve).catch(reject);
        });

        req.end();
    });
};

const getCurrentIPHTTP = () => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'icanhazip.com',
            port: 80,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const ip = data.trim();
                    console.log(`   Your current IP address: ${ip}`);
                    console.log(`   Add this IP to your MongoDB Atlas Network Access list`);
                    resolve(ip);
                } else {
                    console.log('   Could not determine your IP address automatically');
                    console.log('   Please visit: https://whatismyipaddress.com/ to find your IP');
                    reject(new Error('Could not fetch IP'));
                }
            });
        });

        req.on('error', (err) => {
            console.log('   Could not determine your IP address automatically');
            console.log('   Please visit: https://whatismyipaddress.com/ to find your IP');
            reject(err);
        });

        req.end();
    });
};

module.exports = connectDB;
