const express = require('express');
const router = express.Router();
const { signup, login, forgetPassword, verifyPasswordResetCode, resetPassword } = require('../services/authService');

const { signupValidator, loginValidator } = require('../utils/validators/authValidator');



router.post('/signup', signupValidator, signup);

router.post('/login', loginValidator, login);

router.post('/forgetPassword', forgetPassword);

router.post('/verifyPasswordResetCode', verifyPasswordResetCode);

router.put('/resetPassword', resetPassword);



module.exports = router;