import { createApp } from './app.js'
import { createServer } from './server.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

const startServer = async (): Promise<void> => {
  try {
    // terminusを統合したサーバーを作成
    const server = createServer()

    // 指定されたポートでリッスン開始
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server is running on http://${env.HOST}:${env.PORT}`)
      logger.info(`📚 Environment: ${env.NODE_ENV}`)
      logger.info(`📖 API Documentation: http://${env.HOST}:${env.PORT}/api-docs`)
      logger.info(`💚 Health Checks available at:`)
      logger.info(`   - http://${env.HOST}:${env.PORT}/health`)
      logger.info(`   - http://${env.HOST}:${env.PORT}/health/ready`)
      logger.info(`   - http://${env.HOST}:${env.PORT}/health/live`)
    })

    // プロセス終了時のエラーハンドリング
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
      // アプリケーションを終了
      process.exit(1)
    })

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error)
      // アプリケーションを終了
      process.exit(1)
    })

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()