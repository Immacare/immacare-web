/**
 * Email Service Module
 * 
 * PURPOSE:
 * Handles all email sending functionality using Resend HTTP API
 * (HTTP API is used instead of SMTP because Render blocks outbound SMTP ports)
 * 
 * USAGE:
 * Used for sending verification emails, password resets, and notifications
 */

require('dotenv').config();

/**
 * Send email using Resend HTTP API
 * @param {Object} mailOptions - Email options (from, to, subject, html)
 * @returns {Promise<Object>} API response
 */
async function sendEmailViaResendAPI(mailOptions) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

/**
 * Send email verification email
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationToken - Email verification token
 * @returns {Promise<Object>} Resend API response
 */
async function sendVerificationEmail(email, name, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  try {
    const mailOptions = {
      from: process.env.RESEND_FROM_EMAIL || 'ImmaCare+ <noreply@yourdomain.com>',
      to: email,
      subject: 'Verify Your ImmaCare+ Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Welcome to ImmaCare+!</h2>
            
            <p>Hello ${name},</p>
            
            <p>Thank you for registering with ImmaCare+. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create an account with ImmaCare+, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; margin: 0;">
              Best regards,<br>
              The ImmaCare+ Team
            </p>
          </div>
        </body>
        </html>
      `
    };

    const result = await sendEmailViaResendAPI(mailOptions);
    console.log('Verification email sent:', result.id);
    
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} Resend API response
 */
async function sendPasswordResetEmail(email, name, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  try {
    const mailOptions = {
      from: process.env.RESEND_FROM_EMAIL || 'ImmaCare+ <noreply@yourdomain.com>',
      to: email,
      subject: 'Reset Your ImmaCare+ Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Password Reset Request</h2>
            
            <p>Hello ${name},</p>
            
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; margin: 0;">
              Best regards,<br>
              The ImmaCare+ Team
            </p>
          </div>
        </body>
        </html>
      `
    };

    const result = await sendEmailViaResendAPI(mailOptions);
    console.log('Password reset email sent:', result.id);
    
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};

