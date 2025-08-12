# 🚀 Redocly + OpenAPI完全ガイド - 美しいAPIドキュメントを自動生成する方法

## はじめに

APIドキュメントって、書くのも管理するのも面倒ですよね？特に仕様変更のたびに手動で更新するのは本当に大変です。

そんな悩みを解決してくれるのが**Redocly**です。OpenAPI仕様書から美しいAPIドキュメントを自動生成し、開発チームの生産性を大幅に向上させてくれます。

本記事では、Express + TypeScriptプロジェクトでRedoclyを導入し、プロフェッショナルなAPIドキュメントを作成する方法を実際のスクリーンショット付きで解説します。

## 📋 この記事で学べること

- Redoclyの基本概念と利点
- Express + TypeScriptプロジェクトでの導入方法
- OpenAPI仕様書の書き方とベストプラクティス
- 美しいAPIドキュメントの自動生成
- 開発ワークフローへの統合方法

## 🎯 Redoclyとは？

**Redocly**は、OpenAPI仕様書から美しく読みやすいAPIドキュメントを生成するツールです。

### 主な特徴

- 📖 **美しいUI**: モダンで直感的なインターフェース
- 🔧 **自動生成**: OpenAPI仕様書から自動でドキュメント作成
- 🎨 **カスタマイズ可能**: テーマやブランディングに対応
- 📱 **レスポンシブ**: モバイル・デスクトップ両対応
- 🔍 **検索機能**: APIエンドポイントの高速検索
- 📝 **コードサンプル**: 複数言語のサンプルコード自動生成

## 🚀 プロジェクトセットアップ

### 依存関係のインストール

```bash
# 本番依存関係
npm install express dotenv cors helmet morgan compression express-rate-limit

# 開発依存関係
npm install -D typescript @types/node @types/express @types/cors @types/morgan 
npm install -D tsx @biomejs/biome prisma @prisma/client 
npm install -D express-openapi-validator @redocly/cli
```

### package.jsonのスクリプト設定

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "biome check --write .",
    "docs:lint": "redocly lint main@v2",
    "docs:build": "redocly build-docs main@v2 --output docs/redoc-static.html",
    "docs:serve": "npm run docs:build && npx http-server docs -p 8080 -o redoc-static.html",
    "docs:bundle": "redocly bundle main@v2 --output docs/openapi-bundle.yaml"
  }
}
```

## 📝 OpenAPI仕様書の作成

APIの仕様を定義するOpenAPI仕様書を作成します。

```yaml
# api/openapi.yaml
openapi: 3.0.3
info:
  title: Express TypeScript Study API
  description: |
    # Express + TypeScript学習用API
    
    このAPIは、Express.js + TypeScriptでのバックエンド開発を学習するためのサンプルAPIです。
    
    ## 主な機能
    - ユーザー管理 (CRUD)
    - 投稿管理 (CRUD)  
    - 認証・認可
    - バリデーション
    
    ## 認証方法
    現在は認証なしでアクセス可能ですが、将来的にJWT認証を実装予定です。
    
    ## レート制限
    - 15分間に100リクエストまで
    - 制限を超えると429エラーを返します
    
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com
    url: https://github.com/your-repo
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/api/v1
    description: Development server

tags:
  - name: Users
    description: ユーザー管理API
  - name: Posts
    description: 投稿管理API

paths:
  /users:
    get:
      tags:
        - Users
      summary: ユーザー一覧取得
      description: 登録されているユーザーの一覧を取得します
      operationId: getUsers
      parameters:
        - name: page
          in: query
          description: ページ番号
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          description: 1ページあたりの件数
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 10
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '400':
          $ref: '#/components/responses/BadRequest'
        '500':
          $ref: '#/components/responses/InternalServerError'

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          format: uuid
          description: ユーザーID
        email:
          type: string
          format: email
          description: メールアドレス
        name:
          type: string
          description: ユーザー名
          minLength: 1
          maxLength: 100
        bio:
          type: string
          description: 自己紹介
          maxLength: 500
        createdAt:
          type: string
          format: date-time
          description: 作成日時
        updatedAt:
          type: string
          format: date-time
          description: 更新日時
          
    Pagination:
      type: object
      required:
        - page
        - limit
        - total
        - totalPages
      properties:
        page:
          type: integer
          description: 現在のページ
        limit:
          type: integer
          description: 1ページあたりの件数
        total:
          type: integer
          description: 総件数
        totalPages:
          type: integer
          description: 総ページ数
