import { promisify } from 'node:util'
import { gunzip } from 'node:zlib'
import type { Context, Next } from 'hono'

const gunzipAsync = promisify(gunzip)

const parseGzippedJson = async (c: Context, next: Next) => {
  if (
    c.req.header('content-type') === 'application/json' &&
    c.req.header('content-encoding') === 'gzip'
  ) {
    const buffer = await c.req.arrayBuffer()
    try {
      const decompressed = await gunzipAsync(new Uint8Array(buffer))
      c.req.json = () =>
        Promise.resolve(JSON.parse(decompressed.toString('utf-8')))
    } catch {
      c.status(400)
      return c.json({ error: 'Invalid gzipped JSON' })
    }
  }
  return await next()
}

export { parseGzippedJson }
