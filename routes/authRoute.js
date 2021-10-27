const express = require('express');
const router = express.Router();
const { register, verifyOTP, createPIN, signin, forgetPIN, resetCode, resetPIN } = require('../controllers/authController')

router.post('/register', register)
router.post('/verify-otp', verifyOTP)
router.post('/create-pin', createPIN)
router.post('/signin', signin)
router.post('/forget-pin', forgetPIN)
router.post('/reset-code', resetCode)
router.post('/reset-pin', resetPIN)

module.exports = router