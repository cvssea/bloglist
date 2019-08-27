/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

    res.json(blogs.map(b => b.toJSON()));
  } catch (e) {
    next(e);
  }
});

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const foundBlog = await Blog.findById(req.params.id).populate('user', { name: 1, username: 1 });
    if (foundBlog) {
      return res.json(foundBlog.toJSON());
    }
    return res.status(404).end();
  } catch (e) {
    next(e);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      ...req.body,
      user: decodedToken.id,
    });

    const savedBlog = await blog.save();

    user.blogs = [savedBlog._id, ...user.blogs];
    await user.save();

    res.json(savedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundBlog = await Blog.findById(id);
    const comments = [req.body.comment, ...foundBlog.comments];
    const updatedBlog = await Blog.findByIdAndUpdate(id, { comments }, { new: true });
    if (updatedBlog) {
      return res.json(updatedBlog.toJSON());
    }
    return res.status(400).end();
  } catch (e) {
    next(e);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const { likes } = req.body;
  const { id } = req.params;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });

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
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const blogToDelete = await Blog.findById(req.params.id);
    if (blogToDelete && blogToDelete.user.toString() !== decodedToken.id) {
      return res.status(401).json({ error: 'you may only delete your own blogs' });
    }

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
