import { logger } from '../utils/logger.js';
import { db } from '../db/client.js';

/**
 * Graceful shutdown時のクリーンアップ処理
 */
export const onSignal = async (): Promise<void> => {
  logger.info('Starting graceful shutdown...');
  
  const shutdownTasks: Array<{ name: string; task: () => Promise<void> }> = [
    {
      name: 'Database connections',
      task: async () => {
        await db.$disconnect();
        logger.info('Database connections closed');
      },
    },
    // Redis接続が追加されたら以下を有効化
    // {
    //   name: 'Redis connections',
    //   task: async () => {
    //     await redis.disconnect();
    //     logger.info('Redis connections closed');
    //   },
    // },
  ];

  // 全てのクリーンアップタスクを並列で実行
  const results = await Promise.allSettled(
    shutdownTasks.map(async ({ name, task }) => {
      try {
        await task();
        return { name, status: 'success' };
      } catch (error) {
        logger.error(`Failed to cleanup ${name}:`, error);
        return { name, status: 'error', error: error.message };
      }
    })
  );

  // 結果をログ出力
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { name, status } = result.value;
      if (status === 'success') {
        logger.info(`Successfully cleaned up: ${name}`);
      } else {
        logger.error(`Failed to cleanup: ${name}`, result.value.error);
      }
    }
  });

  logger.info('Graceful shutdown completed');
};

/**
 * シャットダウン開始前の処理
 */
export const beforeShutdown = async (): Promise<void> => {
  logger.info('Server received shutdown signal, preparing to close...');
  
  // 新しいリクエストの受付を停止するための待機時間
  // ロードバランサーがサーバーを回転から除外する時間を与える
  await new Promise((resolve) => setTimeout(resolve, 5000));
  
  logger.info('Server ready for shutdown');
};

/**
 * 強制シャットダウン時の処理
 */
export const onShutdown = async (): Promise<void> => {
  logger.warn('Server shutdown completed (forced if this appears)');
};