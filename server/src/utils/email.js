import nodemailer from 'nodemailer'
import { env } from './env.js'

let transporter

export function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort),
    secure: Number(env.smtpPort) === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  })
  return transporter
}

export async function sendOtpEmail(to, otp) {
  // If SMTP is not configured, fallback to logging the OTP for development.
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    console.warn(`[DEV] SMTP not configured. OTP for ${to} is: ${otp}`)
    return
  }

  const t = getTransporter()

const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(90deg,#1a6b3c,#2e8b57); color:white; padding:20px; text-align:center;">
        <h2 style="margin:0;">National Scholarship Portal</h2>
        <p style="margin:5px 0 0; font-size:13px; opacity:.9;">Government of India</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <p style="font-size:15px; color:#333;">Dear User,</p>

        <p style="font-size:14px; color:#555; line-height:1.6;">
          We received a request to reset the password for your National Scholarship Portal (NSP) account.
          Please use the One-Time Password (OTP) below to proceed with your request.
        </p>

        <!-- OTP Box -->
        <div style="
          background:#f9fafb;
          border:1px dashed #f97316;
          border-radius:10px;
          text-align:center;
          padding:20px;
          margin:30px 0;
        ">
          <span style="
            font-size:34px;
            font-weight:700;
            letter-spacing:6px;
            color:#f97316;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px; color:#555;">
          This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone for security reasons.
        </p>

        <p style="font-size:14px; color:#555;">
          If you did not request a password reset, please ignore this email or contact support immediately.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f4f6f8; padding:20px; text-align:center; font-size:12px; color:#777;">
        <p style="margin:0;">© ${new Date().getFullYear()} National Scholarship Portal</p>
        <p style="margin:5px 0;">This is an automated message. Please do not reply.</p>
      </div>

    </div>
  </div>
`

  await t.sendMail({
    from: `"NSP Support" <${env.emailFrom || env.smtpUser}>`,
    to,
    subject: 'Password Reset OTP - National Scholarship Portal',
    html,
    text: `Your password reset code is ${otp}. It is valid for 10 minutes.`,
  })
}
