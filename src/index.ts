import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

const startServer = async (): Promise<void> => {
  try {
    const app = createApp()

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running on http://${env.HOST}:${env.PORT}`)
      logger.info(`📚 Environment: ${env.NODE_ENV}`)
      logger.info(`📖 API Documentation: http://${env.HOST}:${env.PORT}/api-docs`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()