#!/bin/bash

# Crowdsourcing Auto-Response Agent - ワンコマンド実行スクリプト

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🚀 クラウドソーシング自動返信エージェント起動"
echo "⏰ $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 仮想環境の確認
if [ ! -d "venv" ]; then
    echo "❌ 仮想環境が見つかりません"
    echo "🔧 セットアップを実行してください："
    echo "   bash ../SETUP_GUIDE.md のスクリプトを実行"
    exit 1
fi

# 仮想環境を有効化
source venv/bin/activate

# .env ファイルの確認
if [ ! -f "scripts/.env" ]; then
    echo "❌ .env ファイルが見つかりません"
    echo "🔧 セットアップを実行してください"
    exit 1
fi

# ログディレクトリ作成
mkdir -p logs

# エージェント実行
echo "📊 案件監視を開始します..."
echo ""

python scripts/monitor.py

echo ""
echo "✅ エージェント実行完了"
echo ""
echo "📝 ログを確認："
echo "   tail -f logs/responses.log"
echo ""
