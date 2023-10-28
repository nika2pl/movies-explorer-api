const router = require('express').Router();

const { signout } = require('../../controllers/users');

router.post('/', signout);

module.exports = router;
