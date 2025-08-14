import { z } from 'zod'

export const envSchema = z.object({
  // ** SERVER
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),
  APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  ALLOWED_ORIGINS: z.string().transform((val, ctx) => {
    const env = process.env.NODE_ENV ?? 'development'
    if (val === '*') {
      if (env !== 'development') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '`*` wildcard is only allowed in development',
        })
      }
      return '*'
    }

    const origins = val
      .split(',')
      .map((o) => o.trim().replace(/\/$/, '')) // remove trailing slash
      .filter((o) => o.length > 0)

    for (const origin of origins) {
      if (origin.endsWith('/')) {
        console.warn(
          `⚠️ ALLOWED_ORIGINS should not end with '/'. It will be removed: ${origin}`,
        )
      }
      try {
        new URL(origin)
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid URL format in ALLOWED_ORIGINS: ${origin}`,
        })
      }
    }

    return origins
  }),
  // ** DATABASE
  MONGODB_URI: z
    .string()
    .url()
    .refine(
      (val) => val.startsWith('mongodb://') || val.startsWith('mongodb+srv://'),
      {
        message: 'MONGODB_URI must start with "mongodb://" or "mongodb+srv://"',
      },
    ),
  REDIS_URI: z.string().url().startsWith('redis://'),
  PGSQL_URI: z.string().url().startsWith('postgresql://'),
  // ** AUTHENTICATION
  SECRET: z.string(),
  AUTHORIZE: z.string().min(1),
  // ** S3
  S3_ORIGINS: z.preprocess((value) => {
    const str = String(value)
    return str.split(',')
  }, z.array(z.string()).optional()),
  S3_UPLOAD_ENDPOINT: z.string(),
  S3_UPLOAD_KEY: z.string(),
  S3_UPLOAD_SECRET: z.string(),
  S3_UPLOAD_REGION: z.string(),
  S3_UPLOAD_BUCKET: z.string(),
  // ** EMAIL
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.preprocess((x) => Number.parseInt(String(x)), z.number()),
  EMAIL_SECURE: z.preprocess(
    (val) => val === true || val === 'true',
    z.boolean(),
  ),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.string(),
  // ** PAYMENT
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_DONATE_ID: z.string(),
  STRIPE_METADATA_KEY: z.string(),
  // ** MONITORING
  SENTRY_DSN: z.string().url().startsWith('https://'),
})
