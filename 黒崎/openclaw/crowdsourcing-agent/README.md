# 🤖 Crowdsourcing Auto-Response Agent

クラウドワークス、ココナラ等のクラウドソーシング案件を自動監視・自動返信するエージェント。

**実装方式：** Python + Selenium （ブラウザ自動化）

---

## 📋 機能

✅ **案件自動監視** - クラウドワークス / ココナラの新着案件を定期チェック
✅ **案件自動分類** - 案件タイプ別（営業 / 開発 / 事務作業等）に分類
✅ **自動返信** - テンプレートベースの自動返信メッセージ送信
✅ **Notionログ** - 返信状況をリアルタイム追跡
✅ **学習＆最適化** - 返信率・受注率から戦略を自動調整

---

## 📁 フォルダ構成

```
crowdsourcing-agent/
├── README.md                          # このファイル
├── strategies/
│   ├── cloudworks-strategy.md         # クラウドワークス案件分析＆返信戦略
│   ├── coconala-strategy.md           # ココナラ案件分析＆返信戦略
│   └── priority-rules.md              # 優先度ルール（単価・スキル等）
│
├── scripts/
│   ├── cloudworks_auto_responder.py   # クラウドワークス自動返信スクリプト
│   ├── coconala_auto_responder.py     # ココナラ自動返信スクリプト
│   ├── monitor.py                     # 案件監視メインプロセス
│   └── scheduler.py                   # 定期実行スケジューラー
│
├── templates/
│   ├── cloudworks_templates.json      # クラウドワークス返信テンプレート
│   ├── coconala_templates.json        # ココナラ返信テンプレート
│   └── category_classifier.json       # 案件分類ルール
│
└── logs/
    ├── responses.log                  # 送信返信ログ
    ├── proposals.log                  # 提案状況ログ
    └── analytics.log                  # 成果分析ログ
```

---

## 🚀 使い方

### **Step 1: セットアップ**

```bash
pip install selenium requests beautifulsoup4 python-dotenv
```

### **Step 2: 認証情報設定**

`.env` ファイルを作成（git ignore に追加）:

```
CLOUDWORKS_EMAIL=your_email@example.com
CLOUDWORKS_PASSWORD=your_password
COCONALA_EMAIL=your_email@example.com
COCONALA_PASSWORD=your_password
NOTION_API_KEY=your_notion_api_key
```

### **Step 3: スケジューラーを起動**

```bash
python scripts/scheduler.py
```

### **Step 4: ログを監視**

```bash
tail -f logs/responses.log
```

---

## 📊 動作イメージ

```
[定期実行] (毎時間チェック)
    ↓
[案件監視] - クラウドワークス / ココナラ の新着案件を取得
    ↓
[案件分類] - 案件タイプを自動判定（営業代行 / AI開発 / その他）
    ↓
[優先度判定] - 単価・難易度・スキルマッチで優先度判定
    ↓
[自動返信] - マッチした案件に テンプレート返信を送信
    ↓
[ログ記録] - 返信結果を logs/ に記録
    ↓
[Notion更新] - 進捗をNotionに自動反映
    ↓
[分析＆最適化] - 返信率・受注率から戦略を調整
```

---

## ⚙️ 設定ファイル

### `priority-rules.md`

どの案件に自動返信するかを定義：

```yaml
AUTO_RESPOND_RULES:
  - category: "AI開発"
    min_budget: 50000
    max_budget: 500000
    auto_respond: true
    
  - category: "営業代行"
    min_budget: 30000
    max_budget: 200000
    auto_respond: true
    
  - category: "その他"
    auto_respond: false
```

---

## 🔧 実装方式

**メイン：** Python + Selenium
**代替：** Claude in Chrome （ブラウザ自動化）

### **Python 実装のメリット：**
✅ 複雑なロジック実装が簡単
✅ スケジューリングが容易
✅ ログ管理が充実
✅ 自動最適化が可能

### **Claude in Chrome 実装のメリット：**
✅ UI変更に強い
✅ 自然言語での指示が可能
✅ 柔軟な対応が可能

---

## 📈 期待成果

**設定値（目安）：**
- 案件監視：1時間ごと
- 返信対象：優先度HIGH案件のみ
- 自動返信率：マッチした案件の100%

**見込み成果：**
- 月間新着案件：200件
- 優先度マッチ率：20～30% = 40～60件
- 返信率：100%
- 受注率：10～20% = 4～12件
- 月間売上：¥200k～500k （案件単価による）

---

## 🛠️ トラブルシューティング

**問題：** ログインがブロックされる
→ 2FA設定確認、ブラウザの自動化検出を回避

**問題：** テンプレートが古い
→ `templates/` ファイルを更新、再起動

**問題：** 返信が送信されない
→ `logs/responses.log` でエラー確認

---

## 📝 ログイン認証情報

**クラウドワークス：**
- URL: https://crowdworks.jp/login
- Selenium での自動ログイン実装予定

**ココナラ：**
- URL: https://coconala.com/login
- Selenium での自動ログイン実装予定

---

**Status:** ⏳ 実装準備中 → Python スクリプト構築予定
**Owner:** Orchestrator
**Updated:** 2026-03-10
