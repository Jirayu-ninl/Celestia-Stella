import * as Sentry from '@sentry/bun'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

export const sentryErrorHandler = (err: Error, c: Context) => {
  Sentry.captureException(err)
  console.error('[Sentry]', err)
  if (err instanceof HTTPException) {
    return c.json({ error: err.getResponse(), message: 'HTTPException' }, 501)
  }
  if (err instanceof z.ZodError) {
    const errors = z.flattenError(err)
    return c.json({ error: errors, message: 'ZodError' }, 400)
  }
  return c.json({ error: 'Internal server error' }, 500)
}
