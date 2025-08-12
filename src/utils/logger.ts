import { env } from '../config/env.js'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

class Logger {
  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  }

  private currentLevel: number

  constructor() {
    this.currentLevel = this.levels[env.LOG_LEVEL]
  }

  private log(level: LogLevel, message: string, meta?: unknown): void {
    if (this.levels[level] <= this.currentLevel) {
      const timestamp = new Date().toISOString()
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`
      
      if (meta) {
        console.log(prefix, message, meta)
      } else {
        console.log(prefix, message)
      }
    }
  }

  error(message: string, error?: Error | unknown): void {
    this.log('error', message, error)
  }

  warn(message: string, meta?: unknown): void {
    this.log('warn', message, meta)
  }

  info(message: string, meta?: unknown): void {
    this.log('info', message, meta)
  }

  debug(message: string, meta?: unknown): void {
    this.log('debug', message, meta)
  }
}

export const logger = new Logger()