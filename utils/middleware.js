const errorHandler = (err, req, res, next) => {
  console.log('error:', err.name);
  next(err);
};

const notFound = (req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
};

module.exports = {
  errorHandler,
  notFound,
};
