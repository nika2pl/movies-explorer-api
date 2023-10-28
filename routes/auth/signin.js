const router = require('express').Router();
const { validationSignIn } = require('../../middlewares/validation');

const { signin } = require('../../controllers/users');

router.post('/', validationSignIn, signin);

module.exports = router;
