const express = require('express');
const router = express.Router();
const { signup, login, forgetPassword } = require('../services/authService');

const { signupValidator, loginValidator } = require('../utils/validators/authValidator');






router.post('/forgetPassword', forgetPassword);

router.post('/signup', signupValidator, signup);

router.post('/login', loginValidator, login);


module.exports = router;