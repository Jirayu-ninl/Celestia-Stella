import('./init')
  .then(() => console.log('✅ Sentry initialized'))
  .catch((err) => console.error(`Sentry initialized Error: ${err}`))

export { sentryMiddleware } from './middleware'
