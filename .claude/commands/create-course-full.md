# AI研修コース生成（実演動画付き・完全自動版）

## やること

ユーザーの要望に基づき、AI研修の講座コンテンツを**企画→台本→スライド→実演録画→動画まで完全自動で**生成する。
従来の `/create-course` に加え、**ブラウザ実演の自動録画**を含む。
1時間の大きな講義を5パートに分割して、各パートを処理する。

## 手順

### Step 1: 企画（ユーザーと確認）

以下をユーザーに確認:

1. **テーマ**: 何についての研修か（例: 「Perplexityで情報検索する方法」）
2. **パート数**: いくつに分けるか（デフォルト5パート）
3. **総尺**: 何分の講義か（デフォルト60分）
4. **実演対象サービス**: どのAIツールを実演するか（Perplexity / ChatGPT / Claude等）
5. **対象者**: 誰向けか
6. **レベル**: 入門/実践/応用

確認したら、各パートの構成案を提示:
```
Part 1: 〇〇とは？（スライド説明のみ）〜12分
Part 2: 基本的な使い方（スライド＋実演）〜12分
Part 3: 応用テクニック（スライド＋実演）〜12分
Part 4: 比較・考察（スライド説明のみ）〜12分
Part 5: 活用事例（スライド＋実演）〜12分
```

### Step 2: 台本生成

1時間分の大きな台本を1本生成する。台本には以下を含める:

- パート分割情報（Part 1〜5）
- 各パートのスライド構成（各パート3〜4枚）
- ナレーション原稿
- **実演パートの操作手順**（どのサービスで何を入力して何を見せるか）
- 学習目標

台本を `台本.md` に保存。

### Step 3: パートごとに生成（並列実行可能）

各パートを Agent で並列処理:

#### スライドのみのパート:
1. `narrations.json` 生成
2. `プレゼン.html` 生成（既存のfrontend-slidesスキル使用）
3. `generate_slides.js` 実行 → `スライド.pptx`
4. `video-generator.py` 実行 → パート動画

#### 実演ありのパート:
1〜4 は同上に加え:
5. **操作シナリオJSON生成** — 台本の操作手順から `scenarios/<name>.json` を作成
6. **画面録画実行**:
   ```bash
   cd 黒崎/AI研修一覧/_pipeline
   npx tsx src/record-screen.ts --scenario scenarios/<name>.json --output recordings/
   ```
   ※ ログインが必要な場合はユーザーに通知して手動ログインを依頼
7. **録画精査**:
   ```bash
   python3 review-recording.py --recording recordings/<file>.webm --script ../台本.md
   ```
   NG → シナリオ修正して再録画（最大3回）

### Step 4: 動画結合

全パートの動画を結合:
```bash
cd 黒崎/AI研修一覧/_pipeline
python3 compose-video.py \
  --parts ../Part1/動画.mp4 ../Part2/動画.mp4 ../Part3/動画.mp4 ../Part4/動画.mp4 ../Part5/動画.mp4 \
  --output ../完成動画.mp4
```

### Step 5: 確認

- 完成動画のファイルサイズ・尺を表示
- ユーザーに確認を促す
- 問題なければコミット

## 必読スキルファイル

生成前に **必ず全て読む**:
- `@黒崎/AI研修一覧/_templates/design-system.js` — デザインシステム
- `@.claude/skills/ai-training-course/SKILL.md` — 生成ルール
- `@黒崎/AI研修一覧/_templates/frontend-slides/SKILL.md` — HTMLスライドのデザイン原則
- `@黒崎/AI研修一覧/_templates/frontend-slides/STYLE_PRESETS.md` — テーマ定義
- `@黒崎/AI研修一覧/_templates/frontend-slides/viewport-base.css` — レスポンシブCSS基盤
- `@黒崎/AI研修一覧/_templates/frontend-slides/html-template.md` — HTML構造テンプレート
- `@黒崎/AI研修一覧/_templates/frontend-slides/animation-patterns.md` — アニメーションパターン

## シナリオJSON仕様

操作シナリオは以下の形式:
```json
{
  "service": "perplexity",
  "url": "https://www.perplexity.ai",
  "viewport": { "width": 1920, "height": 1080 },
  "steps": [
    { "action": "wait", "ms": 2000 },
    { "action": "click", "selector": "textarea", "description": "入力欄クリック" },
    { "action": "type", "text": "検索テキスト", "delay": 60 },
    { "action": "press", "key": "Enter" },
    { "action": "waitForAI", "timeout": 45000, "stableMs": 3000 },
    { "action": "scroll", "direction": "down", "amount": 400 },
    { "action": "wait", "ms": 2000 },
    { "action": "highlight", "selector": ".result", "duration": 2000 },
    { "action": "screenshot", "path": "screenshots/result.png" }
  ]
}
```

対応アクション: click, type, press, waitForAI, wait, scroll, screenshot, highlight, goto

## 出力先

```
黒崎/AI研修一覧/
├── AI-XXX_テーマ名/
│   ├── 台本.md
│   ├── テスト.md
│   ├── Part1/
│   │   ├── プレゼン.html
│   │   ├── スライド.pptx
│   │   ├── narrations.json
│   │   └── 動画.mp4
│   ├── Part2/
│   │   ├── ...（+ recordings/）
│   ├── ...
│   └── 完成動画.mp4        ← 全パート結合版
└── _pipeline/               ← パイプラインツール群
```
