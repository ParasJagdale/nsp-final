import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  mongoose.set('strictQuery', true)

  const maxAttempts = 6
  let attempt = 0
  let lastErr = null

  while (attempt < maxAttempts) {
    try {
      attempt += 1
      const timeout = 10_000
      console.log(`[db] connecting to mongo (attempt ${attempt}/${maxAttempts})`)
      await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: timeout })
      console.log('[db] connected to mongo')
      return
    } catch (err) {
      lastErr = err
      const waitMs = Math.min(30_000, 500 * 2 ** attempt)
      console.warn(`[db] connection attempt ${attempt} failed: ${err?.message ?? err}. retrying in ${waitMs}ms`)
      // small delay
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, waitMs))
    }
  }

  const message = lastErr instanceof Error ? lastErr.message : String(lastErr)
  throw new Error(
    `MongoDB connection failed after ${maxAttempts} attempts. Common fixes: (1) Atlas Network Access: add your IP / allow 0.0.0.0/0 for dev, (2) verify username/password in the URI, (3) verify the cluster is running.\nOriginal error: ${message}`
  )
}
