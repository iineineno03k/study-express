# Express + TypeScript 学習プロジェクト

## 🎯 プロジェクト概要

このプロジェクトは、Express.js + TypeScriptを使用したバックエンド開発を1週間で習得するための学習用プロジェクトです。

### 技術スタック

- **言語**: TypeScript 5.9
- **フレームワーク**: Express 5.1
- **ORM**: Prisma
- **API仕様**: OpenAPI 3.0 + express-openapi-validator
- **ドキュメント**: Redocly
- **リンター/フォーマッター**: Biome
- **データベース**: PostgreSQL

## 📚 学習ロードマップ（1週間）

### Day 1: 環境構築と基礎理解
- [x] プロジェクトセットアップ
- [x] TypeScript設定の理解
- [x] Express基本構造の理解

**学習ポイント**:
- `tsconfig.json`の各設定項目を理解する
- ESモジュール（`type: "module"`）の動作を理解
- ミドルウェアの概念とパイプライン処理

### Day 2: API設計とOpenAPI
- [x] OpenAPI仕様書の作成
- [x] express-openapi-validatorの統合
- [x] Redoclyでのドキュメント生成

**学習ポイント**:
- RESTful API設計原則
- OpenAPIでのスキーマ定義
- 自動バリデーションの仕組み

### Day 3: データベースとORM
- [x] Prismaのセットアップ
- [x] スキーマ定義
- [ ] マイグレーション実行

**学習ポイント**:
- Prismaスキーマ言語
- リレーション定義
- 型安全なクエリ

### Day 4: CRUD実装
- [x] サービス層の実装
- [x] コントローラーの実装
- [x] ルーティング設定

**学習ポイント**:
- レイヤードアーキテクチャ
- 依存性注入
- エラーハンドリング

### Day 5: 認証・認可（次のステップ）
- [ ] JWT認証の実装
- [ ] ミドルウェアでの認可処理
- [ ] セキュリティベストプラクティス

### Day 6: テストとデバッグ
- [ ] 単体テストの作成
- [ ] 統合テストの実装
- [ ] デバッグ技術

### Day 7: デプロイと本番対応
- [ ] 環境変数管理
- [ ] ロギングとモニタリング
- [ ] パフォーマンス最適化

## 🚀 クイックスタート

### 1. 環境準備

```bash
# 依存関係のインストール
npm install

# PostgreSQLのセットアップ（Dockerを使用する場合）
docker run --name postgres-study \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=express_study_db \
  -p 5432:5432 \
  -d postgres:16

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定
```

### 2. データベースセットアップ

```bash
# Prismaクライアントの生成
npm run db:generate

# マイグレーション実行
npm run db:migrate
```

### 3. 開発サーバー起動

```bash
npm run dev
```

サーバーが起動したら以下にアクセス:
- API: http://localhost:3000/api/v1
- ヘルスチェック: http://localhost:3000/health

## 📁 プロジェクト構造

```
express_practice/
├── src/
│   ├── index.ts           # エントリーポイント
│   ├── app.ts             # Expressアプリケーション設定
│   ├── config/            # 設定ファイル
│   │   └── env.ts         # 環境変数バリデーション
│   ├── controllers/       # コントローラー層
│   │   └── userController.ts
│   ├── services/          # ビジネスロジック層
│   │   └── userService.ts
│   ├── routes/            # ルーティング定義
│   │   ├── index.ts
│   │   └── userRoutes.ts
│   ├── middleware/        # カスタムミドルウェア
│   │   ├── errorHandler.ts
│   │   ├── openApiValidator.ts
│   │   └── requestLogger.ts
│   ├── db/               # データベース関連
│   │   └── client.ts
│   └── utils/            # ユーティリティ
│       └── logger.ts
├── api/
│   └── openapi.yaml      # OpenAPI仕様書
├── prisma/
│   └── schema.prisma     # Prismaスキーマ
└── docs/                 # ドキュメント
```

## 🔧 主要コマンド

```bash
# 開発サーバー起動（ホットリロード付き）
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# リント実行
npm run lint

# フォーマット
npm run format

# Prismaコマンド
npm run db:generate  # クライアント生成
npm run db:migrate   # マイグレーション実行
```

## 🎓 学習のポイント

### 1. TypeScriptの型安全性
- Prismaが生成する型を活用
- Zodによるランタイムバリデーション
- express-openapi-validatorによる自動検証

### 2. エラーハンドリング
- カスタムエラークラス（`AppError`）
- グローバルエラーハンドラー
- 適切なHTTPステータスコード

### 3. セキュリティ
- Helmetによるセキュリティヘッダー
- CORS設定
- レート制限
- パスワードハッシュ化（bcrypt）

### 4. ベストプラクティス
- レイヤードアーキテクチャ
- 環境変数の管理
- ロギング戦略
- コード品質（Biome）

## 📝 APIテスト例

### ユーザー作成
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123",
    "bio": "Hello World"
  }'
```

### ユーザー一覧取得
```bash
curl http://localhost:3000/api/v1/users?page=1&limit=10
```

### ユーザー詳細取得
```bash
curl http://localhost:3000/api/v1/users/{userId}
```

## 🔍 トラブルシューティング

### データベース接続エラー
```bash
# PostgreSQLが起動しているか確認
docker ps

# 接続情報を確認
psql -h localhost -U user -d express_study_db
```

### TypeScriptエラー
```bash
# 型定義を再生成
npm run db:generate

# TypeScriptキャッシュをクリア
rm -rf dist/
npm run build
```

## 📚 参考資料

- [Express.js公式ドキュメント](https://expressjs.com/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [OpenAPI仕様](https://swagger.io/specification/)
- [Biome公式ドキュメント](https://biomejs.dev/)

## 🚀 次のステップ

1. **認証機能の追加**: JWT/Passportの実装
2. **テストの作成**: Jest/Vitestでのテスト
3. **リアルタイム機能**: Socket.ioの統合
4. **キャッシング**: Redis連携
5. **CI/CD**: GitHub Actions設定
6. **モニタリング**: OpenTelemetry導入

---

頑張ってください！1週間で必ずマスターできます！💪# study-express
