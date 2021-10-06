const nodemailer = require('nodemailer')

function sendMail(email, OTP) {
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

    let mailTransport = {
        from: '"noreply" <YKNetworksNigeria@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Account Activation", // Subject line
        html: ` <h1>Email Confirmation</h1>
                <h2>Hello ${email}</h2>
                <p>Thank you for registering. Your OTP is ${OTP}</p> `
      };

      transporter.sendMail(mailTransport, (error, info) => {
          if(error) throw new Error('Mail not sent');
          console.log(info)
      });
}


module.exports = sendMail