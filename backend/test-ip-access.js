#!/usr/bin/env node

// Test script to check IP access and database connection
// Run with: node test-ip-access.js

require('dotenv').config({ path: __dirname + '/.env' });
const ipAccessMiddleware = require('./middleware/ipAccess');
const mongoose = require('mongoose');

async function testIPAccess() {
    console.log('🔍 Testing IP Access and Database Connection...\n');

    try {
        // Test 1: Get current IP
        console.log('1️⃣  Getting your current IP address...');
        const currentIP = await ipAccessMiddleware.getCurrentIPAddress();
        console.log(`   ✅ Your current IP: ${currentIP}`);
        console.log('   📋 Add this IP to your MongoDB Atlas Network Access list\n');

        // Test 2: Check if IP is allowed in our system
        console.log('2️⃣  Checking IP access in your application...');
        const allowedIPs = ipAccessMiddleware.getAllowedIPs();
        console.log(`   ✅ Currently allowed IPs: ${allowedIPs.length} IPs`);
        allowedIPs.forEach(ip => {
            console.log(`      - ${ip}`);
        });
        console.log('');

        // Test 3: Test database connection
        console.log('3️⃣  Testing MongoDB Atlas connection...');
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('   ✅ Database connection successful!');
            console.log(`   📊 Connected to: ${mongoose.connection.name}`);
            console.log(`   🌐 Host: ${mongoose.connection.host}`);

            // Close connection
            await mongoose.connection.close();
            console.log('   🔌 Connection closed');

        } catch (dbError) {
            console.log('   ❌ Database connection failed!');
            console.log(`   Error: ${dbError.message}`);

            if (dbError.message.includes('IP') || dbError.message.includes('authentication')) {
                console.log('\n🚨 This looks like a MongoDB Atlas IP whitelist issue!');
                console.log('📋 To fix this:');
                console.log(`   1. Go to MongoDB Atlas Dashboard`);
                console.log(`   2. Navigate to Network Access`);
                console.log(`   3. Click "Add IP Address"`);
                console.log(`   4. Add your IP: ${currentIP}`);
                console.log(`   5. Or use "Allow Access from Anywhere" (0.0.0.0/0)`);
            }
        }

        console.log('\n📋 MongoDB Atlas Setup Reminder:');
        console.log('   If you\'re still having issues:');
        console.log('   1. Verify your connection string in .env');
        console.log('   2. Check your Atlas cluster is running');
        console.log('   3. Ensure your IP is whitelisted');
        console.log('   4. Check username/password in connection string');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testIPAccess();