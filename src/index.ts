import { createTerminus } from '@godaddy/terminus'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'
import { healthChecks } from './middleware/healthCheck.js'
import { onSignal, beforeShutdown, onShutdown } from './middleware/gracefulShutdown.js'

const startServer = async (): Promise<void> => {
  try {
    const app = createApp()

    // サーバーインスタンスを作成
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server is running on http://${env.HOST}:${env.PORT}`)
      logger.info(`📚 Environment: ${env.NODE_ENV}`)
      logger.info(`📖 API Documentation: http://${env.HOST}:${env.PORT}/api-docs`)
      logger.info(`💚 Health Checks available at:`)
      logger.info(`   - http://${env.HOST}:${env.PORT}/health`)
      logger.info(`   - http://${env.HOST}:${env.PORT}/health/ready`)
      logger.info(`   - http://${env.HOST}:${env.PORT}/health/live`)
    })

    // Terminusでヘルスチェックとgraceful shutdownを設定
    createTerminus(server, {
      // シグナル設定
      signals: ['SIGTERM', 'SIGINT'],
      
      // ヘルスチェック設定
      healthChecks,
      
      // Graceful shutdown設定
      onSignal,
      beforeShutdown,
      onShutdown,
      
      // タイムアウト設定
      timeout: 30000, // 30秒でタイムアウト
      
      // ログ設定
      logger: (msg: string, err?: Error) => {
        if (err) {
          logger.error(msg, err)
        } else {
          logger.info(msg)
        }
      },
      
      // ヘルスチェック失敗時のログ
      onHealthCheckFailed: (healthCheckName: string, error: Error) => {
        logger.error(`Health check failed: ${healthCheckName}`, error)
      },
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