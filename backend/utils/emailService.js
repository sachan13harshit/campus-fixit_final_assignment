const nodemailer = require('nodemailer');

const sendStatusUpdateEmail = async (userEmail, userName, issueTitle, newStatus, remarks) => {
    // If no real credentials are set, simulate email sending by logging to console
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('\n================ [MOCK EMAIL SERVICE] ================');
        console.log(`To: ${userEmail}`);
        console.log(`Subject: Issue Update: ${issueTitle}`);
        console.log(`Body: Hi ${userName}, your issue "${issueTitle}" is now ${newStatus}. Remarks: ${remarks || 'None'}`);
        console.log('======================================================\n');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to your email provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Campus FixIt" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Issue Update: ${issueTitle}`,
            text: `Hi ${userName},\n\nThe status of your reported issue "${issueTitle}" has been updated to: ${newStatus}.\n\nRemarks: ${remarks || 'None'}\n\nThank you for helping us keep the campus clean!\n\nRegards,\nCampus FixIt Admin`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = { sendStatusUpdateEmail };
