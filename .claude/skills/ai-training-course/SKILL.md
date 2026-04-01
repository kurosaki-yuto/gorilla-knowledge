---
name: ai-training-course
description: AI研修コースを企画からスライド・動画完成まで一気通貫で生成するスキル。「研修作って」「コース作って」「講座動画作って」で発動。HTMLアニメーション付きスライド + PPTX + ナレーション動画まで全部作る。途中で止めない。
---

# AI研修コンテンツ生成スキル

## 概要

AI研修の講座コンテンツを**企画→台本→スライド→動画**まで一気通貫で生成する。
途中で止めず、最終成果物（PPTX + 動画）まで完走する。
**HTMLスライド（プレゼン.html）は生成しない。PPTXのみ。**

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
④ generate_slides.js を書いて実行（PPTX生成）
⑤ video-generator.py を実行（PPTX→画像→音声→動画）
⑥ 動画.mp4 の生成完了を確認

※ プレゼン.html は生成しない
```

**各Agentへの指示に必ず含める情報:**
- `design-system.js` の全内容（PPTXのカラー・フォント・レイアウト定義）

### 3. 成果物

各チャプターフォルダに:
```
AI-XXX_タイトル/
├── README.md         ← メタデータ・学習目標・修了条件
├── 台本.md           ← ナレーション台本（スライドごと）
├── テスト.md         ← 確認テスト（5問・4択・解説付き）
├── スライド.pptx     ← PPTX（LMS/共有/動画生成用）
├── generate_slides.js ← PPTX生成スクリプト
├── スライド画像/     ← PNGプレビュー
├── 動画.mp4          ← ナレーション付き動画（約10分）
└── narrations.json   ← ナレーションデータ（動画再生成用）
```

## PPTXデザインルール

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
