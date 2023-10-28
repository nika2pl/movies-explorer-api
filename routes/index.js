const router = require('express').Router();

// check auth
const auth = require('../middlewares/auth');

// routes
const routeSignup = require('./auth/signup');
const routeSignin = require('./auth/signin');
const routeSignout = require('./auth/signout');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/signup', routeSignup);
router.use('/signin', routeSignin);

router.use(auth);

router.use('/signout', routeSignout);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
