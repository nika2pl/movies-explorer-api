const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { signup } = require('../../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
}), signup);

module.exports = router;
