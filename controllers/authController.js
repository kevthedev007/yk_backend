const { Customer, OTP, User } = require('../models');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/otp.email')
const sendSMS = require('../utils/otp.phone');
const nodemailer = require('nodemailer');

//To add minutes to current time
function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
}


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

        //save to customer table
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
            customerId: newUser.id,
            otp,
            expires_in
        })

        return res.status(200).json(newUser.id)

    } catch (err) {
        return res.status(500).send(err)
    }
}


const verifyOTP = async (req, res) => {
    const { otp, id } = req.body

    try {
        const checkUser = await OTP.findOne({
            where: {
                customerId: id,
                otp: otp
            }
        })

        if (!checkUser) return res.status(400).send('Incorrect OTP')

        //check if otp has expired
        let currentTime = new Date();
        let otpTime = checkUser.expires_in;

        if (currentTime.getTime() > otpTime.getTime()) return res.status(400).send('OTP expired!')

        //change status to true
        checkUser.status = true;
        await checkUser.save()
        // const updateStatus = await OTP.update({ status: true }, { where: { otp } })

        //update customer status
        const status = await Customer.update({ status: 'active' }, { where: { id } })
        return res.status(200).json(id)

    } catch (err) {
        return res.status(500).send(err)
    }
}

const createPIN = async (req, res) => {
    const { id, PIN } = req.body;

    try {
        //to get customer email
        const customer = await Customer.findOne({ where: { id } });
        //save to user model
        const user = await User.create({
            id: id,
            role_id: 2,
            email: customer.email,
            PIN: PIN,
            status: true,
            last_signed_in: new Date()
        })

        //jwt token
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return res.status(200).json(token)
    } catch (err) {
        return res.status(500).send(err)
    }
}

const signin = async (req, res) => {
    const { email, PIN } = req.body;

    try {
        //check if email exists
        const userExists = await User.findOne({ where: { email } });
        if (!userExists) return res.status(400).send('user not registered');

        //compare PIN
        if (PIN !== userExists.PIN) return res.status(400).send('Incorrect PIN')

        //update 
        userExists.status = true;
        userExists.last_signed_in = Date.now();
        await userExists.save()
        // const status = await User.update({ status: true }, { where: { email } })

        //assign jwt token
        const token = jwt.sign({ id: userExists.id }, process.env.SECRET_KEY);
        return res.status(200).json(token)
    } catch (err) {
        return res.status(500).send(err)
    }
}


const forgetPIN = async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(400).send('customer does not exist')

        //Generate OTP
        const otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        const now = new Date();
        const expires_in = AddMinutesToDate(now, 10)

        //send to mail
        sendMail(email, otp)

        //save to otp table
        const newOTP = await OTP.create({
            customerId: user.id,
            otp,
            expires_in
        })

        return res.status(200).send('password reset pin has been sent to your mail')
    } catch (err) {
        return res.status(500).send(err)
    }
}

const resetCode = async (req, res) => {
    const { id, otp } = req.body;

    //check user
    const user = await User.findOne({ where: { id }})
    if(!user) return res.status(400).send('user not found!')

    try {
        const checkOTP = await OTP.findOne({
            where: {
                customerId: id,
                otp: otp
            }
        })

        //update otp status
        checkOTP.status = true;
        await checkOTP.save()

        return res.status(200).send('reset code correct')
    } catch (err) {
        return res.status(500).send(err)
    }
}

const resetPIN = async (req, res) => {
    const { id, PIN } = req.body;

    try {
        //check user
        const user = await User.findOne({ where: { id }})
        if(!user) return res.status(400).send('user not found!')

        //change PIN
        user.PIN = PIN;
        await user.save()

        res.json("PIN changed successfully")
    } catch (err) {
        return res.status(500).send(err)
    }
}









module.exports = { register, verifyOTP, createPIN, signin, forgetPIN, resetCode, resetPIN }