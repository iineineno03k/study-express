import request from 'supertest';
import { createApp } from '../src/app';

describe('Health Check Endpoints', () => {
  const app = createApp();

  describe('GET /health/live', () => {
    test('liveness probeが正常に動作する', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      
      // タイムスタンプが有効なISO文字列であることを確認
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    test('レスポンスが高速である', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/health/live')
        .expect(200);
        
      const responseTime = Date.now() - startTime;
      
      // liveness probeは軽量なので100ms以内でレスポンス
      expect(responseTime).toBeLessThan(100);
    });
  });

  describe('GET /health', () => {
    test('詳細なヘルスチェック情報を返す', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // 基本的なプロパティの確認
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('responseTime');
      expect(response.body).toHaveProperty('checks');
      expect(response.body).toHaveProperty('isShuttingDown');

      // チェック項目の確認
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('redis');
      
      // データベースチェックの構造確認
      expect(response.body.checks.database).toHaveProperty('status');
      expect(response.body.checks.database).toHaveProperty('timestamp');
      
      // Redisチェックの構造確認
      expect(response.body.checks.redis).toHaveProperty('status');
      expect(response.body.checks.redis).toHaveProperty('timestamp');
      
      // タイムスタンプの妥当性確認
      expect(() => new Date(response.body.timestamp)).not.toThrow();
      
      // アップタイムが数値であることを確認
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
      
      // レスポンスタイムの形式確認
      expect(response.body.responseTime).toMatch(/^\d+ms$/);
      
      // シャットダウン状態の確認
      expect(typeof response.body.isShuttingDown).toBe('boolean');
      expect(response.body.isShuttingDown).toBe(false);
    });

    test('環境設定が正しく設定されている', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.environment).toBe('test');
      expect(response.body.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('GET /health/ready', () => {
    test('readiness probeが正常に動作する', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect(200);

      // readiness probeは/healthと同じ詳細情報を返す
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('redis');
    });
  });

  describe('アプリケーション全体のテスト', () => {
    test('全てのヘルスチェックエンドポイントが利用可能', async () => {
      const endpoints = ['/health', '/health/ready', '/health/live'];
      
      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        // 200（正常）または503（一時的な問題）を許可
        expect([200, 503]).toContain(response.status);
        expect(response.body).toHaveProperty('status');
      }
    });
  });
});