const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json(err.message);
  }
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'malformed id' });
  }
  next(err);
};

const notFound = (req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
};

module.exports = {
  errorHandler,
  notFound,
};
