const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'muzamilazam1@gmail.com',
        to: email,
        subject: 'Thanks for joining in!!',
        text: `Welcome to the app ${name}. Please let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        from: 'muzamilazam1@gmail.com',
        to: email,
        subject: 'Sorry to see you go :(',
        text: `Goodbye, ${name}. Please let me know why you chose to leave.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

