-- データベース初期化スクリプト
-- PostgreSQL用の初期設定

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 開発用のサンプルデータ（必要に応じて）
-- 本番環境では削除すること

-- ログ出力
\echo 'Database initialization completed successfully!';