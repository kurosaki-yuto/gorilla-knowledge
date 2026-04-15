# 🚀 OpenClaw クラウドソーシング自動エージェント セットアップガイド

このガイドに従うだけで、クラウドワークス・ココナラの自動返信エージェントが動きます。

---

## 📋 前提条件

- **macOS or Linux** （Windowsの場合はWSL2）
- **Python 3.8以上**
- **Homebrew** （macOS）
- **Git**

---

## 🎯 セットアップ（5分で完了）

### **Step 1: このマークダウンをコピーして、Terminal で実行**

下の「自動セットアップスクリプト」セクションの全コードをコピーして、Terminal に貼り付けてください。

```bash
# Terminal を開いて、下のコードを全部コピペして実行
# (このコメント行は含めずに、#!/bin/bash から最後の echo まで)
```

### **Step 2: 認証情報を入力**

スクリプト実行後、以下の情報を聞かれます。入力してください：

```
✉️  クラウドワークスメール：your_email@example.com
🔐 クラウドワークスパスワード：your_password
✉️  ココナラメール：your_email@example.com
🔐 ココナラパスワード：your_password
```

### **Step 3: 実行開始**

```bash
python run.py
```

完了。これでクラウドソーシング自動エージェントが起動します。

---

## 🛠️ 自動セットアップスクリプト

**以下の全コードをコピーして、Terminal で実行してください：**

```bash
#!/bin/bash

set -e

echo "🚀 OpenClaw クラウドソーシング自動エージェント セットアップ開始"
echo ""

# Step 1: Pythonバージョン確認
echo "✅ Python バージョン確認中..."
python3 --version || { echo "❌ Python3 がインストールされていません。brew install python3 を実行してください。"; exit 1; }

# Step 2: 作業ディレクトリに移動
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/crowdsourcing-agent"

echo "📁 作業ディレクトリ：$PWD"
echo ""

# Step 3: Python仮想環境作成
echo "✅ Python 仮想環境を作成中..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ 仮想環境作成完了"
else
    echo "ℹ️  仮想環境は既に存在します"
fi

# Step 4: 仮想環境を有効化
source venv/bin/activate
echo "✅ 仮想環境を有効化しました"
echo ""

# Step 5: 依存パッケージをインストール
echo "✅ 依存パッケージをインストール中（初回は数分かかります）..."
pip install -q --upgrade pip
pip install -q selenium requests beautifulsoup4 python-dotenv

echo "✅ パッケージインストール完了"
echo ""

# Step 6: .env ファイルをセットアップ
echo "✅ 認証情報を設定します"
echo ""
echo "クラウドワークスの認証情報を入力してください："
read -p "  メールアドレス：" CW_EMAIL
read -sp "  パスワード：" CW_PASSWORD
echo ""

echo ""
echo "ココナラの認証情報を入力してください："
read -p "  メールアドレス：" CN_EMAIL
read -sp "  パスワード：" CN_PASSWORD
echo ""

# Step 7: .env ファイル生成
cat > scripts/.env << EOF
CLOUDWORKS_EMAIL=$CW_EMAIL
CLOUDWORKS_PASSWORD=$CW_PASSWORD
COCONALA_EMAIL=$CN_EMAIL
COCONALA_PASSWORD=$CN_PASSWORD

NOTION_API_KEY=
NOTION_DATABASE_ID=

MONITOR_INTERVAL_MINUTES=60
AUTO_RESPOND_MIN_BUDGET=20000
AUTO_RESPOND_CATEGORIES=AI開発,営業代行,マーケティング

LOG_LEVEL=INFO
LOG_DIR=../logs

BROWSER_HEADLESS=true
BROWSER_TIMEOUT_SECONDS=30
EOF

echo "✅ .env ファイルを作成しました"
echo ""

# Step 8: logs ディレクトリ作成
mkdir -p logs
echo "✅ ログディレクトリを作成しました"
echo ""

# Step 9: Chrome / Chromedriver 確認
echo "✅ Chrome と Chromedriver を確認中..."
if ! command -v chromedriver &> /dev/null; then
    echo "⚠️  Chromedriver がインストールされていません。"
    echo "   以下を実行してください："
    echo "   brew install chromedriver"
    echo ""
fi

# Step 10: 完了メッセージ
echo ""
echo "=========================================="
echo "✅ セットアップ完了！"
echo "=========================================="
echo ""
echo "🚀 起動方法："
echo ""
echo "   cd $(pwd)"
echo "   source venv/bin/activate"
echo "   python scripts/monitor.py"
echo ""
echo "または、簡単に："
echo ""
echo "   ./run.sh"
echo ""
echo "=========================================="

```

