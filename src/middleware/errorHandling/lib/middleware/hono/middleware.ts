import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { errorHandler } from '../../errorHandler.node'

export const handleHTTPError = (): ErrorHandler => (error, c) => {
  const appError = errorHandler.handleError(error)
  const status = appError.HTTPStatus || 500

  return c.json(
    {
      code: appError.code,
      errorType: appError.errorType,
      fieldValidationIssues: appError.fieldValidationIssues,
    },
    status as ContentfulStatusCode,
  )
}
