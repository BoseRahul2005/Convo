const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    pool: true,           // reuse connections instead of creating new ones each time
    maxConnections: 5,     // how many simultaneous connections the pool can hold
    maxMessages: 100        // how many emails to send per connection before recycling it
});

module.exports = transporter;