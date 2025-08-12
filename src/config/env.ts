import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('localhost'),
  DATABASE_URL: z.string().url().optional(),
  API_PREFIX: z.string().default('/api/v1'),
  API_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  API_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  ALLOWED_ORIGINS: z.string().transform((str) => str.split(',')).default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  JWT_SECRET: z.string().optional(),
  REDIS_URL: z.string().url().optional(),
  POSTGRES_DB: z.string().default('express_study'),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

export const env = parsed.data