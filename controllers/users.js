const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

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
