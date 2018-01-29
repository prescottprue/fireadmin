const functions = require('firebase-functions')
const nodemailer = require('nodemailer')

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
})

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendInvite = functions.database
  .ref('/requests/invite/{uid}')
  .onCreate(event => {
    const snapshot = event.data
    const val = snapshot.val()

    const mailOptions = {
      from: '"Fireadmin Team" <noreply@fireadmin.io>',
      to: val.email,
      subject: 'Invite To Fireadmin - Firebase Instance Management Application',
      html: val.projectName
        ? `"${val.projectName}" has been shared with you on fireadmin.io`
        : 'A user of Fireadmin (a Firebase application management application) would like you to join. Visit <a>fireadmin.io/signup</a> to create an account'
    }

    return mailTransport
      .sendMail(mailOptions)
      .then(() => console.log(`Invite email sent to:`, val.email))
      .catch(error =>
        console.error('There was an error while sending the email:', error)
      )
  })
