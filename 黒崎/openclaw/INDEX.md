# 📚 OpenClaw セットアップ ナビゲーション

## あなたは何がしたい？

### 🚀 **すぐに実行したい**
→ [`QUICK_START.md`](./setup/QUICK_START.md) を読んでください（3ステップで完了）

### 🤖 **Claude Code で自動セットアップしてほしい**
→ [`CLAUDE_CODE_SETUP.md`](./setup/CLAUDE_CODE_SETUP.md) をコピペしてください

### 📖 **詳しく設定を理解したい**
→ [`SETUP_GUIDE.md`](./setup/SETUP_GUIDE.md) で詳細を確認

### 🎤 **クライアントとのMTGでヒアリングしたい**
→ [`HEARING_CHECKLIST.md`](./hearing/HEARING_CHECKLIST.md) をMTG中に参照

### 📝 **MTGメモから要件定義書を自動生成したい**
→ [`HEARING_GENERATOR.md`](./hearing/HEARING_GENERATOR.md) のプロンプトをClaude Codeに貼り付け

### 💼 **営業キャンペーンを実行したい**
→ [`sales-campaign/README.md`](./sales-campaign/README.md) を確認

### 🔧 **クラウドソーシング自動エージェントの詳細を知りたい**
→ [`crowdsourcing-agent/README.md`](./crowdsourcing-agent/README.md) を確認

---

## 📁 ファイル構成

```
openclaw/
│
├── 📚 INDEX.md                    ← ナビゲーション（これ）
│
├── setup/                         ← セットアップ系
│   ├── ⚡ QUICK_START.md          ← 3ステップで実行
│   ├── 🤖 CLAUDE_CODE_SETUP.md    ← Claude Code で自動セットアップ
│   ├── 📋 SETUP_GUIDE.md          ← 詳細セットアップガイド
│   └── 📋 UNIVERSAL_SETUP.md      ← 汎用セットアップ
│
├── agent-config/                  ← エージェント設定
│   ├── SOUL.md
│   ├── MEMORY.md
│   ├── HEARTBEAT.md
│   └── USER.md
│
├── hearing/                       ← ヒアリング系
│   ├── 🎤 HEARING_CHECKLIST.md    ← MTG用ヒアリングチェックリスト
│   └── 📝 HEARING_GENERATOR.md    ← 要件定義自動生成プロンプト
│
├── 💼 sales-campaign/             ← 営業キャンペーンプロジェクト
│   ├── README.md
│   ├── strategy/
│   ├── templates/
│   ├── execution/
│   └── reports/
│
└── 🤖 crowdsourcing-agent/        ← クラウドソーシング自動エージェント
    ├── README.md
    ├── CLAUDE_INTERACTIVE_SETUP.md
    ├── setup.sh               ← 自動セットアップ（初回）
    ├── run.sh                 ← ワンコマンド実行
    ├── scripts/
    ├── strategies/
    ├── templates/
    └── logs/
```

---

## 🎯 推奨される使い方

### **パターン1：急いでいる（5分）**
1. `QUICK_START.md` を読む
2. コマンドをコピペして実行
3. ログ確認

### **パターン2：正しく設定したい（15分）**
1. `SETUP_GUIDE.md` で全体を理解
2. 設定内容をカスタマイズ
3. セットアップ実行

### **パターン3：技術に詳しくない（全自動）**
1. `CLAUDE_CODE_SETUP.md` をコピー
2. Claude Code に貼り付け
3. Claude が質問を聞いたら回答
4. 自動セットアップ完了

---

## 🚀 1分で開始

```bash
# ターミナルで実行
cd ~/Downloads/開発/addness-knowledge/kurosaki/openclaw/crowdsourcing-agent

# 初回：セットアップ（1回のみ）
bash setup.sh

# 毎回：実行
./run.sh
```

---

## 🤖 Claude Code で実行（自動セットアップ）

1. `crowdsourcing-agent/CLAUDE_INTERACTIVE_SETUP.md` をコピー
2. Claude Code に貼り付け
3. Claude の質問に答える
4. 自動でセットアップ完了

---

## 💡 各ファイルの説明

| ファイル | 用途 | 対象者 |
|---------|------|--------|
| `QUICK_START.md` | 3ステップ実行ガイド | 急いでいる人 |
| `CLAUDE_CODE_SETUP.md` | 自動セットアップ用 | Claude Code ユーザー |
| `SETUP_GUIDE.md` | 詳細セットアップガイド | 技術的に理解したい人 |
| `HEARING_CHECKLIST.md` | MTGヒアリングチェックリスト | クライアント対応する人 |
| `HEARING_GENERATOR.md` | 要件定義自動生成プロンプト | MTG後に要件定義する人 |
| `sales-campaign/README.md` | 営業キャンペーン | 営業自動化したい人 |
| `crowdsourcing-agent/README.md` | クラウドソーシング自動化 | 自動営業したい人 |

---

## ✅ セットアップ完了の目安

セットアップが完了したら、以下のコマンドでログが出ます：

```bash
tail -f ~/Downloads/開発/addness-knowledge/kurosaki/openclaw/crowdsourcing-agent/logs/responses.log
```

ログが表示されたら、**セットアップ成功**です！

---

## 🆘 トラブルが出た場合

1. `SETUP_GUIDE.md` の「トラブルシューティング」を確認
2. ログファイルでエラーメッセージを確認
3. Claude に「セットアップでエラーが出た」と相談

---

## 📞 サポート

質問や問題がある場合：

1. `SETUP_GUIDE.md` で探す
2. ログファイルでエラー確認
3. Claude Code で自動修復を試す

---

## 🎉 セットアップ完了後にやること

1. ✅ クラウドワークス・ココナラで新着案件をチェック
2. ✅ ログで返信状況を確認
3. ✅ 受注があれば対応

---

## 📊 期待成果

- **月間新着案件監視：** 300件
- **自動返信数：** 45～60件
- **受注数：** 4～10件
- **月間売上：** ¥200k～500k

---

## 🔐 セキュリティに関する注意

⚠️ 重要：

- `.env` ファイルに認証情報が保存されます
- **絶対に Git に commit しないでください**
- **絶対に他人と共有しないでください**
- **パスワード・API Key は厳重に管理してください**

---

**Status:** ✅ 完成・即座利用可能
**Last Updated:** 2026-03-10
**Version:** 1.0
