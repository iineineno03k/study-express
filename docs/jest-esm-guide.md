# Node.js ESMプロジェクトでJestを動作させる完全ガイド

## はじめに

モダンなNode.jsプロジェクトでは、`"type": "module"`を設定してESM（ECMAScript Modules）を使用することが増えています。しかし、Jestとの組み合わせは多くの開発者が躓くポイントです。

本記事では、TypeScript + ESM + Jestの組み合わせで発生する問題と、その完全な解決方法を実例とともに解説します。

## 対象読者

- Node.js ESMプロジェクトでJestを導入したい開発者
- `"type": "module"`設定でJestが動かない問題に直面している開発者
- TypeScript + ESM + Jestの設定で困っている開発者

## 前提環境

```json
{
  "name": "express-typescript-study",
  "type": "module",
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "jest": "^30.0.5",
    "ts-jest": "^29.4.1",
    "supertest": "^7.1.4",
    "typescript": "^5.9.2"
  }
}
```

- Node.js: v22.3.0
- npm: 10.8.1

## 問題の発生と症状

### 典型的なエラー1: import文の構文エラー

```bash
SyntaxError: Cannot use import statement outside a module
```

**原因**: `"type": "module"`が設定されているにも関わらず、Jestがファイルをモジュールとして認識していない。

### 典型的なエラー2: Jest設定ファイルの形式エラー

```bash
ReferenceError: module is not defined in ES module scope
```

**原因**: ESMプロジェクトでCommonJS形式の設定ファイル（`jest.config.js`）を使用している。

## 段階的解決方法

### ステップ1: Jest設定ファイルをESM形式に変更

まず、設定ファイル自体をESM対応にします。

```bash
# CommonJS形式のファイルを削除
rm jest.config.js

# ESM形式の設定ファイルを作成
touch jest.config.mjs
```

### ステップ2: ESM対応のJest設定を作成

`jest.config.mjs`を以下のように設定します：

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
    }],
  },
  testTimeout: 10000,
  setupFiles: ['<rootDir>/tests/env.setup.js'],
};
```

**重要なポイント**:
- `preset: 'ts-jest/presets/default-esm'`: ESM専用プリセット
- `extensionsToTreatAsEsm: ['.ts']`: .tsファイルをESMとして扱う
- `useESM: true`: ts-jestでESMモードを有効化
- `moduleNameMapper`: `.js`拡張子のインポートを`.ts`にマッピング

### ステップ3: TypeScript設定でisolatedModulesを有効化

`tsconfig.json`に以下を追加：

```json
{
  "compilerOptions": {
    "isolatedModules": true,
    // ... 他の設定
  }
}
```

### ステップ4: package.jsonのスクリプトを更新

```json
{
  "scripts": {
    "test": "NODE_OPTIONS=\"--experimental-vm-modules\" jest",
    "test:watch": "NODE_OPTIONS=\"--experimental-vm-modules\" jest --watch",
    "test:coverage": "NODE_OPTIONS=\"--experimental-vm-modules\" jest --coverage"
  }
}
```

**重要**: `NODE_OPTIONS=\"--experimental-vm-modules\"`は、Node.jsのESM VMモジュール機能を有効化するために必須です。

### ステップ5: テスト環境設定ファイルの作成

`tests/env.setup.js`を作成：

```javascript
// テスト環境の環境変数設定
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
process.env.LOG_LEVEL = 'error';
```

### ステップ6: テストファイルの作成

`tests/health.test.ts`の例：

```typescript
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
  });
});
```

## 実行とトラブルシューティング

### 正常な実行結果

```bash
$ npm test
> NODE_OPTIONS="--experimental-vm-modules" jest

(node:12345) ExperimentalWarning: VM Modules is an experimental feature
PASS tests/health.test.ts
  Health Check Endpoints
    GET /health/live
      ✓ liveness probeが正常に動作する (15 ms)

Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

### よくあるトラブルと解決方法

#### 1. `validateFormats` 警告が出る場合

```bash
"validateFormats" as a string is deprecated. Set to a boolean and use "ajvFormats"
```

**解決方法**: この警告は通常、依存関係のライブラリから出力されるもので、テスト実行には影響しません。気になる場合は該当ライブラリのアップデートを検討してください。

#### 2. Node.jsバージョンエラー

```bash
EBADENGINE Unsupported engine
```

**解決方法**: Voltaやnvmを使用して、プロジェクトで指定されたNode.jsバージョンを使用してください。

```bash
# Voltaの場合
volta install node@22.12.0

# nvmの場合
nvm use 22.12.0
```

## パフォーマンス最適化

### テスト実行時間の短縮

```javascript
// jest.config.mjs
export default {
  // ... 他の設定
  maxWorkers: '50%', // CPU使用率を制限
  testTimeout: 5000, // タイムアウト時間を短縮
  clearMocks: true,  // モックを自動クリア
};
```

### カバレッジ設定の最適化

```javascript
export default {
  // ... 他の設定
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/db/seed.ts',
    '!src/index.ts', // エントリーポイントは除外
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## 実際のプロジェクト事例

筆者のExpress + TypeScript学習プロジェクトでは、以下の構成で成功しています：

```
project/
├── package.json ("type": "module")
├── jest.config.mjs
├── tsconfig.json
├── src/
│   ├── app.ts
│   ├── middleware/
│   └── routes/
└── tests/
    ├── env.setup.js
    └── health.test.ts
```

この設定により、以下のテストが正常に動作します：

- Express.jsアプリケーションのエンドツーエンドテスト
- ヘルスチェックエンドポイントのテスト
- API統合テスト

## まとめ

ESMプロジェクトでJestを動作させるためには、以下のポイントが重要です：

1. **設定ファイルをESM形式（.mjs）にする**
2. **ts-jestのESM専用プリセットを使用する**
3. **Node.jsの実験的VM機能を有効化する**
4. **TypeScriptでisolatedModulesを有効化する**

これらの設定により、モダンなESMプロジェクトでも安定してJestテストを実行できます。

## 参考文献

- [Jest公式ドキュメント - ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules)
- [ts-jest公式ドキュメント - ESM Support](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support)
- [Node.js公式ドキュメント - ECMAScript modules](https://nodejs.org/api/esm.html)
- [TypeScript公式ドキュメント - isolatedModules](https://www.typescriptlang.org/tsconfig#isolatedModules)
- [Express.js公式ドキュメント](https://expressjs.com/)
- [supertest - GitHub](https://github.com/ladjs/supertest)

## さいごに

本記事が、ESMプロジェクトでのJest導入に悩む開発者の助けになれば幸いです。

設定が複雑に見えますが、一度正しく設定すれば、モダンなJavaScript/TypeScript開発の恩恵を最大限に活用できます。

---
