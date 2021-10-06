const { User } = require('../models');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const { NOW } = require('sequelize/types');

//To add minutes to current time
function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
}

const register = async (req, res) => {
    const { full_name, dob, email, phone_no } = req.body;
    let email = email.toLowerCase()

    //check if email exists in database
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) return res.status(400).send('Email already exists');

    //check if phone number exists
    const phoneExists = await User.findOne({ where: { phone_no } });
    if (phoneExists) return res.status(400).send('Phone number already exists');

    //save to users table
    const newUser = await User.create({ full_name, dob, email, phone_no });

    //Generate OTP
    const otp = otpGenerator.generate(4, { alphabets: false, specialChars: false });
    const now = new Date();
    const expires_in = AddMinutesToDate(now, 10)

    //send otp to phone



    //send otp to mail


    //save to otp table

}


const verifyOTP = async (req, res) => {

}

const signin = async (req, res) => {

}







module.exports = { register, verifyOTP, signin }