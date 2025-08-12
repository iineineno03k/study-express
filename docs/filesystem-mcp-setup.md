# Claude CodeでFilesystem MCPを設定する方法

Claude Codeでfilesystem MCPを使用することで、ローカルファイルシステムへのアクセスが可能になります。この記事では、設定方法を簡潔に説明します。

## 前提条件

- Claude Codeがインストール済み
- ターミナルからclaudeコマンドが実行可能

## 設定手順

### 1. MCP追加コマンド実行

```bash
claude mcp add filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem
```

**重要なポイント:**
- `--`（ダブルダッシュ）で引数を分離する
- `--scope user`でユーザースコープに設定（全プロジェクトで利用可能）

### 2. 設定確認

```bash
claude mcp list
```

以下のような出力でfilesystemが表示されれば成功：

```
filesystem: npx -y @modelcontextprotocol/server-filesystem - ✓ Connected
```

### 3. Claude Code再起動

新しいターミナルでClaude Codeを起動：

```bash
claude
```

セッション開始後に`/mcp`コマンドを打っても確認できます。

## 利用可能な機能

filesystem MCPを追加すると、以下の操作が可能になります：

- **ファイル読み取り**: `mcp__filesystem__read_text_file`
- **ファイル書き込み**: `mcp__filesystem__write_file`
- **ディレクトリ作成**: `mcp__filesystem__create_directory`
- **ファイル検索**: `mcp__filesystem__search_files`
- **ファイル情報取得**: `mcp__filesystem__get_file_info`

## 使用例

```bash
# 設定後のClaude Codeで以下が可能
# - プロジェクト内の画像ファイルを記事に含める
# - ログファイルの内容を分析
# - 設定ファイルの自動生成
```

## トラブルシューティング

### コマンドが認識されない場合

```bash
# パスが正しく設定されているか確認
which claude

# Claude Codeを再インストール
npm install -g @anthropic/claude-code
```

### 権限エラーが発生する場合

MCPサーバーは許可されたディレクトリ内でのみ動作します。プロジェクトディレクトリ内でClaude Codeを起動してください。

## 参考

- [Claude Code公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code)
- [Model Context Protocol](https://modelcontextprotocol.io/)