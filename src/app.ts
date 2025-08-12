import express, { type Express, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'
import { openApiValidator } from './middleware/openApiValidator.js'
import { setupApiDocs } from './middleware/apiDocs.js'
import { apiRouter } from './routes/index.js'
import { logger } from './utils/logger.js'

export const createApp = (): Express => {
  const app = express()

  // セキュリティミドルウェア
  app.use(helmet())
  
  // CORS設定
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // 環境変数から許可するオリジンを取得
      const allowedOrigins = env.ALLOWED_ORIGINS
      
      // originがundefinedの場合（Postman等からの直接アクセス）
      if (!origin) {
        return callback(null, env.NODE_ENV === 'development')
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        logger.warn(`CORS blocked: ${origin}`)
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,  // Cookie送信を許可
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }
  
  app.use(cors(corsOptions))

  // 圧縮
  app.use(compression())

  // ボディパーサー
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // リクエストロガー
  app.use(requestLogger)

  // レート制限
  const limiter = rateLimit({
    windowMs: env.API_RATE_LIMIT_WINDOW_MS,
    max: env.API_RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
  })
  app.use(limiter)

  // APIドキュメント設定
  setupApiDocs(app)

  // ヘルスチェックは @godaddy/terminus で実装（src/index.tsを参照）

  // OpenAPI Validator（APIルートのみに適用）
  app.use(env.API_PREFIX, openApiValidator)

  // APIルート
  app.use(apiRouter)
  
  app.get(`${env.API_PREFIX}`, (_req: Request, res: Response) => {
    res.json({
      message: 'Express TypeScript API',
      version: '1.0.0',
      docs: '/api-docs',
    })
  })

  // 404ハンドラー
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        statusCode: 404,
        message: 'Route not found',
      },
    })
  })

  // エラーハンドラー
  app.use(errorHandler)

  return app
}