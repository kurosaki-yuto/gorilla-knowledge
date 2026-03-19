# 前田のナレッジベース

AIエージェントシステム（OpenClaw + OpenGoat）の構築・運用で得た知見をまとめています。

---

## 目次

### 失敗から学んだこと (`failures/`)

| ファイル | 内容 |
|---------|------|
| [notion-integration.md](failures/notion-integration.md) | Notion API連携で全DBが404になった話 |
| [discord-bot-silent.md](failures/discord-bot-silent.md) | Discord Botがメッセージを受信できなかった原因 |
| [context-window-explosion.md](failures/context-window-explosion.md) | コンテキストウィンドウを起動時に8.7%消費していた問題 |
| [tool-fallback-patterns.md](failures/tool-fallback-patterns.md) | ツール実行時のエラーパターンと対処法 |
| [cron-script-missing.md](failures/cron-script-missing.md) | Cronジョブが参照先スクリプト不在で無限エラーを吐いた話 |
| [gateway-false-alerts.md](failures/gateway-false-alerts.md) | Gatewayが毎分偽アラートを出し続けた問題 |

### エージェント構築ノウハウ (`howto/`)

| ファイル | 内容 |
|---------|------|
| [multi-agent-architecture.md](howto/multi-agent-architecture.md) | マルチエージェントシステムの設計パターン |
| [agent-skill-expansion.md](howto/agent-skill-expansion.md) | エージェント・スキルの追加手順チェックリスト |
| [error-escalation-design.md](howto/error-escalation-design.md) | 3段階エラーエスカレーション設計 |
| [autonomous-pipeline.md](howto/autonomous-pipeline.md) | 自律実行パイプラインの作り方 |

### MissionControl — 監視ダッシュボード (`mission-control/`)

| ファイル | 内容 |
|---------|------|
| [overview.md](mission-control/overview.md) | TenacitOS活用の全体像・セットアップ手順 |
| [admin-dashboard.md](mission-control/admin-dashboard.md) | React + Supabaseで管理ダッシュボードを作った話 |

### OpenGoat — オーケストレーション層 (`opengoat/`)

| ファイル | 内容 |
|---------|------|
| [orchestration-model.md](opengoat/orchestration-model.md) | CEO/CoS/Ops Monitorの3層モデルと信頼度ベース実行 |
| [agent-communication.md](opengoat/agent-communication.md) | エージェント間コミュニケーション設計（チャンネル設計・水平連携） |
| [ops-monitor-design.md](opengoat/ops-monitor-design.md) | 監視エージェントの設計（沈黙=正常の原則） |

### OpenClaw — Gateway活用ノウハウ (`openclaw/`)

| ファイル | 内容 |
|---------|------|
| [gateway-basics.md](openclaw/gateway-basics.md) | OpenClaw Gatewayの基本構成と使い方 |
| [skill-system.md](openclaw/skill-system.md) | スキルシステムの設計と作り方 |
| [workflow-and-cron.md](openclaw/workflow-and-cron.md) | ワークフロー自動化とCronジョブの設計 |
| [deliverable-management.md](openclaw/deliverable-management.md) | 成果物管理の3ステップフロー |

### 運用Tips (`tips/`)

| ファイル | 内容 |
|---------|------|
| [browser-automation.md](tips/browser-automation.md) | ブラウザ自動化で詰まるポイントと対処法 |
| [discord-channel-routing.md](tips/discord-channel-routing.md) | Discordチャンネルルーティングの設計パターン |
| [memory-management.md](tips/memory-management.md) | AIエージェントのメモリ管理ベストプラクティス |

### アーキテクチャ知見 (`architecture/`)

| ファイル | 内容 |
|---------|------|
| [five-layer-design.md](architecture/five-layer-design.md) | 5層アーキテクチャ（入口→統括→実行→DB→UI）|
| [supabase-as-source-of-truth.md](architecture/supabase-as-source-of-truth.md) | 正本DBの設計思想と失敗から学んだこと |

---

## 背景

Claude Code + OpenClaw（AIエージェントGateway）+ OpenGoat（オーケストレーション層）を使って、複数のAIエージェントが自律的に動くシステムを構築・運用してきました。

**技術スタック**: Claude API / OpenClaw / Discord.js / Supabase / Notion API / Node.js / React / Vercel

**システム全体像**:
```
ユーザー（Discord / LINE）
    ↓
OpenClaw Gateway（ルーティング）
    ↓
OpenGoat（CEO → CoS → Ops Monitor）
    ↓
実行エージェント群（コンテンツ / リサーチ / セールス）
    ↓
Supabase（正本DB）→ Notion（管理UI）→ Discord（通知）
```
