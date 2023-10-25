const mongoose = require('mongoose');
const Movie = require('../models/movie');
const {
  OK_STATUS,
  OK_CREATED,
} = require('../utils/http_codes');

const NotFound = require('../utils/errors/NotFound');
const BadRequest = require('../utils/errors/BadRequest');
const PermissionDenied = require('../utils/errors/PermissionDenied');

module.exports.getCurrentUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).orFail().then((movies) => res.send(movies)).catch((err) => {
    next(err);
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
        next(new BadRequest('Переданы некорректные данные'));
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
        throw new PermissionDenied('Нет доступа');
      } else {
        Movie.deleteOne({ _id: req.params.movieId }).then((card) => {
          res.status(OK_STATUS).send(card);
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('movieId не найден'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
