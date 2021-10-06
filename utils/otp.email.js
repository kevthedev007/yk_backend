const nodemailer = require('nodemailer')

function sendMail(email, OTP) {
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
          res.send('A verification link has been sent to your email')
      });
}


module.exports = sendMail