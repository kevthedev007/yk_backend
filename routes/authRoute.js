const express = require('express');
const router = express.Router();
const { register, verifyOTP, createPIN, signin, forgetPIN, resetCode, resetPIN } = require('../controllers/authController')

router.post('/register', register)
router.post('/verify-otp/:id', verifyOTP)
router.post('/create-pin/:id', createPIN)
router.post('/signin', signin)
router.post('/forget-pin', forgetPIN)
router.post('/reset-code/:id', resetCode)
router.post('/reset-pin/:id', resetPIN)

module.exports = router