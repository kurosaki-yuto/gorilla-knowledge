# Step 4: Paperclip（タスク管理）の導入

## Paperclipとは

AIエージェント組織のタスク管理プラットフォーム。エージェントの割り当て、イシュー管理、プロジェクト進捗をWebダッシュボードで管理する。

```
Paperclip Dashboard (localhost:2099)
    ├── 会社（Company）の管理
    ├── エージェント一覧・状態管理
    ├── イシュー（タスク）の作成・追跡
    └── プロジェクト管理
```

## インストール

```bash
# npmでインストール（詳細はチームリーダーに確認）
npm install -g paperclip@latest

# インストール確認
paperclip --version
```

## 初期セットアップ

### 1. Paperclipの起動

```bash
paperclip start
# → http://localhost:2099 でダッシュボードが開く
```

### 2. 会社（Company）の作成

ダッシュボードで新しいCompanyを作成するか、既存のCompanyに招待してもらう。

Company作成時に **Company ID** が発行される（UUID形式）。この ID は API 呼び出しに必要。

### 3. エージェントの登録

Paperclipダッシュボードからエージェントを登録する。OpenClawのエージェントと1:1で対応させる。

## OpenClawとの連携

### Paperclipスキルの有効化

OpenClawにPaperclip連携スキルを追加することで、エージェントがPaperclipのイシューを自動管理できるようになる。

**主要なAPI:**

| 操作 | エンドポイント | メソッド |
|------|---------------|---------|
| 会社情報取得 | `/api/companies/{companyId}` | GET |
| エージェント一覧 | `/api/companies/{companyId}/agents` | GET |
| イシュー一覧 | `/api/companies/{companyId}/issues` | GET |
| イシュー作成 | `/api/companies/{companyId}/issues` | POST |
| イシュー更新 | `/api/companies/{companyId}/issues/{issueId}` | PATCH |
| プロジェクト一覧 | `/api/companies/{companyId}/projects` | GET |

### 連携の設定

```bash
# OpenClaw の models providers に Paperclip を追加
# openclaw.json の models.providers セクションに設定
```

```json
{
  "models": {
    "providers": {
      "manifest": {
        "baseUrl": "http://127.0.0.1:2099/v1",
        "api": "openai-completions"
      }
    }
  }
}
```

## 日常の使い方

### イシューの作成

```
ダッシュボード → Issues → New Issue
  - タイトル: タスク名
  - 担当エージェント: 割り当てるエージェント
  - 優先度: High / Medium / Low
  - プロジェクト: 所属プロジェクト
```

### エージェントの状態確認

ダッシュボードで全エージェントの稼働状態、現在のタスク、エラー率を一覧で確認できる。

## トラブルシューティング

| 問題 | 対処 |
|------|------|
| ダッシュボードが開かない | `lsof -i :2099` でポート確認。競合していたらポート変更 |
| エージェントが表示されない | OpenClawとの連携設定を確認 |
| APIが応答しない | `paperclip start` でプロセスが起動しているか確認 |
