const mongoose = require('mongoose');
const Movie = require('../models/movie');
const {
  OK_STATUS,
  OK_CREATED,
} = require('../utils/http_codes');

const {
  PERMISSION_DENIED,
  INCORRECT_DATA,
  MOVIEID_NOT_FOUND,
  MOVIES_NOT_FOUND,
} = require('../utils/messages');

const NotFound = require('../utils/errors/NotFound');
const BadRequest = require('../utils/errors/BadRequest');
const PermissionDenied = require('../utils/errors/PermissionDenied');

module.exports.getCurrentUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail()
    .then((movies) => {
      res.send(movies);
    }).catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(MOVIES_NOT_FOUND));
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const userId = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((data) => res.status(OK_CREATED).send(data))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .orFail()
    .then((data) => {
      if (!data.owner.equals(req.user._id)) {
        throw new PermissionDenied(PERMISSION_DENIED);
      }
      return Movie.deleteOne({ _id: req.params.movieId }).then((card) => {
        res.status(OK_STATUS).send(card);
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(MOVIEID_NOT_FOUND));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(INCORRECT_DATA));
      } else {
        next(err);
      }
    });
};
