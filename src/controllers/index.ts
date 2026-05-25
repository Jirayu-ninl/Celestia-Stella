import env from '@env'
import { debugModule, usersModule } from '@modules'
import type { Hono } from 'hono'

export const controllers = (app: Hono) => {
  app.get('/', (c) => {
    return c.text('Celestia Stella is up!')
  })
  app.get('/healthz', (c) => {
    const health = {
      name: 'Celestia STELLA',
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      uptime: process.uptime(),
    }
    return c.json(health)
  })

  app.route('/users', usersModule)
  app.route('/debug', debugModule)
}
