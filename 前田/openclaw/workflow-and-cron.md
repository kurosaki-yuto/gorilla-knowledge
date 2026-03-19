# ワークフロー & Cronジョブの設計

## ワークフローとは

定型業務をMarkdownで定義し、Cronで定期実行する仕組み。

## ワークフロー一覧（実運用例）

| ワークフロー | 実行タイミング | 担当 | 内容 |
|-------------|---------------|------|------|
| morning-briefing | 毎日 7:00 AM | Jarvis | カレンダー確認 → タスク抽出 → Discordにブリーフィング投稿 |
| email-triage | 30分ごと | Jarvis | 未読メール分類（URGENT→スター+通知、NEWSLETTER→アーカイブ等） |
| weekly-report | 月曜 10:00 AM | Writer | 週次サマリー生成 → Notion保存 → Discord通知 |
| agent-handoff | 随時 | Dynamic | エージェント間のタスク委譲プロトコル |

## ワークフローの登録方法

```bash
# ワークフローファイルを作成
# workflows/my-workflow.md

# Cronに登録
openclaw cron add --cron "0 9 * * *" --message-file workflows/my-workflow.md
```

## Cronジョブの設計

### 現在のアクティブジョブ

| ジョブ名 | エージェント | スケジュール | 内容 |
|---------|------------|-------------|------|
| health-check | Marcus | 毎日 3:00 AM | Gateway/Supabase/Discord のヘルスチェック |
| weekly-report | Kevin | 月曜 10:00 AM | 週次活動レポート |
| notion-sync | Kevin | 毎日 1:00 PM | Supabase → Notion の同期 |

### Cronの実行フロー

```
スケジュール時刻到達（Asia/Tokyoタイムゾーン）
    ↓
隔離されたセッションをスポーン
    ↓
指定エージェントにメッセージ配信
    ↓
実行結果を記録（state: nextRunAtMs, lastRunStatus, consecutiveErrors）
    ↓
セッション終了
```

## 運用ルール

- **Cronは5個以下**（承認なし）。それ以上は人間の承認必要
- 既存Cronで代替できないか確認してから追加する
- `cron/jobs.json` は直接編集しない（OpenClaw CLIが管理）

## email-triageの自動分類ルール（実装例）

```
URGENT（緊急）  → スター付け + Discord通知
NEWSLETTER      → 自動アーカイブ
RECEIPT（領収書）→ ラベル付け + アーカイブ
SPAM            → ログ記録のみ
OTHER           → 何もしない
```

分類結果をメモリに保存して、次回以降の分類精度を上げる学習機能付き。

## 教訓

- **Cronの肥大化に注意**。最初は「あれもこれも」で追加するが、5個を超えると管理が大変
- **タイムゾーン**: Cron式はローカルタイム（JST）で書く。UTC換算を忘れると9時間ズレる
- **エラーの蓄積**: `consecutiveErrors` を監視して、3回以上連続失敗したらアラートを出す
- **セッション隔離**: Cronが別セッションで動くため、前回の会話コンテキストは引き継がれない。必要な情報はファイルで受け渡す
