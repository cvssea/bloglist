class PasswordError extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'ValidationError';
  }
}

module.exports = {
  PasswordError,
};
