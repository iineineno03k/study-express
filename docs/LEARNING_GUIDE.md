# 🎯 Express + TypeScript 深掘り学習ガイド

## 💡 重要概念の解説

### 1. ミドルウェアパイプライン

Express.jsの核心はミドルウェアです。リクエストが来てからレスポンスを返すまでの流れ：

```typescript
// リクエストの流れ
Request → [Helmet] → [CORS] → [BodyParser] → [Logger] → [RateLimit] 
        → [Validator] → [Router] → [Controller] → [Service] → [Database]
        → Response

// エラー時の流れ
Error → [ErrorHandler] → Response
```

**理解ポイント**:
- `next()`を呼ばないとリクエストが止まる
- エラーは`next(error)`で次のエラーハンドラーへ
- ミドルウェアの順序が重要（認証→認可→実処理）

### 2. TypeScriptの型システム活用

```typescript
// 良い例：型推論を活用
const users = await prisma.user.findMany() // User[]型が自動推論

// 悪い例：any型の使用
const data: any = await getData() // 型安全性が失われる

// ベストプラクティス：明示的な型定義
interface ApiResponse<T> {
  data: T
  meta: {
    timestamp: Date
    version: string
  }
}
```

### 3. 非同期処理とエラーハンドリング

```typescript
// Promiseチェーンを避ける
// 悪い例
getUserById(id)
  .then(user => processUser(user))
  .then(result => res.json(result))
  .catch(err => next(err))

// 良い例：async/await
try {
  const user = await getUserById(id)
  const result = await processUser(user)
  res.json(result)
} catch (error) {
  next(error)
}
```

### 4. Prismaのベストプラクティス

```typescript
// N+1問題を避ける
// 悪い例
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } })
}

// 良い例：includeを使用
const users = await prisma.user.findMany({
  include: { posts: true }
})

// トランザクション処理
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData })
  const profile = await tx.profile.create({ 
    data: { ...profileData, userId: user.id } 
  })
  return { user, profile }
})
```

## 🔥 実践的な演習問題

### 演習1: 認証ミドルウェアの実装

```typescript
// src/middleware/auth.ts を作成
// JWTトークンを検証するミドルウェアを実装してください

import jwt from 'jsonwebtoken'

export const authenticate = async (req, res, next) => {
  // TODO: 
  // 1. Authorizationヘッダーからトークンを取得
  // 2. トークンを検証
  // 3. ユーザー情報をreq.userに格納
  // 4. 無効な場合は401エラー
}
```

### 演習2: ページネーション最適化

```typescript
// 現在の実装を改善してください
// ヒント：カーソルベースページネーションを実装

interface PaginationParams {
  cursor?: string
  limit: number
}

async function getCursorPagination(params: PaginationParams) {
  // TODO: カーソルベースのページネーション実装
}
```

### 演習3: キャッシング戦略

```typescript
// Redisを使用したキャッシング層を追加
// src/services/cacheService.ts

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    // TODO: キャッシュから取得
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // TODO: キャッシュに保存
  }
  
  async invalidate(pattern: string): Promise<void> {
    // TODO: パターンマッチでキャッシュ削除
  }
}
```

## 🏗️ アーキテクチャパターン

### Clean Architecture適用例

```
src/
├── domain/           # ビジネスロジック（フレームワーク非依存）
│   ├── entities/     # ビジネスエンティティ
│   ├── usecases/     # ユースケース
│   └── repositories/ # リポジトリインターフェース
├── infrastructure/   # 外部システムとの接続
│   ├── database/     # Prisma実装
│   ├── cache/        # Redis実装
│   └── external/     # 外部API
├── presentation/     # UIレイヤー
│   ├── http/         # Express controllers
│   └── graphql/      # GraphQL resolvers（オプション）
└── application/      # アプリケーション設定
    └── container/    # DIコンテナ
```

## 🎪 高度なトピック

### 1. イベント駆動アーキテクチャ

```typescript
// EventEmitterを使用した疎結合設計
import { EventEmitter } from 'events'

class UserService extends EventEmitter {
  async createUser(data: CreateUserDto) {
    const user = await prisma.user.create({ data })
    
    // イベント発火
    this.emit('user.created', user)
    
    return user
  }
}

// リスナー登録
userService.on('user.created', async (user) => {
  await sendWelcomeEmail(user)
  await createInitialSettings(user)
  await logAnalytics('user_signup', user)
})
```

### 2. レート制限の高度な実装

