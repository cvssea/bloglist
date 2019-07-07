const Blog = require('../models/blog');
const User = require('../models/user');

const invalidId = '5d1a602ef02eb5b36388be';
const missingId = '5d1a602ef02eb5b36388bef0';

const newBlog = {
  title: 'The Mythbuster’s Guide to Saving Money on Energy Bills',
  author: 'Miss Thrifty',
  url: 'https://www.miss-thrifty.co.uk/the-mythbusters-guide-to-saving-money-on-energy-bills/',
};

const emptyBlog = {
  author: 'Nobody',
  likes: 10,
};

const blogsInDb = async () => {
  const blogs = await Blog
    .find({})
    .populate('user', { name: 1, username: 1 });
  return blogs.map(blog => blog.toJSON());
};

const defaultUser = {
  username: 'root',
  password: 'root',
};

const invalidUser = {
  username: 'yo',
  password: 'se',
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const authorize = async (api) => {
  await api.post('/api/users').send(defaultUser);
  const response = await api.post('/api/login').send(defaultUser);
  return response.body.token;
}

module.exports = {
  invalidId,
  missingId,
  invalidUser,
  newBlog,
  emptyBlog,
  blogsInDb,
  defaultUser,
  usersInDb,
  authorize,
};
