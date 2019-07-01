const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog');
const app = require('../app');
const { blogs } = require('../utils/list_helper');
const {
  invalidId,
  missingId,
  newBlog,
  emptyBlog,
  blogsInDb,
} = require('./test_helper');

const api = supertest(app);

describe('when blogs present in db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = blogs.map(blog => new Blog(blog));
    const promises = blogObjects.map(blog => blog.save());
    await Promise.all(promises);
  });

  test('all blogs are returned and are in json format', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.length).toBe(blogs.length);
  });

  test('the unique identifier of blog posts is named id', async () => {
    const { body } = await api.get('/api/blogs');
    body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  describe('adding a new blog', () => {
    test('succeeds with status 200 and valid data', async () => {
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      expect(response.body).toHaveLength(blogs.length + 1);

      const allBlogs = await blogsInDb();
      const titles = allBlogs.map(b => b.title);
      expect(titles).toContain(newBlog.title);
    });

    test('defaults likes prop to 0 when missing from request', async () => {
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const allBlogs = await blogsInDb();
      const { likes } = allBlogs.find(b => b.title === newBlog.title);
      expect(likes).toBe(0);
    });

    test('responds with 400 when url and/or title missing', async () => {
      await api
        .post('/api/blogs')
        .send(emptyBlog)
        .expect(400);
    });
  });

  describe('viewing a specific blog', () => {
    test('succeeds with status 200 and matching data when id is valid', async () => {
      const existingBlogs = await blogsInDb();
      const blogToView = existingBlogs[Math.floor(Math.random() * existingBlogs.length)];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(resultBlog.body).toMatchObject(blogToView);
    });

    test('fails with status 404 when blog does not exist', async () => {
      await api
        .get(`/api/blogs/${missingId}`)
        .expect(404);
    });

    test('fails with status 400 when id invalid', async () => {
      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400);
    });
  });

  describe('updating likes on a blog', () => {
    test('succeeds with status 200 and valid data', async () => {
      const existingBlogs = await blogsInDb();
      const blogToUpdate = existingBlogs[Math.floor(Math.random() * existingBlogs.length)];

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 100 })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(updatedBlog.body.likes).toBe(100);
    });

    test('fails with status 404 when blog does not exist', async () => {
      await api
        .put(`/api/blogs/${missingId}`)
        .expect(404);
    });

    test('fails with status 400 when id invalid', async () => {
      await api
        .put(`/api/blogs/${invalidId}`)
        .expect(400);
    });
  });

  describe('deleting a blog', () => {
    test('succeeds with status 204 when id is valid', async () => {
      const existingBlogs = await blogsInDb();
      const { id } = existingBlogs[Math.floor(Math.random() * existingBlogs.length)];
      await api
        .delete(`/api/blogs/${id}`)
        .expect(204);
    });

    test('fails with status 404 when blog does not exist', async () => {
      await api
        .delete(`/api/blogs/${missingId}`)
        .expect(404);
    });

    test('fails with status 400 when id invalid', async () => {
      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
