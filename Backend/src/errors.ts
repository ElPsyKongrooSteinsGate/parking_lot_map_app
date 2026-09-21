import type { ErrorRequestHandler, Request } from 'express'

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function requestId(request: Request) {
  return request.id
}

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error)
  const apiError = error instanceof ApiError ? error : null
  const statusCode = apiError?.statusCode ?? 500
  const code = apiError?.code ?? 'INTERNAL_ERROR'
  const message = apiError?.message ?? 'An unexpected error occurred.'
  const details = apiError?.details ?? []
  if (statusCode >= 500) console.error(JSON.stringify({ level: 'error', requestId: request.id, error }))
  response.status(statusCode).json({ error: { code, message, details, requestId: request.id } })
}
