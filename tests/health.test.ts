import request from 'supertest';
import { createServer } from '../src/server';
import type { Server } from 'http';

describe('Health Check Endpoints', () => {
  let server: Server;

  beforeAll(() => {
    server = createServer();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /health/live', () => {
    test('200レスポンスを返す', async () => {
      await request(server)
        .get('/health/live')
        .expect(200);
    });
  });

  describe('GET /health', () => {
    test('200レスポンスを返す', async () => {
      await request(server)
        .get('/health')
        .expect(200);
    });
  });

  describe('GET /health/ready', () => {
    test('200レスポンスを返す', async () => {
      await request(server)
        .get('/health/ready')
        .expect(200);
    });
  });

  describe('アプリケーション全体のテスト', () => {
    test('全てのヘルスチェックエンドポイントが利用可能', async () => {
      const endpoints = ['/health', '/health/ready', '/health/live'];
      
      for (const endpoint of endpoints) {
        await request(server).get(endpoint).expect(200);
      }
    });
  });
});