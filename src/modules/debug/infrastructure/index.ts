import env from '@env'
import * as Sentry from '@sentry/bun'
import { Hono } from 'hono'

const debug = new Hono()

debug.get('/sentry', () => {
  try {
    throw new Error(
      `[TEST] api/sentryExampleAPIError: Throw error from Celestia-STELLA <${env.APP_ENV}>`,
    )
  } catch (e) {
    Sentry.captureException(e)
  }
  return new Response(
    JSON.stringify({ result: 'sent to Sentry successfully' }),
    { status: 201 },
  )
})

export { debug as debugModule }
