import type { z } from 'zod'

export enum AppErrorType {
  Validation = 'Validation',
  Unexpected = 'Unexpected',
  Unknown = 'Unknown',
}

export class AppError<Type = AppErrorType, Cause = unknown> extends Error {
  constructor(
    public name: string,
    public message: string,
    public errorType: Type,
    public code: string,
    public cause?: Cause,
    public fieldValidationIssues?: z.core.$ZodIssue[],
    public HTTPStatus = 500,
    public isTrusted = true,
  ) {
    super(message)
  }
}
