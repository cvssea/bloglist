const Blog = require('../models/blog');

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
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  invalidId,
  missingId,
  newBlog,
  emptyBlog,
  blogsInDb,
};
