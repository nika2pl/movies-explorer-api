const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const User = require('../models/user');

const {
  OK_STATUS,
  OK_CREATED,
} = require('../utils/http_codes');

const {
  INCORRECT_EMAIL_OR_PASSWORD,
  INCORRECT_DATA,
  EMAIL_EXISTS,
  USER_NOT_FOUND,
} = require('../utils/messages');

const NotFound = require('../utils/errors/NotFound');
const BadRequest = require('../utils/errors/BadRequest');
const Conflict = require('../utils/errors/Conflict');
const Unauthorized = require('../utils/errors/Unauthorized');

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail()
    .then((user) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          next(new Unauthorized(INCORRECT_EMAIL_OR_PASSWORD));
        } else {
          const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

          // отправим токен, браузер сохранит его в куках
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          }).send({ token });
        }
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new Unauthorized(INCORRECT_EMAIL_OR_PASSWORD));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};

module.exports.signup = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(() => res.status(OK_CREATED).send({
          name, email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict(EMAIL_EXISTS));
          } else if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequest(INCORRECT_DATA));
          } else {
            next(err);
          }
        });
    });
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt');
  res.end();
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id }).orFail().then((users) => res.send(users)).catch((err) => {
    next(err);
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findOneAndUpdate({ _id: req.user._id }, { name, email }, {
    new: true,
    runValidators: true,
  }).orFail()
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(USER_NOT_FOUND));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(INCORRECT_DATA));
      } else if (err.code === 11000) {
        next(new Conflict(EMAIL_EXISTS));
      } else {
        next(err);
      }
    });
};
