const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP - Shiksha',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 30px;">🔐 Password Reset Request</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Hello,
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            You have requested to reset your password for your Shiksha account. Please use the OTP below to complete the process:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 3px;">
              ${otp}
            </div>
          </div>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            This OTP is valid for <strong>10 minutes</strong>. If you didn't request this password reset, please ignore this email.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            For security reasons, please do not share this OTP with anyone.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you're having trouble, contact our support team.
          </p>
          <p style="color: #999; font-size: 14px; text-align: center;">
            © 2025 Shiksha Institute. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOtpEmail };
