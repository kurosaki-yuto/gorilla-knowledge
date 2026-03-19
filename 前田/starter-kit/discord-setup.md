# Step 5: Discord Bot の作成と接続

## なぜDiscordか

OpenClawはDiscordをメインの入出力チャンネルとして使う。ユーザーがDiscordでメッセージを送ると、OpenClawがそれを受け取り、適切なエージェントにルーティングする。

## Bot の作成手順

### 1. Discord Developer Portal でアプリケーション作成

1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. 「New Application」をクリック
3. アプリケーション名を入力して「Create」

### 2. Bot を追加

1. 左メニュー「Bot」を選択
2. 「Add Bot」→「Yes, do it!」
3. **Bot Token をコピー**（後で使う。一度しか表示されないので注意）

### 3. 必須: Privileged Gateway Intents を有効化

**これを忘れると Bot がメッセージを読めない（よくあるハマりポイント）**

1. 左メニュー「Bot」→ 下にスクロール
2. **「Privileged Gateway Intents」セクション**
3. 以下を全て **ON** にする：
   - ✅ **Presence Intent**
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent** ← **最重要。これがOFFだとメッセージ本文が空になる**
4. 「Save Changes」

### 4. Bot をサーバーに招待

1. 左メニュー「OAuth2」→「URL Generator」
2. Scopes: `bot` にチェック
3. Bot Permissions:
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ View Channels
   - ✅ Add Reactions
   - ✅ Use Slash Commands
   - ✅ Manage Threads（スレッド機能を使う場合）
4. 生成されたURLをブラウザで開いて、サーバーを選択して招待

### 5. OpenClaw に接続

```bash
# チャンネルログインコマンド
openclaw channels login
```

または、`openclaw.json` のチャンネル設定で Discord を有効化：

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "open",
      "dmPolicy": "open"
    }
  }
}
```

Bot Token は onboard 時またはチャンネルログイン時に入力する。

## チャンネル構成の推奨

| チャンネル | 用途 | 設定 |
|-----------|------|------|
| #main | 日常のやり取り | エージェントが読み書き |
| #feed | 成果物の通知 | エージェントが書き込み |
| #alert | 異常時のアラート | Ops Monitorが書き込み |
| #log | デバッグログ | 機械的なログ出力 |

**最低限 #main があれば運用開始できる。** 他は必要に応じて追加。

## 動作確認

1. Discord のサーバーで Bot がオンライン（緑色）になっていることを確認
2. #main チャンネルで適当なメッセージを送信
3. Bot が反応（👀リアクション → 応答メッセージ）すればOK

## よくあるトラブル

### Bot がオンラインにならない
- Gatewayが起動しているか確認: `lsof -i :18790`
- Bot Token が正しいか確認

### Bot がメッセージに反応しない
- **Message Content Intent が ON になっているか確認**（最も多い原因）
- Discord Developer Portal → Bot → Privileged Gateway Intents → Message Content Intent

### メッセージ本文が空（`message.content === ""`）
- Message Content Intent が OFF。上記の手順で ON にする
- ONにした後、Gatewayを再起動する

### 権限エラー
- Bot の権限が不足している。サーバー設定 → ロール でBot のロールに必要な権限を付与
