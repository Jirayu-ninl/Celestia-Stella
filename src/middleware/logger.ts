import type { Context, Next } from 'hono'

const truncateDecimals = (number: number, digits: number): number => {
  const multiplier = 10 ** digits
  const adjustedNum = number * multiplier
  const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)
  return truncatedNum / multiplier
}

const logger = async (c: Context, next: Next) => {
  const start = Date.now()

  await next()

  const end = Date.now()
  const elapsedTime = end - start

  const methodLog = `[${c.req.method}]`.padEnd(7)

  // Extract path and query parameters
  const url = new URL(c.req.url)
  const pathWithParams = url.pathname + url.search
  const uriLog = `${pathWithParams}`.padEnd(100)

  const statusLog = `[${c.res.status}]`.padEnd(6)
  const elapsedMillisecondsLog =
    `(${truncateDecimals(elapsedTime, 4)} ms)`.padStart(25)

  //   skipcq: JS-0002
  console.log(`${methodLog}${uriLog}${statusLog}${elapsedMillisecondsLog}`)
}

export { logger }
