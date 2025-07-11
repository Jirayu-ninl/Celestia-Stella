import type { Env } from './env'
import { env } from './env'

export function requireEnvVar(key: keyof Env): NonNullable<Env[typeof key]> {
    const value = env[key]
    if (value === undefined || value === null) {
        throw new Error(`Required environment variable ${key} is missing`)
    }
    return value as NonNullable<Env[typeof key]>
}
