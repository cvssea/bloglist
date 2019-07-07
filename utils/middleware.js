/* eslint-disable consistent-return */
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json(err.message);
  }
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'malformed id' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }
  next(err);
};

const notFound = (req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
};

const getToken = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7);
  }
  next();
};

module.exports = {
  errorHandler,
  notFound,
  getToken,
};
