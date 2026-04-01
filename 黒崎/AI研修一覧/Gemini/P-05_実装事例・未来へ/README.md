# P-05: 実装事例・使い方・未来へ（スライド＋実演動画）

## 概要

Gemini Enterprise が実際の企業現場でどのように活躍しているか、具体的な導入事例と使い方を学びます。

J:COM・note・日本特殊陶業などの企業で、どれだけの時間削減と ROI が生まれたのかを見た後、誰でも今日から使える「最初の3ステップ」を実演で紹介します。

## 学習目標

- 企業導入事例から ROI 指標を理解する
- Gemini の基本的な使い方（Gmail・ドキュメント・スプレッドシート）を習得する
- 導入後の時間軸的な変化（3ヶ月・6ヶ月・1年）をイメージする
- 自分の業務で「最初に試すべき機能」を特定できる
- Gemini 導入への不安を払拭する

## 構成

| セクション | 内容 | 時間 |
|-----------|------|------|
| 1. 企業導入事例 | J:COM・note・日本特殊陶業の実績 | 2.5分 |
| 2. 導入後の効果 | 時間削減・ROI 数字 | 2分 |
| 3. Gemini の基本的な使い方 | Gmail・ドキュメント・スプレッドシート | 2分 |
| 4. 実演：未来予測ストーリー | 「導入したらこう変わる」の3段階 | 3分 |
| 5. 最初の3ステップ | 誰でも今日から実行できる使い方 | 1.5分 |
| 6. Q&A・まとめ | よくある質問と今後 | 1分 |

**合計：12分程度（スライド 7.5分 + 実演 4.5分）**

## ファイル構成

```
P-05_実装事例・未来へ/
├── README.md              # このファイル
├── 台本.md                # 12分の解説 + 実演台本
├── テスト.md              # 4択クイズ5問
├── narrations.json        # ナレーション JSON（スライド + 実演）
├── generate_slides.js     # スライド自動生成スクリプト
├── スライド.pptx          # 生成済みPowerPointスライド
├── スライド画像/          # PowerPoint → PNG 出力
├── プレゼン.html          # HTML5プレゼンテーション
└── 動画.mp4               # 完成動画（スライド+実演+ナレーション同期）
```

## 実演動画情報

- **実演ファイル**: `/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/_toolkit/recordings/P-05/page@df2ffdf77f3d28bac625a32a606ca8e3.webm`
- **実演尺**: 92.3秒
- **内容**: 導入後の変化（3ヶ月→6ヶ月→1年） + 最初の3ステップ
- **ナレーション**: 92.3秒に完全同期

## 参考資料

- 最新情報ソース: `_toolkit/Gemini-Enterprise-latest.md`
- デザインルール: `_toolkit/design-system.js`
- ビルドスクリプト: `_toolkit/build-with-demo.py`

## 実行コマンド

```bash
# スライド生成（Node.js）
cd /Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/Gemini/P-05_実装事例・未来へ
node generate_slides.js

# 動画生成（Python）
cd /Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/_toolkit
python3 build-with-demo.py \
  --course-dir "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/Gemini/P-05_実装事例・未来へ" \
  --demo-slides "5=recordings/P-05/page@df2ffdf77f3d28bac625a32a606ca8e3.webm" \
  --narrations "narrations.json"
```

## 完成予定

- スライド: 20～25枚
- ナレーション: 約12分（1,800～2,000語）
- 実演: 92.3秒（スライド5に同期）
- 動画フォーマット: MP4 （1920x1080, 24fps）

---

**作成日**: 2026-04-02  
**対象**: AI研修初級～中級（導入検討者向け）  
**実施時間**: 12分（スライド + 実演）
