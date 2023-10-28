const router = require('express').Router();

const { validationSignUp } = require('../../middlewares/validation');
const { signup } = require('../../controllers/users');

router.post('/', validationSignUp, signup);

module.exports = router;
