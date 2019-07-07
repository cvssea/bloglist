const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const { defaultUser, invalidUser, usersInDb } = require('./test_helper');

const api = supertest(app);

describe('when trying to login', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await api
      .post('/api/users')
      .send(defaultUser);
  });

  test('login succeeds with token creation', async () => {
    const response = await api
      .post('/api/login')
      .send(defaultUser)
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  test('login fails with invalid username/password', async () => {
    const response = await api
      .post('/api/login')
      .send(invalidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('invalid username or password');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
