const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const app = express();

mongoose
  .set('useFindAndModify', false)
  .set('useCreateIndex', true)
  .connect(config.DB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('DB Connected');
  })
  .catch((e) => {
    logger.error(`Could not connect DB: ${e.message}`);
  });

app.use(cors());
app.use(middleware.getToken);
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app;
