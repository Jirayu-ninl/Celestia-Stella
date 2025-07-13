import { isDevelopment } from '@env'
import * as Sentry from '@sentry/bun'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { z } from 'zod'
import { sentryMiddleware } from '@/integration/sentry'
import { controllers } from './controllers'
import { corsPrivate, corsPublic, requireBearer } from './middleware'

const app = new Hono()

if (isDevelopment) {
  app.use('*', logger())
}
app.use('*', sentryMiddleware)
app.use('/', corsPublic)
app.use('/public/*', corsPublic)
app.use('/*', corsPrivate)
app.use('/*', requireBearer)

app.onError((err, c) => {
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
})

app.notFound((c) => {
  return c.text('404 Not found', 404)
})

controllers(app)

export default app
