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

    try {
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
        sendMail(email, otp)

        //send otp to phone
        sendSMS(otp, phone_no)

        //save to otp table
        const newOTP = await OTP.create({
            customer_id: newUser.customer_id,
            otp,
            expires_in
        })
        return res.json(newUser.customer_id)

    } catch (err) {
        return res.status(400).send(err)
    }
}


const verifyOTP = async (req, res) => {
    const { otp, customer_id } = req.body

    try {
        const checkUser = await OTP.findOne({ where: { customer_id } })
        if (!checkUser) return res.status(400).send('user not found')

        //compare the otp
        if (checkUser.otp !== otp) return res.status(400).send('Incorrect OTP')

        //change status to true
        const updateStatus = await OTP.update({ status: true }, { where: { otp } })
        
        //update customer status
        const status = await Customer.update({ status: 'active' }, { where: { customer_id } })
        return res.json(customer_id)
        
    } catch (err) {
        res.status(400).send(err)
    }
}

const createPIN = async (req, res) => {

}

const signin = async (req, res) => {

}







module.exports = { register, verifyOTP, signin }