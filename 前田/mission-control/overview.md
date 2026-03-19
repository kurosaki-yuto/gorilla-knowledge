# MissionControl（TenacitOS）— AIエージェント監視ダッシュボード

## 何を解決するか

AIエージェントシステムを運用すると、以下が見えなくなる：

- エージェントが今何をしているか
- トークン（API利用料）がいくらかかっているか
- Cronジョブが実行されているか
- エージェントが何を記憶しているか
- ワークスペースのファイルが散らかっていないか

Discordのログを遡って確認する運用は限界がある。**一画面で全体を把握できるダッシュボード** が必要。

## MissionControlの機能一覧

| 画面 | 何が見えるか |
|------|-------------|
| System Monitor | CPU / RAM / ディスク / ネットワーク使用率 |
| Live Logs | サービスログのリアルタイム表示（色分け付き） |
| Terminal | ブラウザからシェルコマンド実行 |
| Git | リポジトリ状態・コミット履歴 |
| Workflows | ワークフローの実行・管理 |
| Activity Heatmap | GitHub風の活動カレンダー |
| Memory Browser | エージェントのメモリファイルを閲覧・検索 |
| File Browser | ワークスペースファイルの操作 |
| Calendar | Cronジョブのスケジュール表示 |
| Costs & Analytics | トークンコスト追跡・日次推移・モデル別内訳 |
| Sessions | 過去の会話ログ閲覧 |

## 技術スタック

- **ベース**: [TenacitOS](https://github.com/carlosazaustre/tenacitOS)（OSSの監視ダッシュボード）
- **フレームワーク**: Next.js
- **ポート**: localhost:3000
- **データソース**: openclaw.json、メモリファイル、ワークスペースファイルを直接読み取り

## セットアップ手順

```bash
# 1. クローン
cd ~/AI
git clone https://github.com/carlosazaustre/tenacitOS.git mission-control

# 2. 依存関係インストール
cd mission-control && npm install

# 3. 認証シークレット生成
AUTH_SECRET=$(openssl rand -base64 32)

# 4. 環境変数設定（.env.local）
cat > .env.local << EOF
OPENCLAW_DIR=$HOME/.openclaw
OPENCLAW_WORKSPACE=$HOME/.openclaw/workspace
NEXT_PUBLIC_AGENT_NAME=OpenGoat
NEXT_PUBLIC_AGENT_EMOJI=🐐
AUTH_SECRET=$AUTH_SECRET
EOF

# 5. 起動
npm run dev
# → http://localhost:3000
```

## システム全体の配置

```
OpenClaw Gateway (localhost:18790)
  └─ Discord/LINEからのメッセージ受信 → エージェントにルーティング

MissionControl (localhost:3000)
  └─ openclaw.json / メモリ / ワークスペースを読み取り → 可視化

Supabase (クラウド)
  └─ ジョブ / エージェント状態 / アラートの永続化
```

## 自前で作る場合との比較

| 項目 | TenacitOS | 自作 |
|------|-----------|------|
| OpenClaw専用設計 | ○ | ○ |
| エージェント自動検出 | ○ | △（実装必要） |
| トークンコスト追跡 | ○ | △ |
| Cron可視化 | ○ | △ |
| セットアップ時間 | 30分 | 数週間 |

## 教訓

- **可観測性は後付けでは遅い**。エージェントが増えるほど「何が起きているか分からない」状態になる
- **Discordログの遡り** は運用として破綻する。検索性が低すぎる
- **コスト追跡** がないと、Opusモデルの使いすぎに気づかない
- **メモリの可視化** がないと、エージェントが何を記憶しているか把握できない
