---
name: ai-training-course
description: AI研修コースを企画からスライド・動画完成まで一気通貫で生成するスキル。「研修作って」「コース作って」「講座動画作って」で発動。HTMLアニメーション付きスライド + PPTX + ナレーション動画まで全部作る。途中で止めない。
---

# AI研修コンテンツ生成スキル

## 概要

AI研修の講座コンテンツを**企画→台本→スライド→動画**まで一気通貫でNotebookLM品質で生成する。
途中で止めず、最終成果物（HTMLスライド + PPTX + 動画）まで完走する。

## テンプレートの場所

```
黒崎/AI研修一覧/_templates/
├── README.md              ← 使い方
├── design-system.js       ← デザインシステム（カラー・フォント・レイアウト）
├── video-generator.py     ← 動画生成パイプライン
├── course-example.yaml    ← コース定義サンプル
└── frontend-slides/       ← HTMLスライドのデザインテンプレート（誰でも使える）
    ├── SKILL.md           ← デザイン原則・ワークフロー
    ├── STYLE_PRESETS.md   ← 12テーマ定義（Notebook Tabs推奨）
    ├── viewport-base.css  ← レスポンシブ基盤CSS（全プレゼンにインクルード）
    ├── html-template.md   ← HTML構造テンプレート
    ├── animation-patterns.md ← アニメーション辞典
    └── scripts/           ← PPTX変換・デプロイ・PDF出力
```

## 生成フロー

### 1. 企画フェーズ（ユーザーと対話）

ユーザーの要望から以下を決定:
- コースID・タイトル
- 何本に分けるか（各10分）
- 各チャプターの学習目標
- スライド構成（12枚/チャプター）

### 2. 生成フェーズ（並列実行 → スライド+動画まで完走）

各チャプターについて、以下を **並列で** Agent で生成する。
**全ステップを1つのAgentで最後まで実行する。途中で止めない。**

```
各Agent の実行ステップ（全て完了するまで止めない）:

① 台本.md 生成（12スライド分のナレーション）
② テスト.md 生成（5問・4択・解説付き）
③ narrations.json 生成（スライド番号→ナレーション）
④ プレゼン.html 生成（frontend-slides方式、Notebook Tabsテーマ）
⑤ generate_slides.js を書いて実行（PPTX版）
⑥ video-generator.py を実行（PPTX→画像→音声→動画）
⑦ 動画.mp4 の生成完了を確認
```

**各Agentへの指示に必ず含める情報:**
- `design-system.js` の全内容
- `黒崎/AI研修一覧/_templates/frontend-slides/SKILL.md` のデザイン原則
- `黒崎/AI研修一覧/_templates/frontend-slides/STYLE_PRESETS.md` の Notebook Tabs テーマ定義
- `黒崎/AI研修一覧/_templates/frontend-slides/viewport-base.css` の全内容
- `黒崎/AI研修一覧/_templates/frontend-slides/html-template.md` のHTML構造
- `黒崎/AI研修一覧/_templates/frontend-slides/animation-patterns.md` のアニメーションパターン

### 3. 成果物

各チャプターフォルダに:
```
AI-XXX_タイトル/
├── README.md         ← メタデータ・学習目標・修了条件
├── 台本.md           ← ナレーション台本（スライドごと）
├── テスト.md         ← 確認テスト（5問・4択・解説付き）
├── プレゼン.html     ← ★ HTMLアニメーション付きプレゼン（メイン成果物）
├── スライド.pptx     ← PPTX版（LMS/共有用）
├── スライド画像/     ← PNGプレビュー
├── 動画.mp4          ← ナレーション付き動画（約10分）
└── narrations.json   ← ナレーションデータ（動画再生成用）
```

## HTMLスライドのデザインルール（最重要）

### 基本方針
HTMLスライドは `.claude/skills/frontend-slides/` のスキルに従って生成する。
**必ずスキルファイルを読んでから生成すること。**

### テーマ: Notebook Tabs（デフォルト）
NotebookLM風の洗練されたデザイン。以下を固定値で使用:

