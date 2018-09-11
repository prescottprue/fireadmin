import * as functions from 'firebase-functions'
import { get } from 'lodash'
import nodemailer from 'nodemailer'

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

function createMailTransport() {
  const gmailEmail = get(functions.config(), 'gmail.email')
  const gmailPassword = get(functions.config(), 'gmail.password')

  if (gmailEmail && gmailPassword) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailPassword
      }
    })
  }
}

async function handleEmailRequest(snap, context) {
  const mailTransport = createMailTransport()
  if (!mailTransport) {
    const noEmailMsg = 'Gmail Email not set. Email can not be sent.'
    console.error(noEmailMsg)
    throw new Error(noEmailMsg)
  }
  const { email, projectName } = snap.val() || {}
  if (!email || !projectName) {
    const missingParamsMsg =
      'email and projectName parameters are required to send email'
    console.error(missingParamsMsg)
    throw new Error(missingParamsMsg)
  }
  const mailOptions = {
    from: '"Fireadmin Team" <noreply@fireadmin.io>',
    to: email,
    subject: 'Invite To Fireadmin - Firebase Instance Management Application',
    html: projectName
      ? `"${projectName}" has been shared with you on fireadmin.io`
      : 'A user of Fireadmin (a Firebase application management application) would like you to join. Visit <a>fireadmin.io/signup</a> to create an account'
  }

  return mailTransport
    .sendMail(mailOptions)
    .then(() => {
      console.log(`Invite email sent to:`, email)
      return email
    })
    .catch(error => {
      console.error('There was an error while sending the email:', error)
      return Promise.reject(error)
    })
}

// Sends an email confirmation when a user changes his mailing list subscription.
export default functions.database
  .ref('/requests/invite/{uid}')
  .onCreate(handleEmailRequest)
