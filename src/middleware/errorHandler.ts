import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

export interface ApiError extends Error {
  statusCode?: number
  details?: unknown
}

export class AppError extends Error implements ApiError {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  logger.error(`Error ${statusCode}: ${message}`, err)

  res.status(statusCode).json({
    error: {
      statusCode,
      message,
      details: err.details,
      timestamp: new Date().toISOString(),
    },
  })
}