```css
:root {
  /* カラー — Notebook Tabs テーマ */
  --bg-outer: #2d2d2d;
  --bg-page: #f8f6f1;
  --text-primary: #1a1a1a;
  --text-secondary: #555;
  --accent: #2563EB;       /* 既存design-systemと統一 */
  --tab-1: #98d4bb;        /* Mint */
  --tab-2: #c7b8ea;        /* Lavender */
  --tab-3: #f4b8c5;        /* Pink */
  --tab-4: #a8d8ea;        /* Sky */
  --tab-5: #ffe6a7;        /* Cream */

  /* フォント */
  --font-display: 'Bodoni Moda', serif;
  --font-body: 'DM Sans', sans-serif;

  /* サイズ — clamp()で固定（ブレさせない） */
  --title-size: clamp(2rem, 5vw, 3.5rem);
  --h2-size: clamp(1.25rem, 3vw, 2rem);
  --body-size: clamp(0.8rem, 1.3vw, 1rem);
  --slide-padding: clamp(1.5rem, 4vw, 3.5rem);
}
```

### デザイン絶対ルール
1. **100vh厳守** — 全スライドがビューポート内に収まる。スクロール禁止
2. **1スライド1メッセージ** — 情報を詰め込まない
3. **viewport-base.css を完全インクルード** — レスポンシブ基盤
4. **アニメーション** — フェードイン+スライドアップ（`.reveal` クラス）をデフォルト使用
5. **カード型レイアウト** — コンテンツはカード/ブロックで構造化
6. **タブナビゲーション** — 右端にセクションタブ（色分け）
7. **余白** — padding最低clamp(1.5rem, 4vw, 3.5rem)。詰めない
8. **フッター** — スライド番号 + コースID
9. **サンドイッチ構造** — タイトル（ネイビー背景）→ コンテンツ（Notebook Tabs）→ エンド（ネイビー背景）

### 禁止事項（AIスロップ回避）
- Inter, Roboto, Arial, system fonts の使用
- 紫グラデーション on 白背景
- 全てセンター揃えの均一レイアウト
- 意味のない装飾的イラスト
- グラスモーフィズムの乱用
- タイトル下のアクセントライン（AI臭い）

## PPTXデザインルール（従来通り）

### スライドデザイン
- **白ベース** + ネイビーのタイトル/エンドスライド（サンドイッチ構造）
- フォント: **Calibri**（コンサル標準）
- 本文 **16pt以上**、タイトル **32pt以上**
- カラー: 1色アクセント（青 #2563EB）+ セマンティックカラー（緑/黄/赤）のみ
- 余白たっぷり、装飾なし
- レイアウトにバリエーション（テーブル/カード/フロー図/2x2グリッド）
- フッターにスライド番号とコースID
- トップに細いアクセントバー（ブランド統一）

### 台本
- 1スライドあたり30〜60秒のナレーション
- 読み上げ速度300文字/分で計算
- 総尺10分（±1分）に収める
- 専門用語は必ず平易な言い換えを添える

### テスト
- 5問・4択・正解は1つ
- 合格基準80%（4問正解）
- 各問題に解説付き
- LMS登録用の正解一覧表を末尾に

### 動画
- AI音声: edge-tts（ja-JP-NanamiNeural）
- スライド画像 + 音声 → ffmpegで結合
- 1920x1080、AAC 192kbps

## スライド生成方法

### HTMLスライド（メイン）
frontend-slidesスキルの手順に従って単一HTMLファイルを生成。
`黒崎/AI研修一覧/_templates/frontend-slides/SKILL.md` を必ず読むこと。

### PPTX（併用）
`design-system.js` の COLORS, FONTS, LAYOUT を import して使う。
PptxGenJS でスライドを生成。

実行方法:
```bash
NODE_PATH=$(npm root -g) node generate_slides.js
```

## 動画生成コマンド

```bash
python3 _templates/video-generator.py <コースフォルダ> <narrations.json>
```

## 必要ツール

- Node.js + pptxgenjs + react-icons + react + react-dom + sharp
- Python3 + edge-tts
- LibreOffice + poppler + ffmpeg
