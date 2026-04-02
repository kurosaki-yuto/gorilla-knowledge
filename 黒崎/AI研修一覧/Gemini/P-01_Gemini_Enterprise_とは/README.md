# P-01: Gemini Enterprise とは？（スライド説明のみ）

## 概要

Google が 2025年10月に発表した **Gemini Enterprise** は、企業向けの高度なセキュリティ・カスタマイズを備えた大規模言語モデル（LLM）プラットフォームです。

このパートでは、Gemini の誕生背景から最新機能（2026年3月アップデート）までを、初心者向けに分かりやすく説明します。

## 学習目標

- Gemini の進化と業界ポジションを理解する
- ChatGPT・Claude との機能的差異を把握する
- Google Workspace 統合による効率化メリットを認識する
- 企業導入時のセキュリティ・コンプライアンス対応を学ぶ
- 実務での活用シーンをイメージできる

## 構成

| セクション | 内容 | 時間 |
|-----------|------|------|
| 1. Gemini の誕生背景 | ChatGPT 登場以降の競争激化と Google の戦略 | 1.5分 |
| 2. 主要AIツール比較 | Gemini vs ChatGPT vs Claude の機能・特性 | 2分 |
| 3. Google Workspace 統合 | Gmail・ドキュメント・スプレッドシート等への組み込み | 2分 |
| 4. 2026年最新機能 | 画像生成・動画生成・Deep Research | 2分 |
| 5. 企業導入のメリット | 業務効率化実績・ROI事例 | 2.5分 |
| 6. セキュリティ・コンプライアンス | HIPAA・FedRAMP・DLP 対応 | 1.5分 |

**合計：12分程度**

## ファイル構成

```
P-01_Gemini_Enterprise_とは/
├── README.md              # このファイル
├── 台本.md                # 12分の解説台本
├── テスト.md              # 4択クイズ5問
├── narrations.json        # ナレーション抽出（動画音声用）
├── generate_slides.js     # スライド自動生成スクリプト
├── スライド.pptx          # 生成済みPowerPointスライド
├── スライド画像/          # PowerPoint → PNG 出力
├── プレゼン.html          # HTML5プレゼンテーション
└── 動画.mp4               # 完成動画（スライド+ナレーション）
```

## 参考資料

- 最新情報ソース: `_toolkit/Gemini-Enterprise-latest.md`
- デザインルール: `_toolkit/design-system.js`
- 既存コース参考: `A-101_AIとは何か/` など

## 実行コマンド

```bash
# スライド生成（Node.js）
node generate_slides.js

# 動画生成（Python）
python video-generator.py
```

## 完成予定

- スライド: 25～30枚
- ナレーション: 約12分（1,800～2,000語）
- 動画フォーマット: MP4 （1920x1080, 24fps）

---

**作成日**: 2026-04-02  
**対象**: AI研修初級～中級  
**実施時間**: 12分（スライド説明のみ）
