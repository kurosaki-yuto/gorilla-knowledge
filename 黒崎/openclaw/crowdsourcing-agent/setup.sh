#!/bin/bash

set -e

echo "🚀 OpenClaw クラウドソーシング自動エージェント セットアップ開始"
echo ""

# Step 1: Pythonバージョン確認
echo "✅ Python バージョン確認中..."
python3 --version || { echo "❌ Python3 がインストールされていません。brew install python3 を実行してください。"; exit 1; }

# Step 2: 作業ディレクトリに移動
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

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

# Step 9: .gitignore に .env を追加
if [ -f "../.gitignore" ]; then
    if ! grep -q "\.env" ../.gitignore; then
        echo ".env" >> ../.gitignore
        echo "✅ .gitignore に .env を追加しました"
    fi
fi

echo ""
echo "=========================================="
echo "✅ セットアップ完了！"
echo "=========================================="
echo ""
echo "🚀 起動方法："
echo ""
echo "   cd $(pwd)"
echo "   ./run.sh"
echo ""
echo "=========================================="
