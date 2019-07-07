const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user');
const app = require('../app');
const {
  defaultUser,
  invalidUser,
  usersInDb,
} = require('./test_helper');

const api = supertest(app);

describe('when there is one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User(defaultUser);
    await user.save();
  });

  test('creating a new user succeeds', async () => {
    const newUser = {
      name: 'Dan Abramov',
      username: 'dabramov',
      password: 'secret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const users = await usersInDb();
    expect(users.length).toBe(2);
  });

  test('creation fails 400 when username already in use', async () => {
    const response = await api
      .post('/api/users')
      .send(defaultUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toContain('to be unique');
  });

  describe('creating users with invalid credentials', () => {
    test('fails with 400 & err message when username length < 3', async () => {
      const response = await api
        .post('/api/users')
        .send({ ...invalidUser, password: 'valid' })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toContain('minimum allowed length');
    });

    test('fails with 400 & err message when password length < 3', async () => {
      const response = await api
        .post('/api/users')
        .send({ ...invalidUser, username: 'valid' })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toContain('Invalid password');
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
