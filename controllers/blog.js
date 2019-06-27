const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (req, res, next) => {
  Blog.find({})
    .then(blogs => res.json(blogs))
    .catch(next);
});

blogsRouter.get('/:id', (req, res, next) => {
  Blog.findById(req.params.id)
    .then(blog => (blog ? res.json(blog) : res.status(400).end()))
    .catch(next);
});

blogsRouter.post('/', (req, res, next) => {
  const blog = new Blog({ ...req.body });

  blog
    .save()
    .then(saved => res.json(saved))
    .catch(next);
});

blogsRouter.delete('/:id', (req, res, next) => {
  Blog.findByIdAndRemove(req.params.id)
    .then(b => (b ? res.status(204).end() : res.status(400).end()))
    .catch(next);
});

module.exports = blogsRouter;
