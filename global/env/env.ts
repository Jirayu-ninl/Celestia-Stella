import { z } from 'zod'
import { envSchema } from './env.schema'

export type Env = z.infer<typeof envSchema>

function createEnv(): Env {
  try {
    const parsed = envSchema.parse(process.env)
    if (parsed.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully')
      console.log(`✅ Running on ${parsed.HOST}:${parsed.PORT}`)
      console.log(`✅ Database: ${parsed.MONGODB_URI.split('@')[1]}`)
    }

    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `❌ ${err.path.join('.')}: ${err.message}`)
        .join('\n')

      console.error(`\n🚨 Environment validation failed:\n${missingVars}\n`)
      process.exit(1)
    }
    throw error
  }
}

let _env: Env | null = null

export function getEnv(): Env {
  if (!_env) {
    _env = createEnv()
  }
  return _env
}

export const env = getEnv()

export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isStaging = env.NODE_ENV === 'staging'
export const isTest = env.NODE_ENV === 'test'
