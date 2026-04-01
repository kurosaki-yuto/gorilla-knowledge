# AI研修 ツールキット

AI研修の講座動画を自動生成するためのツール一式。
スライド生成、画面録画、ナレーション、動画合成まで全部入り。

## クイックスタート

```bash
# 1. 依存関係インストール
cd _toolkit
npm install
pip3 install edge-tts

# 2. システム依存（Mac）
brew install ffmpeg libreoffice poppler

# 3. Claude Code で講座生成
/create-course-full
```

## ディレクトリ構造

```
AI研修一覧/
├── _toolkit/                    ← ★ ここだけ触ればOK
│   ├── design-system.js         ← デザインシステム（カラー・フォント・レイアウト）
│   ├── slide-generator.js       ← PPTX生成エンジン
│   ├── build-with-demo.py       ← 動画生成（スライド + 実演 + ナレーション → MP4）
│   ├── compose-video.py         ← 複数パート結合ツール
│   ├── review-recording.py      ← 録画品質チェック（Claude Vision）
│   ├── course-example.yaml      ← コース定義サンプル
│   ├── src/                     ← 画面録画（Playwright + TypeScript）
│   │   ├── record-screen.ts     ← シナリオベース画面録画
│   │   ├── login-google.ts      ← Google OAuth 自動ログイン
│   │   ├── manual-login.ts      ← 手動ログイン → セッション保存
│   │   └── utils/               ← AI応答検知・セッション管理
│   ├── scenarios/               ← 操作シナリオ JSON
│   ├── recordings/              ← 録画ファイル（.gitignore）
│   ├── sessions/                ← 認証セッション（.gitignore）
│   ├── package.json
│   └── tsconfig.json
│
├── <題材名>/                    ← 題材ごとのディレクトリ
│   ├── P-01_パート名/
│   │   ├── generate_slides.js   ← スライド生成スクリプト
│   │   ├── narrations.json      ← ナレーションテキスト
│   │   ├── スライド.pptx
│   │   ├── スライド画像/
│   │   ├── 台本.md
│   │   ├── テスト.md
│   │   └── 動画.mp4             ← 完成動画
│   ├── P-02_パート名/
│   └── ...
│
├── .claude/
│   ├── commands/
│   │   ├── create-course.md     ← /create-course（スライド講座）
│   │   └── create-course-full.md ← /create-course-full（実演付き講座）
│   └── skills/
│       └── ai-training-course/SKILL.md ← 生成ルール
```

## 他の人が使うには

### 必要なもの

1. **このリポジトリを clone**
2. **`_toolkit/` の依存関係をインストール**（上記クイックスタート参照）
3. **Claude Code** をインストール（`/create-course-full` コマンドを使うため）

### 新しい講座を作る手順

```bash
# Claude Code で自動生成
/create-course-full

# 聞かれる内容:
# - 題材名（例: ChatGPT）
# - テーマ（例: ChatGPTで業務効率化する方法）
# - パート数（デフォルト5）
# - 実演対象のURL
# - 対象者・レベル
```

### 手動で作る場合

#### Step 1: スライド生成

```bash
# 講座ディレクトリで generate_slides.js を実行
cd <題材名>/P-XX_パート名/
NODE_PATH=$(npm root -g) node generate_slides.js
```

#### Step 2: 画面録画（実演パートがある場合）

```bash
cd _toolkit

# シナリオ JSON を作成
# → scenarios/<name>.json

# 録画実行
npx tsx src/record-screen.ts \
  --scenario scenarios/<name>.json \
  --output recordings/<part>/
```

#### Step 3: 動画生成

```bash
cd _toolkit

# スライドのみ
python3 build-with-demo.py \
  --course-dir ../<題材名>/P-XX_パート名/

# 実演付き
python3 build-with-demo.py \
  --course-dir ../<題材名>/P-XX_パート名/ \
  --demo-slides "5=recordings/<part>/demo.webm"
```

## ツール詳細

### design-system.js — デザインシステム

全スライドの見た目を統一するルール。

| 項目 | 値 |
|------|-----|
| カラー | 白ベース + ネイビー(#1B2A4A) + アクセント青(#2563EB) |
| フォント | Calibri |
| タイトル | 32pt以上 |
| 本文 | 16pt以上 |
| レイアウト | 16:9（1920x1080） |

### build-with-demo.py — 動画生成

メインの動画合成ツール。

```
入力: スライド画像/ + narrations.json + 録画ファイル（任意）
出力: 動画.mp4
```

- ナレーション音声: edge-tts（ja-JP-NanamiNeural）
- 実演スライドでは録画映像にナレーションをオーバーレイ
- 通常スライドではスライド画像にナレーション音声を合成

### record-screen.ts — 画面録画

Playwright で Web サービスの操作を録画。

```json
// scenarios/example.json
{
  "service": "perplexity",
  "url": "https://www.perplexity.ai",
  "viewport": { "width": 1920, "height": 1080 },
  "steps": [
    { "action": "wait", "ms": 3000 },
    { "action": "click", "selector": "#ask-input" },
    { "action": "type", "text": "検索クエリ", "delay": 50 },
    { "action": "press", "key": "Enter" },
    { "action": "waitForAI", "timeout": 60000 },
    { "action": "scroll", "direction": "down", "amount": 500 }
  ]
}
```

## 講座の成果物

各パートに含まれるファイル:

| ファイル | 説明 |
|---------|------|
| `generate_slides.js` | スライド生成スクリプト（再実行可能） |
| `narrations.json` | スライド番号 → ナレーションテキスト |
| `スライド.pptx` | PowerPoint ファイル |
| `スライド画像/` | PNG 画像（動画生成用） |
| `台本.md` | ナレーション台本 |
| `テスト.md` | 確認テスト（5問4択） |
| `動画.mp4` | 完成動画（約10分/パート） |

## 必要環境

- **Node.js** 18+
- **Python** 3.10+
- **FFmpeg**
- **LibreOffice**（PPTX → PNG 変換用）
- **poppler**（PDF → PNG 変換用）
- **npm パッケージ**: pptxgenjs, playwright, tsx, react, react-dom, react-icons, sharp
- **pip パッケージ**: edge-tts
