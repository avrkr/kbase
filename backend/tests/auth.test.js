const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('../src/routes/authRoutes');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});
