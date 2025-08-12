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

### 🐳 Docker環境での開発（推奨）

```bash
# リポジトリのクローン
git clone <repository-url>
cd express_practice

# 環境変数ファイルを設定
cp .env.example .env

# Docker Composeで開発環境を起動
npm run docker:dev

# サービスの状態確認
docker-compose ps

# ログの確認
npm run docker:logs
```

起動後、以下のサービスが利用可能:
- **API サーバー**: http://localhost:3000
- **API ドキュメント**: http://localhost:3000/api-docs
- **pgAdmin**: http://localhost:8080 (admin@example.com / admin)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 🖥️ ローカル環境での開発

```bash
# 依存関係のインストール
npm install

# PostgreSQLのセットアップ（Dockerを使用する場合）
docker run --name postgres-study \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=express_study \
  -p 5432:5432 \
  -d postgres:16

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してデータベース接続情報を設定

# Prismaクライアントの生成
npm run db:generate

# マイグレーション実行
npm run db:migrate

# 開発サーバー起動
npm run dev
```

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

### 📦 開発コマンド
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
```

### 🗄️ データベース操作
```bash
# Prismaクライアント生成
npm run db:generate

# マイグレーション実行
npm run db:migrate

# シードデータ投入
npm run db:seed
```

### 📚 ドキュメント生成
```bash
# OpenAPI仕様書の検証
npm run docs:lint

# HTMLドキュメント生成
npm run docs:build

# プレビューサーバー起動
npm run docs:serve

# 仕様書のバンドル
npm run docs:bundle
```

### 🐳 Docker操作
```bash
# Dockerイメージをビルド
npm run docker:build

# 開発環境をDocker Composeで起動
npm run docker:dev

# 本番環境をDocker Composeで起動
npm run docker:prod

# Docker Composeを停止
npm run docker:down

# ログを表示
npm run docker:logs

# 全てのコンテナとボリュームを削除
npm run docker:clean
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

### Docker環境のトラブル
```bash
# サービスの状態確認
docker-compose ps

# 特定のサービスのログ確認
docker-compose logs app
docker-compose logs db

# コンテナを再起動
docker-compose restart app

# 全体をクリーンアップして再起動
npm run docker:clean
npm run docker:dev
```

### データベース接続エラー
```bash
# PostgreSQLコンテナが起動しているか確認
docker-compose ps db

# データベースに直接接続
docker-compose exec db psql -U postgres -d express_study

# pgAdminからの接続確認
# http://localhost:8080 にアクセス
# Host: db, Username: postgres, Password: postgres
```

### TypeScriptエラー
```bash
# 型定義を再生成
npm run db:generate

# TypeScriptキャッシュをクリア
rm -rf dist/
npm run build

# Dockerコンテナ内で実行する場合
docker-compose exec app npm run db:generate
```

### ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :5432
lsof -i :8080

# docker-compose.ymlでポート番号を変更
# ports:
#   - '3001:3000'  # ローカル:コンテナ
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
4. **キャッシング**: Redis連携（すでにdocker-compose.ymlに含まれています）
5. **CI/CD**: GitHub Actions設定
6. **モニタリング**: OpenTelemetry導入
7. **本番デプロイ**: AWS/GCP/Azureへのデプロイ

## 🐳 Docker環境の詳細

### コンテナ構成
- **app**: Express.jsアプリケーション
- **db**: PostgreSQL 16データベース
- **redis**: Redis 7キャッシュサーバー
- **pgadmin**: データベース管理ツール

### 開発vs本番環境
```bash
# 開発環境（ホットリロード、デバッグログ有効）
npm run docker:dev

# 本番環境（最適化、ログ制限）
npm run docker:prod
```

### データ永続化
Dockerボリュームで以下のデータが永続化されます:
- PostgreSQLデータ
- Redisデータ
- pgAdminの設定

---

頑張ってください！Docker環境で効率的に学習を進めましょう！💪🐳