---

## 🎮 実行方法

### **方法1：簡単実行（推奨）**

```bash
cd /path/to/openclaw/crowdsourcing-agent
./run.sh
```

### **方法2：手動実行**

```bash
cd /path/to/openclaw/crowdsourcing-agent

# 仮想環境を有効化
source venv/bin/activate

# エージェントを起動
python scripts/monitor.py
```

### **方法3：定期実行（cron）**

```bash
# crontab エディタを開く
crontab -e

# 以下を追加（毎時間実行）
0 * * * * cd /path/to/openclaw/crowdsourcing-agent && source venv/bin/activate && python scripts/monitor.py >> logs/cron.log 2>&1
```

---

## 🔧 OpenClaw との連携

### **LINE + Claude Code での自動実行**

OpenClaw の Claude Code（または他のエージェント）から、以下を実行：

```bash
#!/bin/bash
cd /path/to/openclaw/crowdsourcing-agent
source venv/bin/activate
python scripts/monitor.py
```

### **自動レポート（毎日夜間）**

OpenClaw の heartbeat や cron で、以下を実行：

```bash
python /path/to/openclaw/crowdsourcing-agent/scripts/monitor.py && \
python /path/to/openclaw/crowdsourcing-agent/scripts/report.py
```

すると、毎日夜間に：
- ✅ クラウドソーシング監視実行
- ✅ 返信状況をログに記録
- ✅ LINE に結果報告

---

## 📝 設定ファイルの詳細

### **.env ファイル**

セットアップスクリプトで自動生成されますが、手動で編集することも可能：

```bash
# テキストエディタで開く
nano scripts/.env

# または
vim scripts/.env
```

**主な設定値：**

| 設定 | 説明 | 例 |
|------|------|-----|
| `CLOUDWORKS_EMAIL` | クラウドワークスのメール | `user@example.com` |
| `CLOUDWORKS_PASSWORD` | クラウドワークスのパスワード | `your_password` |
| `MONITOR_INTERVAL_MINUTES` | 監視頻度（分） | `60` = 1時間ごと |
| `AUTO_RESPOND_MIN_BUDGET` | 自動返信の最小単価（円） | `20000` |
| `BROWSER_HEADLESS` | ブラウザUIを表示するか | `true` = 表示しない |

---

## 🐛 トラブルシューティング

### **Q: Chromedriver がインストールされていないエラー**

```bash
brew install chromedriver
```

### **Q: Python パッケージのエラー**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### **Q: .env ファイルが見つからない**

セットアップスクリプトを再度実行：

```bash
bash setup.sh
```

### **Q: ログを確認したい**

```bash
tail -f logs/responses.log
```

---

## 📊 実行ログの確認

実行後、以下で進捗を確認できます：

```bash
# リアルタイム監視
tail -f logs/responses.log

# 返信状況を確認
cat logs/responses.log | grep "✅"

# エラーを確認
cat logs/responses.log | grep "❌"
```

---

## 🔐 セキュリティノート

⚠️ **重要：**
- `.env` ファイルには認証情報が含まれます
- **絶対に Git に commit しないでください**
- `.env` は `.gitignore` に自動追加されています

確認：

```bash
cat .gitignore | grep ".env"
```

---

## ✅ セットアップ完了チェックリスト

実行後、以下を確認してください：

- [ ] Python 3.8 以上がインストールされている
- [ ] `venv/` フォルダが存在する
- [ ] `scripts/.env` ファイルが存在する
- [ ] `logs/` フォルダが存在する
- [ ] 依存パッケージがインストールされている

確認コマンド：

```bash
ls -la venv scripts/.env logs/
pip list | grep -E "selenium|requests|beautifulsoup4|python-dotenv"
```

---

## 🚀 次のステップ

1. **セットアップスクリプトを実行**
2. **認証情報を入力**
3. **`./run.sh` で実行開始**
4. **ログで進捗確認**

以上です。質問があれば、このファイルを参照するか、エラーメッセージを確認してください。

---

**Last Updated:** 2026-03-10
**Status:** ✅ 完成・即座実行可能
