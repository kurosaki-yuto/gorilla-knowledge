# 管理ダッシュボード（React + Supabase）の実装パターン

## 概要

MissionControl（TenacitOS）とは別に、React + Supabaseで独自の管理ダッシュボードを構築した。Vercelにデプロイしてブラウザからアクセスする形式。

## 技術スタック

- **フロントエンド**: React 19 + TypeScript + Vite
- **スタイリング**: Tailwind CSS v4
- **データソース**: Supabase REST API + Realtime Subscriptions
- **デプロイ**: Vercel

## 画面構成

| ページ | 機能 |
|--------|------|
| Dashboard | 昨日の完了タスク数、ブロック中タスク数、OKR進捗 |
| Agents | エージェント一覧（状態、タスク統計、スキル表示） |
| Tasks | ジョブ管理（フィルター、承認、却下、リアサイン） |
| Command | エージェントへの直接指示（チャットUI） |
| Timeline | 活動ログの時系列表示 |
| Artifacts | 成果物一覧 |
| Settings | システム設定・接続状態 |

## リアルタイム更新の実装

Supabaseの **Postgres Change Feed** を使い、DBの変更をリアルタイムでUIに反映：

```typescript
// 30秒ポーリング + Postgres Subscriptions の併用
const channel = supabase
  .channel('jobs-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'jobs' },
    (payload) => {
      // UIを更新
    }
  )
  .subscribe()
```

**フォールバック**: Subscriptionが切れた場合のために、30秒間隔のポーリングも併用。

## エージェントアイコンの割り当て

```typescript
const AGENT_ICONS = {
  ceo: '🦁',
  cos: '📋',
  'ops-monitor': '🔍',
  'content-creator': '🎨',
  'policy-researcher': '📊',
  'sales-strategist': '💼'
}
```

## コマンド機能の設計

ブラウザからエージェントに直接指示を送れるチャットUI：

1. ユーザーがコマンドを入力
2. Supabaseの `commands` テーブルにINSERT
3. エージェントが非同期でコマンドを処理
4. 結果がUIに反映（pending → processing → done/error）
5. 会話履歴はlocalStorageに保存（エージェントごとに分離）

## 教訓

- **Supabase Realtime + ポーリングの併用** が堅い。Realtime単体は接続が切れることがある
- **localStorageの会話履歴** はブラウザ間で共有されない。重要なデータはDBに入れる
- **環境変数のVITE_プレフィックス** を忘れるとフロントエンドからアクセスできない（Viteの仕様）
