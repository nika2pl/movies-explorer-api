require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { PORT, URL_MONGO } = require('./utils/config');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ERROR_INTERNAL_SERVER } = require('./utils/http_codes');
const { PAGE_NOT_FOUND } = require('./utils/messages');
const NotFound = require('./utils/errors/NotFound');

const app = express();

mongoose.connect(URL_MONGO, {
  useNewUrlParser: true,
});

const limiter = require('./middlewares/rateLimiter');

app.use(limiter);

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.use(router);

app.use('*', (req, res, next) => {
  next(new NotFound(PAGE_NOT_FOUND));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err; // 500 by default
  res.status(statusCode).send({ message });

  next();
});

app.listen(PORT);
