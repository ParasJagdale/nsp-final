import 'dotenv/config'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

export const env = {
  nodeEnv: (process.env.NODE_ENV ?? 'development').trim().toLowerCase(),
  port: Number(process.env.PORT ?? 5174),
  mongoUri: requireEnv('MONGODB_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: process.env.SMTP_PORT ?? '587',
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  emailFrom: process.env.EMAIL_FROM ?? 'no-reply@example.com',
}
