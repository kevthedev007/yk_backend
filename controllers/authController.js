const { Customer, OTP } = require('../models');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/otp.email')

//To add minutes to current time
function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
}

//mail Transport
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
  });


const register = async (req, res) => {
    const { full_name, dob, email, phone_no } = req.body;
    let email = email.toLowerCase()

    //check if email exists in database
    const emailExists = await Customer.findOne({ where: { email } });
    if (emailExists) return res.status(400).send('Email already exists');

    //check if phone number exists
    const phoneExists = await Customer.findOne({ where: { phone_no } });
    if (phoneExists) return res.status(400).send('Phone number already exists');

    //save to users table
    const newUser = await Customer.create({ full_name, dob, email, phone_no });

    //Generate OTP
    const otp = otpGenerator.generate(4, { alphabets: false, specialChars: false });
    const now = new Date();
    const expires_in = AddMinutesToDate(now, 10)

    //send otp to phone



    //send otp to mail
    sendMail(email, otp)

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