const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUserInfo, updateUser } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email({ tlds: { allow: false } }),
  }),
}), updateUser);

module.exports = router;
