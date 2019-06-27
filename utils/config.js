require('dotenv').config();

const { DB_URI } = process.env;
const { PORT } = process.env;

module.exports = {
  DB_URI,
  PORT,
};
