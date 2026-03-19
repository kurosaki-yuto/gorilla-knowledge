# Step 6: 動作確認チェックリスト

## 全体チェック

以下を上から順に確認する。全てパスすれば環境構築完了。

### 1. 前提条件

```bash
# 一括確認
echo "Node.js: $(node --version)" && \
echo "npm: $(npm --version)" && \
echo "Python: $(python3 --version)" && \
echo "Git: $(git --version)" && \
echo "Claude Code: $(claude --version 2>/dev/null || echo '未インストール')" && \
echo "OpenClaw: $(openclaw --version 2>/dev/null || echo '未インストール')"
```

- [ ] Node.js 18以上
- [ ] npm インストール済み
- [ ] Python 3.10以上
- [ ] Git インストール済み
- [ ] Claude Code インストール済み
- [ ] OpenClaw インストール済み

### 2. Claude Code

```bash
# 起動テスト
claude --version
```

- [ ] Claude Code が起動する
- [ ] Anthropicアカウントで認証済み
- [ ] `~/.claude/settings.json` が存在する

### 3. OpenClaw Gateway

```bash
# ポート確認
lsof -i :18790

# ヘルスチェック
curl -s http://localhost:18790/health
```

- [ ] Gateway がポート 18790 で起動している
- [ ] ヘルスチェックが正常レスポンスを返す
- [ ] `~/.openclaw/openclaw.json` が存在する

### 4. Discord Bot

- [ ] Discord Developer Portal で Bot が作成済み
- [ ] **Message Content Intent が ON**（最重要）
- [ ] **Server Members Intent が ON**
- [ ] Bot がサーバーに招待済み
- [ ] Bot がオンライン表示（緑色マーク）
- [ ] #main でメッセージを送ると Bot が反応する

### 5. Paperclip（タスク管理）

```bash
# ポート確認
lsof -i :2099

# ダッシュボードアクセス
open http://localhost:2099
```

- [ ] Paperclip が起動している
- [ ] ダッシュボードが表示される
- [ ] Company に所属している

### 6. ワークスペース

```bash
# ディレクトリ確認
ls ~/.openclaw/workspaces/
ls ~/.openclaw/skills/
ls ~/.openclaw/workspace/output/
```

- [ ] workspaces/ ディレクトリが存在する
- [ ] skills/ ディレクトリが存在する
- [ ] workspace/output/ ディレクトリが存在する

## 最終テスト

```bash
# Discord #main で以下を送信
「今日の日付を教えて」
```

Bot が正しい日付を返信すれば、**環境構築完了！**

## 問題がある場合

[troubleshooting.md](troubleshooting.md) を参照。
