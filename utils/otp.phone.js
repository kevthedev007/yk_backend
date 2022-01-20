const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken)

function SendSMS(otp, to) {
  client.messages.create({
    body: `Your verification code is: ${otp}`,
    from: '+18454976926',
    to: to
  })
    .then(message => console.log("success"))
    .catch(err => console.log(err))
}

module.exports = SendSMS