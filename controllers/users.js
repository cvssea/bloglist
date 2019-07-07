const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const { PasswordError } = require('./users_helper');

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { author: 1, url: 1 });

    res.json(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    if (username.length > 2 && password.length < 3) {
      throw new PasswordError('Invalid password, must be at least 3 characters long');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await user.save();
    res.json(savedUser.toJSON());
  } catch (e) {
    next(e);
  }
});

module.exports = usersRouter;
