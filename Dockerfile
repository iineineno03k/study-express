# Node.js 22.12.0を使用（Voltaで指定されたバージョン）
FROM node:22.12.0-alpine

# アプリケーションディレクトリを作成
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー（キャッシュ効率化）
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# アプリケーションのソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# 非特権ユーザーを作成・使用（セキュリティ）
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001
USER appuser

# ポート3000を公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]