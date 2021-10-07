const express = require('express');
const router = express.Router();
const { register, verifyOTP, createPIN, signin } = require('../controllers/authController')

router.post('/register', register)
router.post('/verify-otp', verifyOTP)
router.post('/create-pin', createPIN)
router.post('/signin', signin)

module.exports = router