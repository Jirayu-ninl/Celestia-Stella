import env from '@env'
import type { MiddlewareHandler } from 'hono'
import { cors } from 'hono/cors'

export const corsPublic = cors({
  origin: '*',
  allowHeaders: ['Content-Type'],
  allowMethods: ['GET', 'POST'],
})

export const corsPrivate = cors({
  origin: env.ALLOWED_ORIGINS,
  allowHeaders: ['Content-Type', 'Authorization', 'JWT-Token'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})

export const requireBearer: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header('Authorization')
  if (c.req.path.startsWith('/public/') || c.req.path === '/') return next()
  if (!auth?.startsWith('Bearer ')) {
    return c.text('Unauthorized', 401)
  }
  const authToken = auth.split('Bearer ')[1]
  if (authToken !== env.AUTHORIZE) {
    return c.text('Unauthorized', 401)
  }
  await next()
}
