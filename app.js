const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blog');
const middleware = require('./utils/middleware');

const app = express();

mongoose
  .set('useFindAndModify', false)
  .connect(config.DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('DB Connected');
  })
  .catch((e) => {
    console.log(`Could not connect DB: ${e.message}`);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/blogs', blogsRouter);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app;
