import { app as appConfig } from '@config'
import { env } from '@env'
import {
  extraErrorDataIntegration,
  flush,
  init,
  prismaIntegration,
} from '@sentry/bun'

init({
  dsn: env.SENTRY_DSN,
  release: appConfig.VERSION,
  environment: env.APP_ENV,
  tracesSampleRate: 1,
  _experiments: {
    enableLogs: true,
  },
  integrations: [prismaIntegration(), extraErrorDataIntegration()],
  debug: env.APP_ENV === 'staging',
})

process.on('exit', () => {
  flush(2000)
})
