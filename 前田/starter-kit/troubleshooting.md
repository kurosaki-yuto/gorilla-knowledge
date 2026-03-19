# トラブルシューティング集

## インストール系

### `npm install -g` で権限エラー

```
Error: EACCES: permission denied
```

**対処:**
```bash
# 方法1: npmのデフォルトディレクトリを変更（推奨）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 方法2: nvm を使う（Node.jsのバージョン管理ごと切り替え）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### Node.js のバージョンが古い

```bash
# nvm で最新LTSに切り替え
nvm install --lts
nvm use --lts
```

---

## Claude Code 系

### 認証エラー（ログインできない）

```bash
# 認証情報をリセット
claude logout
claude login
```

ブラウザでAnthropicアカウントにログインし直す。

### コンテキストが溢れる

「コンテキストが大きすぎます」のようなエラーが出る場合：

```bash
# セッション内で
/compact
```

または新しいセッションを開始：
```bash
/clear
```

**根本対策**: CLAUDE.md を短くする（A4で2ページ以内目安）

### レスポンスが遅い

- `/cost` でトークン使用量を確認。大量のファイルを読み込んでいないか
- `effortLevel` を `"low"` に変更すると速くなる（精度は下がる）

---

## OpenClaw Gateway 系

### Gateway が起動しない

```bash
# ポートが使われていないか確認
lsof -i :18790

# 使われていたらプロセスを特定
kill $(lsof -t -i :18790)

# 再起動
openclaw gateway --port 18790
```

### 設定ファイルが壊れた

```bash
# JSONの構文チェック
python3 -m json.tool ~/.openclaw/openclaw.json

# エラーが出たら、バックアップから復元するか再セットアップ
openclaw onboard
```

### ログの確認

```bash
# Gatewayログ
tail -f ~/.openclaw/logs/gateway.log

# エラーログのみ
grep -i error ~/.openclaw/logs/gateway.log
```

---

## Discord Bot 系

### Bot がメッセージに反応しない（最頻出）

**99%の原因: Message Content Intent が OFF**

1. [Discord Developer Portal](https://discord.com/developers/applications)
2. アプリケーション選択 → Bot → Privileged Gateway Intents
3. **Message Content Intent** を **ON**
4. Save Changes
5. **Gatewayを再起動**

### Bot がオフライン

```bash
# Gatewayが動いているか
lsof -i :18790

# 動いていなければ起動
openclaw gateway --port 18790
```

### `message.content` が空文字列

Message Content Intent が OFF の典型症状。上記の手順で ON にする。

### `Unknown channel` エラー

- チャンネルIDが正しいか確認
- Bot がそのチャンネルにアクセスできる権限があるか確認
- サーバー設定 → チャンネル → 権限 で Bot のロールにアクセス権を付与

### `guildId required` エラー

複数サーバーに Bot がいる場合に発生。メッセージ送信時にチャンネルIDを明示的に指定する。

---

## Paperclip 系

### ダッシュボードが開かない

```bash
# プロセス確認
lsof -i :2099

# 起動していなければ
paperclip start
```

### ポートが競合

```bash
# 別ポートで起動
paperclip start --port 3099
```

---

## 環境変数系

### 「APIキーが無効」エラー

```bash
# 環境変数が正しく設定されているか確認
echo $ANTHROPIC_API_KEY
echo $DISCORD_BOT_TOKEN
```

空の場合、`.env` ファイルを確認して再設定。

### `.env` が読み込まれない

```bash
# .env のパスを確認
ls -la ~/.openclaw/project/config/.env

# シェルから読み込み（デバッグ用）
source ~/.openclaw/project/config/.env
```

---

## 困ったときの一般的な対処

1. **ログを見る**: `tail -f ~/.openclaw/logs/gateway.log`
2. **再起動する**: Gateway を止めて起動し直す
3. **設定を確認する**: `python3 -m json.tool ~/.openclaw/openclaw.json`
4. **Claude Code に聞く**: `「OpenClaw Gatewayがエラーを出している。ログはこれ: [ログ内容]」`
5. **チームに聞く**: Discord #main で状況を共有
