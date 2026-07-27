"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};
const emailTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #111111; border: 1px solid #2a2a2a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%); padding: 40px; text-align: center; }
    .header h1 { color: #0a0a0a; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
    .header p { color: #1a1a1a; margin: 8px 0 0; font-size: 14px; }
    .content { padding: 40px; }
    .content h2 { color: #ffd700; font-size: 22px; margin-bottom: 16px; }
    .content p { color: #a0a0a0; line-height: 1.7; margin-bottom: 16px; }
    .button { display: inline-block; background: linear-gradient(135deg, #b8860b, #ffd700); color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 16px 0; }
    .footer { padding: 24px 40px; border-top: 1px solid #2a2a2a; text-align: center; color: #555; font-size: 12px; }
    .gold-line { height: 2px; background: linear-gradient(90deg, transparent, #ffd700, transparent); margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ TrustFundX</h1>
      <p>AI-Powered Disaster Relief Network</p>
    </div>
    <div class="gold-line"></div>
    <div class="content">
      <h2>${title}</h2>
      ${body}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} TrustFundX. All rights reserved.</p>
      <p>This email was sent from a no-reply address. Do not reply directly.</p>
    </div>
  </div>
</body>
</html>
`;
exports.emailService = {
    async sendVerificationEmail(email, token) {
        const transporter = createTransporter();
        const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
        const body = `
      <p>Welcome to TrustFundX! Please verify your email address to activate your account.</p>
      <a href="${verifyUrl}" class="button">Verify Email Address</a>
      <p style="font-size: 12px; color: #555;">Or copy this link: ${verifyUrl}</p>
      <p style="font-size: 12px; color: #555;">This link expires in 24 hours.</p>
    `;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Verify your TrustFundX email address',
            html: emailTemplate('Verify Your Email', body),
        });
        logger_1.logger.info(`Verification email sent to ${email}`);
    },
    async sendPasswordResetEmail(email, token) {
        const transporter = createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
        const body = `
      <p>You requested a password reset for your TrustFundX account.</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p style="font-size: 12px; color: #555;">This link expires in 1 hour.</p>
      <p style="font-size: 12px; color: #555;">If you didn't request this, please ignore this email.</p>
    `;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Reset your TrustFundX password',
            html: emailTemplate('Password Reset Request', body),
        });
        logger_1.logger.info(`Password reset email sent to ${email}`);
    },
    async sendDonationConfirmation(email, campaignName, amount, txId) {
        const transporter = createTransporter();
        const explorerUrl = `${process.env.ALGORAND_EXPLORER_URL}/tx/${txId}`;
        const body = `
      <p>Your donation has been successfully processed on the Algorand blockchain!</p>
      <div style="background: #1a1a1a; border: 1px solid #ffd700; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="color: #ffd700; font-weight: 700; margin: 0 0 8px;">Donation Details</p>
        <p style="margin: 4px 0;">Campaign: <strong style="color: #fff;">${campaignName}</strong></p>
        <p style="margin: 4px 0;">Amount: <strong style="color: #ffd700;">${amount} ALGO</strong></p>
        <p style="margin: 4px 0;">Transaction ID: <code style="font-size: 11px; color: #a0a0a0;">${txId}</code></p>
      </div>
      <a href="${explorerUrl}" class="button">View on Algorand Explorer</a>
      <p>Thank you for your generosity. Every ALGO makes a difference.</p>
    `;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Donation confirmed – ${campaignName}`,
            html: emailTemplate('Donation Confirmed ✓', body),
        });
    },
};
//# sourceMappingURL=email.service.js.map