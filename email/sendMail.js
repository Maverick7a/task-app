const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASS,
    },
    });

    try {
    const info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to, 
    subject,
    html,
    });

    console.log('✅ Email sent:', info.messageId);
    } catch (error) {
    console.error('❌ Error:', error.message);
    }
};

// sendEmail();

module.exports = sendEmail
