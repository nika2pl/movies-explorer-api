const router = require('express').Router();

const { getCurrentUserInfo, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');

router.get('/me', getCurrentUserInfo);
router.patch('/me', validationUpdateUser, updateUser);

module.exports = router;
