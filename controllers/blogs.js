/* eslint-disable consistent-return */
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1 });

    res.json(blogs.map(b => b.toJSON()));
  } catch (e) {
    next(e);
  }
});

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const foundBlog = await Blog.findById(req.params.id);
    if (foundBlog) {
      return res.json(foundBlog.toJSON());
    }
    return res.status(404).end();
  } catch (e) {
    next(e);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const { userId } = req.body;
  const user = await User.findById(userId);

  const blog = new Blog({
    ...req.body,
    user: userId,
  });
  delete blog.userId;

  try {
    const savedBlog = await blog.save();

    user.blogs = [savedBlog, ...user.blogs];
    await user.save();

    res.json(savedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const { likes } = req.body;
  const { id } = req.params;

  try {
    const updatedBlog = await Blog
      .findByIdAndUpdate(id, { likes }, { new: true });

    if (updatedBlog) {
      return res.json(updatedBlog.toJSON());
    }
    return res.status(404).end();
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndRemove(req.params.id);
    if (deletedBlog) {
      return res.status(204).end();
    }
    return res.status(404).end();
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
