# OpenClaw Gatewayの基本

## OpenClawとは

複数のチャットチャンネル（Discord、LINE等）とAIエージェントを繋ぐ **ゲートウェイプラットフォーム**。

```
Discord / LINE
     ↓ メッセージ受信
OpenClaw Gateway (localhost:18790)
     ↓ ルーティング
AIエージェント群
     ↓ 結果
Discord / LINE に返信
```

## 設定ファイル（openclaw.json）の構造

```json
{
  "agents": {
    "list": [...],        // エージェント一覧
    "defaults": {         // デフォルトモデル設定
      "model": "claude-sonnet-4-5",
      "fallbacks": ["claude-haiku-4-5"]
    }
  },
  "channels": {
    "discord": { "enabled": true },
    "line": { "enabled": true, ... }
  },
  "skills": {
    "entries": [...]      // 有効なスキル一覧（40+）
  },
  "session": {
    "reset": "daily",     // セッションリセット頻度
    "maintenance": { "prune": "7d" }  // 7日でプルーニング
  },
  "tools": {
    "agent_to_agent": { "enabled": true },
    "exec": { "security": "full" }
  }
}
```

**重要**: このファイルはOpenClaw CLIが管理する。直接編集は非推奨。

## エージェントの定義

各エージェントに設定できる項目：

| 項目 | 説明 |
|------|------|
| id | エージェントID（一意） |
| model | 使用するLLMモデル |
| workspace | 作業ディレクトリのパス |
| skills | 使用可能なスキル一覧 |
| sandbox | サンドボックスモード（off = フルアクセス） |

## ポート

デフォルト: **18790**

確認方法:
```bash
lsof -i :18790
```

## 起動・停止

```bash
# 起動
openclaw start

# 停止
openclaw stop

# ヘルスチェック
curl http://localhost:18790/health
```

## 注意点

- Gateway自体は **状態を持たない**。再起動しても設定ファイルから復元される
- 重い処理（5秒以上）をGatewayにさせない。ルーティングに専念させる
- 長文のコンテキスト管理はGatewayの責務外
