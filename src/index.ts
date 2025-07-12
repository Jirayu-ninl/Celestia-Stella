import env, { isDevelopment } from '@env'
import * as Sentry from '@sentry/bun'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { sentryMiddleware } from '@/integration/sentry'
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
    return err.getResponse()
  }
  return c.json({ error: 'Internal server error' }, 500)
})

app.get('/debug/sentry', () => {
  try {
    throw new Error(
      `[TEST] api/sentryExampleAPIError: Throw error from TheIceJi-STELLA <${env.APP_ENV}>`,
    )
  } catch (e) {
    Sentry.captureException(e)
  }
  return new Response(
    JSON.stringify({ result: 'sent to Sentry successfully' }),
    { status: 201 },
  )
})

app.get('/', (c) => {
  return c.text('Celestia Stella is up!')
})

app.get('/public/status', (c) => {
  const health = {
    name: 'TheIceJi STELLA',
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  }
  return c.json(health)
})

export default app