```

## ⚙️ Redocly設定ファイル

```yaml
# redocly.yaml
extends:
  - recommended

apis:
  main@v2:
    root: api/openapi.yaml
    rules:
      # 必須ルール (エラーレベル)
      operation-operationId: error
      operation-summary: error
      no-unused-components: error
      
      # 推奨ルール (警告レベル)  
      tag-description: warn
      operation-description: warn
      operation-2xx-response: warn
      
      # カスタムルール
      path-params-defined: error
      no-ambiguous-paths: error
      
      # 学習用プロジェクトなので一部ルールを緩和
      security-defined: off  # セキュリティ未実装なのでOFF
      no-server-example.com: off  # localhostサーバーを許可
      operation-4xx-response: warn  # 4xxレスポンスは警告レベル

# OpenAPI ドキュメント設定
openapi:
  generateCodeSamples:
    languages:
      - lang: curl
      - lang: JavaScript  
      - lang: Python
  hideLogo: false
  hideDownloadButton: false
```

## 🚀 Redoclyコマンドの使い方

### 1. 仕様書の検証
```bash
npm run docs:lint
```

OpenAPI仕様書の構文チェックとルール違反を検出します。

```
✅ 成功時の出力例
Woohoo! Your API description is valid. 🎉
You have 1 warning.
```

### 2. ドキュメントの生成
```bash
npm run docs:build
```

静的HTMLファイルを生成します（122KB程度）。

### 3. プレビューサーバーの起動
```bash
npm run docs:serve
```

http://localhost:8080 でプレビューを確認できます。

### 4. 仕様書のバンドル
```bash
npm run docs:bundle
```

複数ファイルを1つのYAMLにまとめます。

## 📸 実際のRedoclyドキュメント

### メイン画面
![Redocly Overview](./images/redocly-overview.png)

- **左サイドバー**: API概要とナビゲーション
- **中央エリア**: 詳細なAPI仕様と説明
- **検索機能**: エンドポイントの高速検索
- **ダウンロード**: OpenAPI仕様書のダウンロード

### PostsAPI詳細画面
![Redocly Posts API](./images/redocly-posts-api.png)

- **HTTPメソッド**: GET、POST、PUT、DELETEが色分け表示
- **パラメータ**: クエリ・パス・ボディパラメータを詳細表示
- **レスポンス**: ステータスコードごとのサンプル
- **コードサンプル**: cURL、JavaScript、Pythonのサンプル自動生成
- **スキーマ**: データ型と制約の詳細表示

美しく整理されたAPIドキュメントが生成され、開発者にとって非常に使いやすいインターフェースが提供されます。左側のナビゲーションでAPI操作を素早く見つけることができ、右側ではリクエスト・レスポンスの詳細な情報が確認できます。

## 🔧 Express.jsとの統合

### APIサーバー内でドキュメント提供

```typescript
// src/middleware/apiDocs.ts
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const redocTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <title>Express TypeScript Study API - Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <redoc spec-url="./openapi.yaml"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>
`

export const setupApiDocs = (app: express.Express) => {
  // OpenAPI仕様書を提供
  app.get('/openapi.yaml', async (_req, res) => {
    try {
      const yamlPath = path.join(__dirname, '../../api/openapi.yaml')
      const yamlContent = await fs.readFile(yamlPath, 'utf-8')
      res.setHeader('Content-Type', 'application/x-yaml')
      res.send(yamlContent)
    } catch (error) {
      res.status(404).json({ error: 'OpenAPI specification not found' })
    }
  })

  // Redocドキュメントページを提供
  app.get('/api-docs', (_req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(redocTemplate)
  })
}
```

### Express.jsアプリケーションに統合

```typescript
// src/app.ts
import { setupApiDocs } from './middleware/apiDocs.js'

export const createApp = (): Express => {
  const app = express()
  
  // その他のミドルウェア設定...
  
  // APIドキュメント設定
  setupApiDocs(app)
  
  return app
}
```

これで以下のエンドポイントでドキュメントにアクセスできます：

- **Redocドキュメント**: http://localhost:3000/api-docs
- **OpenAPI仕様書**: http://localhost:3000/openapi.yaml

## 💡 開発ワークフローへの統合

### CI/CDでの活用

