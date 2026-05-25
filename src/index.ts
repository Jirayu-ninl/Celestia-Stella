import { isDevelopment } from '@env'
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { sentryMiddleware } from '@/integration/sentry'
import { controllers } from './controllers'
import {
  advLogger,
  corsPrivate,
  corsPublic,
  errorHandler,
  // handleHTTPError,
  parseGzippedJson,
  requestIdHonoMiddleware,
  requireBearer,
  sentryErrorHandler,
  strictTransportSecurity,
  xContentTypeOptions,
} from './middleware'

const app = new Hono()
advLogger.configureLogger(
  {
    prettyPrint: Boolean(process.env.PRETTY_PRINT),
  },
  true,
)

app.use('*', etag())
app.use(trimTrailingSlash())
app.use(parseGzippedJson)
if (isDevelopment) {
  app.use('*', logger())
}

app.use('*', prettyJSON())
app.use('*', requestIdHonoMiddleware())
app.use('*', sentryMiddleware)
app.use('/', corsPublic)
app.use('/public/*', corsPublic)
app.use('/public/healthz', corsPublic)
app.use('/*', corsPrivate)
app.use('/*', requireBearer)

app.onError(sentryErrorHandler)
// app.onError(handleHTTPError())

app.use('*', strictTransportSecurity())
app.use('*', xContentTypeOptions())

errorHandler.listenToErrorEvents()

app.notFound((c) => {
  return c.text('404 Not found', 404)
})

controllers(app)
advLogger.info(`[STELLA] App started at ${new Date().toISOString()}`)

export default app