```typescript
// IPアドレス + ユーザーIDでの制限
const createRateLimiter = (options: RateLimitOptions) => {
  return rateLimit({
    ...options,
    keyGenerator: (req) => {
      // 認証済みユーザーはユーザーID、未認証はIPアドレス
      return req.user?.id || req.ip
    },
    skip: (req) => {
      // 管理者はスキップ
      return req.user?.role === 'admin'
    }
  })
}
```

### 3. OpenTelemetryでの観測性

```typescript
// トレーシング設定
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('express-app')

export function withTracing(name: string, fn: Function) {
  return async (...args: any[]) => {
    const span = tracer.startSpan(name)
    try {
      const result = await fn(...args)
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.recordException(error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      throw error
    } finally {
      span.end()
    }
  }
}
```

## 📊 パフォーマンス最適化

### 1. データベースクエリ最適化

```typescript
// インデックスの活用
// prisma/schema.prisma
model User {
  @@index([email])      // 単一インデックス
  @@index([name, email]) // 複合インデックス
}

// バッチ処理
const batchUpdate = await prisma.$transaction(
  users.map(user => 
    prisma.user.update({
      where: { id: user.id },
      data: { status: 'active' }
    })
  )
)

// Raw SQLの使用（必要時）
const result = await prisma.$queryRaw`
  SELECT * FROM users 
  WHERE created_at > ${startDate}
  ORDER BY created_at DESC
  LIMIT 100
`
```

### 2. メモリ管理

```typescript
// ストリーミング処理
import { pipeline } from 'stream/promises'

async function exportLargeData(res: Response) {
  const stream = prisma.user.findMany({
    cursor: { id: 0 },
    take: 100,
  })
  
  await pipeline(
    stream,
    transformToCSV(),
    res
  )
}
```

## 🧪 テスト戦略

### 単体テスト例

```typescript
// userService.test.ts
describe('UserService', () => {
  let userService: UserService
  
  beforeEach(() => {
    // Prismaのモック
    jest.mock('@prisma/client')
  })
  
  it('should create user with hashed password', async () => {
    const userData = { 
      email: 'test@test.com',
      password: 'plain_password' 
    }
    
    const user = await userService.create(userData)
    
    expect(user.password).not.toBe('plain_password')
    expect(bcrypt.compare).toHaveBeenCalled()
  })
})
```

### 統合テスト例

```typescript
// app.test.ts
import request from 'supertest'
import { app } from '../src/app'

describe('POST /api/v1/users', () => {
  it('should create user with valid data', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'new@test.com',
        name: 'Test User',
        password: 'securePassword123'
      })
      
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.email).toBe('new@test.com')
  })
})
```

## 🔐 セキュリティチェックリスト

- [ ] SQLインジェクション対策（Prismaで自動対応）
- [ ] XSS対策（Helmetで対応）
- [ ] CSRF対策（トークン実装）
- [ ] レート制限（実装済み）
- [ ] 入力検証（OpenAPI Validator）
- [ ] 認証・認可
- [ ] セキュアなセッション管理
- [ ] HTTPS強制
- [ ] 依存関係の脆弱性チェック（`npm audit`）
- [ ] 環境変数の暗号化
- [ ] ログのサニタイゼーション

## 🎯 1週間の具体的な進め方

### 月曜日（4時間）
- 午前：プロジェクト全体を読む、実行する
- 午後：TypeScript基礎、型システムを理解

### 火曜日（4時間）
- 午前：Express.jsのミドルウェア概念を実装で確認
- 午後：OpenAPI仕様書を編集、新しいエンドポイント追加

### 水曜日（4時間）
- 午前：Prismaでマイグレーション、新しいモデル追加
- 午後：リレーションを含むクエリ実装

### 木曜日（4時間）
- 午前：認証機能の実装
- 午後：エラーハンドリングの改善

### 金曜日（4時間）
- 午前：単体テストの作成
- 午後：統合テストの実装

### 土曜日（4時間）
- 午前：パフォーマンス最適化
- 午後：デプロイ準備、Docker化

### 日曜日（4時間）
- 午前：コードレビュー、リファクタリング
- 午後：ドキュメント作成、振り返り

## 💪 爆速学習のコツ

1. **コードを書きながら学ぶ**: 読むだけでなく実装する
2. **エラーから学ぶ**: エラーメッセージを理解し解決する
3. **デバッガを使う**: console.logだけでなくデバッガを活用
4. **公式ドキュメントを読む**: 一次情報源を重視
5. **小さく始める**: 機能を小さく分割して実装
6. **毎日コミット**: 進捗を可視化
7. **質問する**: 詰まったら早めに質問

頑張ってください！必ず習得できます！🚀