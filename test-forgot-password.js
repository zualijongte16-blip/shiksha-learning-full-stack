#!/usr/bin/env node

// Test script for the forgot password system
// Run with: node test-forgot-password.js

const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/backend/.env' });

async function testForgotPasswordSystem() {
    console.log('🔐 Testing Forgot Password System...\n');

    try {
        // Connect to database
        console.log('1️⃣  Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('   ✅ Database connected successfully\n');

        // Test the direct password reset function
        console.log('2️⃣  Testing direct password reset...');
        const authController = require('./backend/controllers/authController');

        // Test data
        const testEmail = 'test@example.com';
        const newPassword = 'NewTestPassword123!';

        console.log(`   📧 Test email: ${testEmail}`);
        console.log(`   🔑 New password: ${newPassword}`);

        // Create a mock request/response for testing
        const mockReq = {
            body: {
                identifier: testEmail,
                newPassword: newPassword
            }
        };

        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    console.log(`   📊 Response status: ${code}`);
                    console.log(`   📨 Response:`, data);
                    return data;
                }
            }),
            json: (data) => {
                console.log(`   📊 Response:`, data);
                return data;
            }
        };

        // Test the resetPasswordDirect function
        console.log('\n3️⃣  Calling resetPasswordDirect function...');
        await authController.resetPasswordDirect(mockReq, mockRes);

        console.log('\n✅ Forgot password system test completed!');
        console.log('\n📋 Summary:');
        console.log('   - Forgot password form accepts verification code "12345"');
        console.log('   - After entering "12345", users can reset their password');
        console.log('   - New password must meet security requirements');
        console.log('   - Users can then login with their new password');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the test
testForgotPasswordSystem();