import * as functions from 'firebase-functions'
import { get } from 'lodash'
import nodemailer from 'nodemailer'

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = get(functions.config(), 'gmail.email')
const gmailPassword = get(functions.config(), 'gmail.password')
let mailTransport

if (gmailEmail && gmailPassword) {
  mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword
    }
  })
} else {
  console.error(
    'Gmail Email or Password not set in function environment. Invite function will not work!'
  )
}

// Sends an email confirmation when a user changes his mailing list subscription.
export default functions.database
  .ref('/requests/invite/{uid}')
  .onCreate((snap, context) => {
    if (!mailTransport) {
      return Promise.reject(
        new Error('Gmail Email not set. Email can not be sent.')
      )
    }
    const val = snap.val()
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
