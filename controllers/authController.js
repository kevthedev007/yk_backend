const { Customer, OTP, User, Activity } = require('../models');
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
        if (emailExists) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "Email Already Exists"
        });

        //check if phone number exists
        const phoneExists = await Customer.findOne({ where: { phone_no } });
        if (phoneExists) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "Phone Number Already Exists"
        });

        //save to customer table
        const newUser = await Customer.create({ full_name, dob, email, phone_no });

        //Generate OTP
        const otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        const now = new Date();
        const expires_in = AddMinutesToDate(now, 10)

        //json otp to mail
        sendMail(email, otp)

        //json otp to phone
        sendSMS(otp, phone_no)

        //save to otp table
        const newOTP = await OTP.create({
            customerId: newUser.id,
            otp,
            expires_in
        })

        return res.status(200).json({
            success: true,
            code: "200",
            message: "Successful",
            data: {
                id: newUser.id,
            }
        })

    } catch (error) {
        return res.status(400).json({
            sucess: false,
            code: "400",
            message: error.message
        })
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

        if (!checkUser) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "OTP Incorrect"
        })

        //check if otp has expired
        let currentTime = new Date();
        let otpTime = checkUser.expires_in;

        if (currentTime.getTime() > otpTime.getTime()) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "OTP Expired!"
        })

        //change status to true
        checkUser.status = true;
        await checkUser.save()

        //update customer status
        const status = await Customer.update({ status: 'active' }, { where: { id } })
        return res.status(200).json({
            success: true,
            code: "200",
            message: "Successful",
            data: {
                id: id
            }
        })

    } catch (error) {
        return res.status(400).json({
            sucess: false,
            code: "400",
            message: error.message
        })
    }
}

const createPIN = async (req, res) => {
    const { id, PIN } = req.body;

    try {
        //to get customer email
        const customer = await Customer.findOne({ where: { id } });
        if(!customer) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "Customer does not Exist"
        })
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
        return res.status(200).json({
            success: true,
            code: "200",
            message: "Successful",
            data: {
                token: token
            }
        })
    } catch (error) {
        return res.status(400).json({
            sucess: false,
            code: "400",
            message: error.message
        })
    }
}

const signin = async (req, res) => {
    const { email, PIN } = req.body;

    try {
        //check if email exists
        const userExists = await User.findOne({ where: { email } });
        if (!userExists) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "User not registered"
        });

        //compare PIN
        if (PIN !== userExists.PIN) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "Incorrect PIN"
        })

        //update user status
        userExists.status = true;
        userExists.last_signed_in = Date.now();
        await userExists.save()

        //assign jwt token
        const token = jwt.sign({ id: userExists.id }, process.env.SECRET_KEY);
        return res.status(200).json({
            success: true,
            code: "200",
            message: "Successful",
            data: {
                token: token
            }
        })
    } catch (error) {
        return res.status(400).json({
            sucess: false,
            code: "400",
            message: error.message
        })
    }
}


const forgetPIN = async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(400).json({
            sucess: false,
            code: "400",
            message: "Email does not Exist!"
        })

        //Generate OTP
        const otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        const now = new Date();
        const expires_in = AddMinutesToDate(now, 10)

        //json to mail
        sendMail(email, otp)

        //save to otp table
        const newOTP = await OTP.create({
            customerId: user.id,
            otp,
            expires_in
        })

        return res.status(200).json({
            success: true,
            code: "200",
            message: 'Password reset pin has been sent to your mail'
        })
    } catch (err) {
        return res.status(400).json({
            sucess: false,
            code: "400",
            message: error.message
        })
    }
}

const resetCode = async (req, res) => {
    const { id, otp } = req.body;

    //check user
    const user = await User.findOne({ where: { id }})
    if(!user) return res.status(400).json({
        success: false,
        code: "400",
        message: 'user not found!'
    })

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

        return res.status(200).json({
            sucess: true,
            code: "200",
            message: "Reset Code Correct!"
        })

    } catch (err) {
        return res.status(400).json({
            sucess: false,
            code: "400",
            message: error.message
        })
    }
}

const resetPIN = async (req, res) => {
    const { id, PIN } = req.body;

    try {
        //check user
        const user = await User.findOne({ where: { id }})
        if(!user) return res.status(400).json({
            success: true,
            code: "400",
            message: 'user not found!'
        })

        //change PIN
        user.PIN = PIN;
        await user.save();

        //add to activity table
        const newActivity = await Activity.create({
            customerId: id,
            activity: 'pin_reset'
        })

        return res.json({
            success: true,
            code: "200",
            message: 'PIN changed successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: true,
            code: "400",
            message: error.message
        })
    }
}









module.exports = { register, verifyOTP, createPIN, signin, forgetPIN, resetCode, resetPIN }