# AI研修コンテンツ生成テンプレート

## 使い方

### 1. コース定義ファイルを作る

`course.yaml` をコースフォルダに作成：

```yaml
course:
  id: "AI-101"
  title: "AIの基本"
  subtitle: "仕組みと種類を理解する"
  level: "入門"
  target: "全社員"
  duration_per_chapter: "10分"

chapters:
  - id: "AI-101"
    title: "AIの基本 — 仕組みと種類を理解する"
    slides:
      - title: "タイトル"
        type: "title"
        content: "AIの基本"
        subtitle: "仕組みと種類を理解する"

      - title: "今日のゴール"
        type: "goals"
        items:
          - "AIとは何かを一言で説明できる"
          - "AIの3つの種類を区別できる"
          - "自分の業務でAIが使えそうな場面をイメージできる"

      # ... 以下スライド定義が続く

    test:
      pass_rate: 80
      questions:
        - question: "AIを一言で表すと？"
          choices: ["A. 自分の意思で考える技術", "B. 判断をコンピュータにやらせる技術", ...]
          answer: "B"
          explanation: "..."
```

### 2. コマンドで生成

```
/create-course
```

これで以下が自動生成される：
- `台本.md` — ナレーション台本
- `テスト.md` — 確認テスト
- `スライド.pptx` — プレゼン資料
- `スライド画像/` — PNGプレビュー
- `動画.mp4` — ナレーション付き動画

### 3. 複数チャプターの並列生成

コース定義に複数チャプターを書けば、全チャプターが並列で生成される。

## ファイル構成

```
_templates/
├── README.md              ← このファイル
├── design-system.js       ← カラー・フォント・レイアウト定義
├── slide-generator.js     ← スライド生成エンジン（PPTX）
├── video-generator.py     ← 動画生成パイプライン
└── course-example.yaml    ← コース定義のサンプル
```

## 必要ツール

| ツール | 用途 | インストール |
|-------|------|------------|
| Node.js | スライド生成 | `nvm install 22` |
| pptxgenjs | PPTX生成 | `npm install -g pptxgenjs` |
| react-icons | アイコン | `npm install -g react-icons react react-dom sharp` |
| edge-tts | AI音声 | `pip3 install edge-tts` |
| LibreOffice | PDF変換 | `brew install --cask libreoffice` |
| poppler | 画像変換 | `brew install poppler` |
| ffmpeg | 動画結合 | `brew install ffmpeg` |
