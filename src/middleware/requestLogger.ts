import morgan from 'morgan'
import { logger } from '../utils/logger.js'
import { env } from '../config/env.js'

morgan.token('body', (req: any) => {
  return JSON.stringify(req.body)
})

const format = env.NODE_ENV === 'development' 
  ? ':method :url :status :response-time ms - :res[content-length]'
  : 'combined'

export const requestLogger = morgan(format, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim())
    },
  },
})