import { HealthCheckMap, TerminusState } from '@godaddy/terminus';
import { logger } from '../utils/logger.js';
import { prisma } from '../db/client.js';

/**
 * データベース接続のヘルスチェック
 */
export const databaseHealthCheck = async (): Promise<any> => {
  try {
    // Prismaの$queryRawでシンプルなクエリを実行
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'connected',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Database connection failed: ${message}`);
  }
};

/**
 * Redisのヘルスチェック（将来のRedis統合用）
 */
export const redisHealthCheck = async (): Promise<any> => {
  // TODO: Redis接続が実装されたら有効化
  // try {
  //   await redis.ping();
  //   return {
  //     status: 'connected',
  //     timestamp: new Date().toISOString(),
  //   };
  // } catch (error) {
  //   logger.error('Redis health check failed:', error);
  //   throw new Error(`Redis connection failed: ${error.message}`);
  // }
  
  return {
    status: 'not_configured',
    timestamp: new Date().toISOString(),
  };
};

/**
 * メインのヘルスチェック関数
 */
export const healthCheck = async (state: TerminusState): Promise<any> => {
  const startTime = Date.now();
  
  try {
    // 並列でヘルスチェックを実行
    const [databaseStatus, redisStatus] = await Promise.allSettled([
      databaseHealthCheck(),
      redisHealthCheck(),
    ]);

    const responseTime = Date.now() - startTime;

    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      checks: {
        database: databaseStatus.status === 'fulfilled' ? databaseStatus.value : { status: 'error', error: databaseStatus.reason.message },
        redis: redisStatus.status === 'fulfilled' ? redisStatus.value : { status: 'error', error: redisStatus.reason.message },
      },
      // terminusの状態情報も含める
      isShuttingDown: state.isShuttingDown,
    };

    logger.debug('Health check completed successfully', { responseTime, uptime: process.uptime() });
    return healthData;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Health check failed:', error);
    
    throw {
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      responseTime: `${responseTime}ms`,
      error: error instanceof Error ? error.message : String(error),
      isShuttingDown: state.isShuttingDown,
    };
  }
};

/**
 * Terminus用のヘルスチェックマップ
 */
export const healthChecks: HealthCheckMap = {
  '/health': ({ state }) => healthCheck(state),
  '/health/ready': ({ state }) => healthCheck(state), // Kubernetes readiness probe用
  '/health/live': async () => ({ status: 'ok', timestamp: new Date().toISOString() }), // Kubernetes liveness probe用（軽量）
};