# Step 3: OpenClaw Gateway の導入

## OpenClawとは

Discord / LINE などのチャットチャンネルとAIエージェントを繋ぐゲートウェイ。メッセージを受信して、適切なエージェントにルーティングする。

```
Discord / LINE → OpenClaw Gateway (localhost:18790) → AIエージェント → 返信
```

## インストール

```bash
# npmでグローバルインストール
npm install -g openclaw@latest

# インストール確認
openclaw --version
```

## 初期セットアップ

### 1. オンボーディング（対話式セットアップ）

```bash
openclaw onboard --install-daemon
```

対話形式で以下が設定される：
- Anthropic APIキーの入力
- デフォルトモデルの選択
- Gatewayポートの設定
- デーモン（自動起動）のインストール

### 2. 設定ファイルの確認

セットアップ完了後、`~/.openclaw/openclaw.json` が作成される。

**主要な設定項目:**

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["anthropic/claude-haiku-4-5"]
      },
      "timeoutSeconds": 300,
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "name": "Main Agent",
        "workspace": "~/.openclaw/workspaces/main",
        "skills": [],
        "sandbox": { "mode": "off" },
        "tools": { "allow": ["*"] }
      }
    ]
  },
  "gateway": {
    "port": 18790,
    "mode": "local"
  },
  "session": {
    "reset": { "mode": "daily", "atHour": 6 },
    "maintenance": { "pruneDays": 7 }
  }
}
```

**注意: このファイルはOpenClaw CLIが管理する。手動編集は非推奨。**

### 3. 環境変数の設定

```bash
# ~/.openclaw/project/config/.env を作成
cp ~/.openclaw/project/config/.env.example ~/.openclaw/project/config/.env
```

**必須の環境変数:**

| 変数名 | 説明 | 取得元 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | Claude APIキー | Anthropic Console |
| `DISCORD_BOT_TOKEN` | Discord Botトークン | Discord Developer Portal |
| `OPENCLAW_PORT` | Gatewayポート（デフォルト: 18790） | 任意 |

**任意の環境変数:**

| 変数名 | 説明 |
|--------|------|
| `SUPABASE_URL` | Supabase プロジェクトURL |
| `SUPABASE_ANON_KEY` | Supabase匿名キー |
| `NOTION_API_TOKEN` | Notion APIトークン |

## Gateway の起動

```bash
# 起動
openclaw gateway --port 18790

# または npm script
cd ~/.openclaw && npm run start
```

## Gateway の確認

```bash
# ポートが開いているか確認
lsof -i :18790

# ヘルスチェック
curl http://localhost:18790/health
```

## エージェントの追加

### 方法1: CLIで追加

```bash
openclaw agents add --id my-agent --name "My Agent"
```

### 方法2: openclaw.json の agents.list に追加（CLI経由推奨）

エージェントに必要な項目：
- `id`: 一意の識別子（kebab-case）
- `name`: 表示名
- `workspace`: 作業ディレクトリ
- `model.primary`: 使用するLLMモデル
- `skills`: 使用可能なスキル一覧
- `sandbox.mode`: `"off"` でフルアクセス

### モデル選定ガイド

| 用途 | 推奨モデル | 理由 |
|------|-----------|------|
| 戦略判断・重要な意思決定 | claude-opus-4-6 | 最高精度（コスト高） |
| タスク分解・コード生成 | claude-sonnet-4-5 | バランス |
| 大量の定型処理 | claude-haiku-4-5 | 高速・低コスト |

## スキルの追加

```bash
# スキルディレクトリに SKILL.md を置くと自動検出される
mkdir -p ~/.openclaw/skills/my-skill
# SKILL.md を作成（詳細は skills/creating-custom-skills.md 参照）
```

## 自動起動の設定（macOS）

```bash
# LaunchAgent として登録（macOS再起動後も自動起動）
openclaw onboard --install-daemon
```

これにより、macOS起動時にGatewayが自動的に立ち上がる。クラッシュ時も10秒後に自動復帰。

## ディレクトリ構成

```
~/.openclaw/
├── openclaw.json          ← メイン設定（CLI管理）
├── agents/                ← エージェント定義
├── skills/                ← スキル定義（自動検出）
├── workspaces/            ← エージェント作業ディレクトリ
├── cron/                  ← Cronジョブ定義
├── logs/                  ← ランタイムログ
└── workspace/
    └── output/            ← 成果物の保存先
```