```yaml
# .github/workflows/api-docs.yml
name: API Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-api-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint OpenAPI specification
        run: npm run docs:lint
        
      - name: Build documentation
        run: npm run docs:build
        
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

### Pre-commitフックでの品質管理

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run docs:lint
npm run lint
npm run build
```

## 🎨 カスタマイズとテーマ

### カスタムCSSの適用

```css
/* docs/custom-theme.css */
:root {
  --main-color: #2563eb;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --background-color: #f8fafc;
}

.redoc-wrap .api-info h1 {
  color: var(--main-color);
  font-size: 2.5rem;
  font-weight: 700;
}

.redoc-wrap .menu-content {
  background-color: var(--background-color);
  border-right: 1px solid #e2e8f0;
}

/* HTTPメソッドの色分け */
.redoc-wrap .http-verb.get { background-color: #10b981; }
.redoc-wrap .http-verb.post { background-color: #2563eb; }
.redoc-wrap .http-verb.put { background-color: #f59e0b; }
.redoc-wrap .http-verb.delete { background-color: #ef4444; }
```

### ビルド時の設定

```bash
redocly build-docs main@v2 \
  --output docs/api-docs.html \
  --theme.openapi.hideDownloadButton \
  --theme.openapi.nativeScrollbars
```

## 📊 Redoclyの利点とメリット

### 🚀 開発チームの生産性向上

- **自動生成**: 手動ドキュメント作成の時間を削減
- **一元管理**: 仕様書とドキュメントの同期が自動化
- **品質保証**: リンターによる仕様書の品質管理
- **検索性**: 大規模APIでも素早く目的のエンドポイントを発見

### 👥 チーム連携の改善

- **フロントエンド開発**: APIの仕様が明確で実装しやすい
- **QAテスト**: テストケース作成の参考になる
- **営業・サポート**: 顧客向け資料として活用可能
- **新メンバー**: オンボーディングが効率化

### 🏢 ビジネス価値の創出

- **顧客満足度**: 分かりやすいAPIドキュメントで開発者体験向上
- **保守性**: 仕様変更時のドキュメント更新漏れを防止
- **標準化**: チーム全体でAPI設計のベストプラクティスを共有

## 🔧 トラブルシューティング

### よくあるエラーと解決方法

#### 1. Node.jsバージョンエラー
```bash
⚠️ Warning: failed to satisfy expected node version. 
Expected: ">=22.12.0 || >=20.19.0 <21.0.0", Current "v22.3.0"
```

**解決方法**: Voltaでバージョン管理
```bash
# Voltaのインストール
curl https://get.volta.sh | bash

# 適切なNode.jsバージョンのインストール
volta install node@22.12.0
volta pin node@22.12.0
```

#### 2. OpenAPI仕様書のエラー
```bash
❌ Validation failed with 7 errors and 2 warnings.
```

**解決方法**: エラー内容を確認して修正
```bash
npm run docs:lint --generate-ignore-file
```

#### 3. プレビューサーバーのエラー
```bash
Error [ERR_REQUIRE_ESM]: require() of ES Module
```

**解決方法**: 代替手段を使用
```bash
npm run docs:build && npx http-server docs -p 8080 -o redoc-static.html
```

## 📚 参考資料とリンク

- [Redocly公式ドキュメント](https://redocly.com/docs/cli/)
- [OpenAPI仕様書](https://swagger.io/specification/)
- [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator)
- [サンプルプロジェクト](https://github.com/your-repo/express-typescript-study)

## 🎯 まとめ

Redoclyを使用することで、OpenAPI仕様書から美しく実用的なAPIドキュメントを自動生成できます。

### 主な効果

- ✅ **開発効率の向上**: ドキュメント作成・管理時間を90%削減
- ✅ **品質の向上**: リンターによる仕様書の品質保証
- ✅ **チーム連携**: フロントエンド・QA・営業との連携強化
- ✅ **開発者体験**: 美しく検索しやすいドキュメント

### 導入のポイント

1. **段階的導入**: 既存プロジェクトでも少しずつ導入可能
2. **ツール統合**: CI/CD、pre-commitフックとの連携
3. **カスタマイズ**: チームやプロダクトに合わせたテーマ設定

APIドキュメントの課題を抱えているチームは、ぜひRedoclyの導入を検討してみてください！

---

この記事が役に立ったら、いいね👍やコメント💬をお願いします！
質問があれば気軽にコメントしてください 🙋‍♂️