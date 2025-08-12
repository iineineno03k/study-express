# CLAUDE.md

このファイルは、このリポジトリで作業する際のClaude Code (claude.ai/code) 向けガイダンスです。

## コマンド

### 必須開発コマンド
```bash
# ホットリロード付き開発サーバー起動
npm run dev

# 型チェック
npm run typecheck

# 本番用ビルド
npm run build

# テスト実行
npm test

# 特定のテストファイル実行
npm test -- --testPathPatterns=health.test.ts

# リント・フォーマット
npm run lint
npm run format
```

### データベース操作
```bash
# Prismaクライアント生成
npm run db:generate

# データベースマイグレーション実行
npm run db:migrate

# サンプルデータ投入
npm run db:seed
```

### Docker環境
```bash
# 開発環境起動
npm run docker:dev

# 停止・クリーンアップ
npm run docker:down

# ログ確認
npm run docker:logs
```

### APIドキュメント
```bash
# OpenAPI仕様検証
npm run docs:lint

# 静的HTMLドキュメント生成
npm run docs:build

# OpenAPI仕様バンドル
npm run docs:bundle
```

## アーキテクチャ概要

### モジュールシステム
- **ESMのみ**: package.jsonで`"type": "module"`を使用
- **ファイル拡張子**: 全てのimportで`.js`拡張子必須（TypeScriptが`.ts` → `.js`にコンパイル）
- **パスマッピング**: TypeScriptパス設定でクリーンなimport（@/, @config/等）

### アプリケーション構造
- **エントリーポイント**: `src/index.ts` - グレースフルシャットダウン付きサーバー設定
- **サーバー作成**: `src/server.ts` - @godaddy/terminusによるヘルスチェック統合
- **アプリ設定**: `src/app.ts` - Expressミドルウェア・ルーティング設定
- **レイヤードアーキテクチャ**: コントローラー → サービス → データベース（Prisma）

### ヘルスチェック実装
- **ライブラリ**: 本番対応の@godaddy/terminusを使用
- **エンドポイント**: `/health`, `/health/ready`, `/health/live`
- **レスポンス形式**: Terminusが`{status, info, details}`構造でレスポンスをラップ
- **データベースチェック**: Prisma接続検証を含む

### OpenAPI統合
- **バリデーター**: express-openapi-validatorによる自動リクエスト/レスポンス検証
- **ミドルウェア順序重要**: ヘルスチェックルートをOpenAPIバリデーターより先に登録必須
- **仕様ファイル場所**: `api/openapi.yaml` - 完全なAPIドキュメント

### テスト設定
- **フレームワーク**: 実験的VMモジュール経由のJest ESMサポート
- **設定**: ESMプリセット付き`jest.config.mjs`
- **環境**: `tests/env.setup.js`でテスト専用環境変数
- **テストパターン**: 常に200ステータスコードをテスト；詳細アサーションは任意

### データベース（Prisma）
- **クライアント**: `src/db/client.ts`でシングルトンパターン
- **スキーマ**: `prisma/schema.prisma`でモデル・リレーション定義
- **生成**: スキーマ変更後は必ず`npm run db:generate`実行

### 環境設定
- **検証**: `src/config/env.ts`のZodスキーマで全環境変数を検証
- **Docker**: PostgreSQL、Redis、pgAdmin含む完全開発環境

### エラーハンドリング
- **グローバルハンドラー**: `src/middleware/errorHandler.ts`で全アプリケーションエラーをキャッチ
- **型安全性**: 全エラーハンドリングでunknownエラー用の適切な型ガード
- **グレースフルシャットダウン**: TerminusがSIGTERM/SIGINTをクリーンアップタスク付きで処理

### セキュリティ・ミドルウェア
- **Helmet**: セキュリティヘッダー
- **CORS**: 環境から設定可能なオリジン
- **レート制限**: 環境変数で設定可能
- **リクエストログ**: カスタム形式のMorganベースログ

## 重要な注意事項

### TypeScript設定
- 適切なESMサポートのため`NodeNext`モジュール解決を使用
- 追加コンパイラーチェック付きストリクトモード有効
- クリーンなimport用パスエイリアス設定

### テスト考慮事項
- テスト環境でのデータベース接続エラーは想定内
- Terminusヘルスチェックは手動実装とは異なるレスポンス構造を返す
- 統合テストには`createServer()`、単体テストには`createApp()`を使用

### Docker開発
- 推奨開発アプローチ
- データベース・管理ツール含む完全スタック
- データのボリューム永続化
- 開発コンテナでホットリロード有効

### コード品質
- リント・フォーマットにBiome使用（ESLint/Prettierの代替）
- 厳格なTypeScriptルールで事前設定
- 保存時自動フォーマット推奨