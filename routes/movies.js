const router = require('express').Router();
const { getCurrentUserMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

router.get('/', getCurrentUserMovies);

router.post('/', validationCreateMovie, createMovie);

router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
