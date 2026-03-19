# Step 2: Claude Code のインストールと初期設定

## Claude Code のインストール

```bash
# npmでグローバルインストール
npm install -g @anthropic-ai/claude-code

# インストール確認
claude --version
```

## 初回起動

```bash
# 作業ディレクトリで起動
cd ~/your-project
claude
```

初回起動時にAnthropicアカウントでの認証が求められる。ブラウザが開くので、ログインして認証を完了する。

## 推奨設定

### settings.json

Claude Codeの設定ファイルは `~/.claude/settings.json` に作成される。

チーム開発で推奨する設定：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "effortLevel": "medium",
  "teammateMode": "auto"
}
```

| 設定 | 値 | 効果 |
|------|---|------|
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `"1"` | マルチエージェント機能を有効化 |
| `effortLevel` | `"medium"` | 応答の詳細度バランス |
| `teammateMode` | `"auto"` | サブエージェントの自動活用 |

### CLAUDE.md をプロジェクトに配置

プロジェクトのルートに `CLAUDE.md` を置く。これがClaude Codeの行動指針になる。

```bash
# プロジェクトルートに作成
touch CLAUDE.md
```

**最低限書くべき内容:**

```markdown
# プロジェクト名

## ディレクトリ構成
（src/, tests/, docs/ 等の構造を書く）

## ルール
- ファイル名はkebab-caseで統一
- テストを書いてからコミットする
- .envをgitに入れない

## 技術スタック
- フレームワーク: Next.js 14
- DB: Supabase
- 言語: TypeScript
```

**詳細は [../claude-code/claude-md-design.md](../claude-code/claude-md-design.md) を参照。**

## メモリの初期設定

Claude Codeに自分のことを覚えさせる：

```
「自分はバックエンドエンジニアで、TypeScriptとPythonを主に使う。
 テストはvitestを使う。覚えておいて。」
```

これにより、以降のセッションで最適な提案が出るようになる。

## 便利なコマンド

| コマンド | 効果 |
|---------|------|
| `/help` | ヘルプ表示 |
| `/plan` | 実装計画モードに入る |
| `/compact` | コンテキストを圧縮 |
| `/clear` | 会話をリセット |
| `/cost` | トークン使用量を確認 |

## MCP（外部ツール連携）

Notion、Google Drive等の外部ツールを接続する場合：

```bash
# Notion MCPを追加（例）
claude mcp add notion
```

追加したMCPサーバーは `~/.claude/` 配下に設定が保存される。

## 動作確認

```bash
# Claude Codeを起動して簡単なテスト
claude

# 以下を入力
「Hello! 環境が正しくセットアップされているか確認して」
```

正常に応答が返ればOK。Step 3へ。
