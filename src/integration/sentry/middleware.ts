import { captureException } from '@sentry/bun'
import type { MiddlewareHandler } from 'hono'

export const sentryMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next()
  } catch (err) {
    captureException(err)
    console.error('[Sentry]', err)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
