/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = !user
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: 'invalid username or password',
      });
    }

    const token = jwt.sign({
      username: user.username,
      id: user._id,
    }, process.env.SECRET);

    res
      .status(200)
      .send({
        token,
        username: user.username,
        name: user.name,
      });
  } catch (e) {
    next(e);
  }
});

module.exports = loginRouter;
