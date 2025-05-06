// utils/mailjet.js
const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

async function sendResetEmail(toEmail, toName, resetToken) {
  const frontendUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
  console.log('Reset Link:', resetLink)

  const emailData = {
    Messages: [
      {
        From: {
          Email: process.env.SENDER_EMAIL,
          Name: 'Events Platform'
        },
        To: [
          {
            Email: toEmail,
            Name: toName || ''
          }
        ],
        Subject: "Password Reset Request",
        TextPart: `Hello,\nPlease use the following link to reset your password:\n${resetLink}\nThis link expires in 15 mins.\nIf you did not request this, you can ignore this email.`,
        HTMLPart: `<p>Hello,</p>
                   <p>Please click the link below to reset your password:</p>
                   <p><a href="${resetLink}">Reset Password</a></p>
                   <p>This link expires in 15 mins.</p>
                   <p>If you did not request this, you can ignore this email.</p>`
      }
    ]
  };

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request(emailData);
    console.log(`Mailjet response: ${result.body.Messages[0].Status}`);
    return result.body;
  } catch (err) {
    console.error("Error sending email via Mailjet:", err);
    throw err;
  }
}

module.exports = { sendResetEmail };