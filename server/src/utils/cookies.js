import { env } from './env.js'

export function setAccessCookie(res, token) {
  const isProd = env.nodeEnv === 'production'
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour
    path: '/',
  })
}

export function clearAccessCookie(res) {
  const isProd = env.nodeEnv === 'production'
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  })
}
