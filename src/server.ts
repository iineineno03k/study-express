import { createTerminus } from '@godaddy/terminus'
import { createApp } from './app.js'
import { healthChecks } from './middleware/healthCheck.js'
import { onSignal, beforeShutdown, onShutdown } from './middleware/gracefulShutdown.js'
import { logger } from './utils/logger.js'
import type { Server } from 'http'

/**
 * terminusを統合したサーバーを作成
 */
export const createServer = (port: number = 0): Server => {
  const app = createApp()
  
  // サーバーインスタンスを作成
  const server = app.listen(port) // ポート指定可能、0で自動割り当て
  
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
    timeout: 30000,
    
    // ログ設定
    logger: (msg: string, err?: Error) => {
      if (process.env.NODE_ENV !== 'test') {
        if (err) {
          logger.error(msg, err)
        } else {
          logger.info(msg)
        }
      }
    },
    
  })
  
  return server
}

/**
 * テスト用のアプリケーション作成（terminusなし）
 * 単体テスト用途
 */
export { createApp }