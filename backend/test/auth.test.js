const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');

describe('Auth API Endpoints', () => {
  const testUser = {
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User',
    class: '10',
    course: 'Science',
    address: '123 Test St',
    phone: '+919876543210',
    registrationFee: 1000
  };

  beforeAll(async () => {
    // Clean up and register test user before all tests
    await User.deleteMany({ phone: '+919876543210' });
    await Student.deleteMany({ phone: '+919876543210' });

    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/auth/login - Login with registered user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.phone, // phone used as email in login
        password: testUser.phone, // default password is phone number
        role: 'student'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe(testUser.firstName);
  });

  test('POST /api/auth/reset-password - Request password reset OTP', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: testUser.phone,
        role: 'student'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/OTP sent/);
  });

  // Additional tests for OTP verification and password reset can be added here
});
