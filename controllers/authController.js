const { Customer, OTP } = require('../models');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/otp.email')
const sendSMS = require('../utils/otp.phone');
const nodemailer = require('nodemailer')

//To add minutes to current time
function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
}

//email setup


const register = async (req, res) => {
    const { full_name, dob, phone_no } = req.body;
    const email = req.body.email.toLowerCase()

    //check if email exists in database
    const emailExists = await Customer.findOne({ where: { email } });
    if (emailExists) return res.status(400).send('Email already exists');

    //check if phone number exists
    const phoneExists = await Customer.findOne({ where: { phone_no } });
    if (phoneExists) return res.status(400).send('Phone number already exists');

    //save to users table
    const newUser = await Customer.create({ full_name, dob, email, phone_no });
   
    //Generate OTP
    const otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
    const now = new Date();
    const expires_in = AddMinutesToDate(now, 10)
  
    //send otp to mail
    try {
        sendMail(email, otp)
    } catch(err) {
        res.json('mail not sent')
    }
    
    //send otp to phone
    try {
        sendSMS(otp, phone_no)
    } catch(err) {
        res.json('sms not sent')
    }
    //save to otp table
    const newOTP = await OTP.create({
        customer_id: newUser.customer_id,
        otp,
        expires_in
    })

    return res.json(newUser.customer_id)
}


const verifyOTP = async (req, res) => {

}

const createPIN = async(req, res) => {
    
}

const signin = async (req, res) => {

}







module.exports = { register, verifyOTP, signin }