# AI研修 動画自動生成パイプライン

AI研修の実演動画付き講座コンテンツを完全自動で生成するツール群。

## 使い方（Claude Codeから）

```
/create-course-full
```

## 手動で使う場合

### 1. セレクタ調査（新しいサービスの実演を作るとき）

```bash
npx tsx src/debug-page.ts https://www.perplexity.ai
npx tsx src/debug-page.ts https://chatgpt.com
npx tsx src/debug-page.ts https://claude.ai
```

→ 入力欄のセレクタが表示される。これをシナリオJSONに使う。

### 2. 操作シナリオ作成

`scenarios/<名前>.json` を作成:

```json
{
  "service": "perplexity",
  "url": "https://www.perplexity.ai",
  "viewport": { "width": 1920, "height": 1080 },
  "steps": [
    { "action": "wait", "ms": 4000 },
    { "action": "click", "selector": "#ask-input" },
    { "action": "type", "text": "質問テキスト", "delay": 65 },
    { "action": "press", "key": "Enter" },
    { "action": "waitForAI", "timeout": 45000, "stableMs": 3000 },
    { "action": "scroll", "direction": "down", "amount": 400 },
    { "action": "wait", "ms": 3000 }
  ]
}
```

### 3. 画面録画

```bash
rm -f sessions/<service>.json  # 古いセッションをクリア
npx tsx src/record-screen.ts --scenario scenarios/<名前>.json --output recordings/<パート>/
```

### 4. 録画のタイムライン確認

```bash
ffmpeg -y -i recordings/<パート>/<ファイル>.webm -vf "fps=1/3" /tmp/frames/%03d.png
```

→ フレームを見て「何秒で何が起きるか」を把握し、ナレーションを書く。

### 5. 実演付き動画合成

```bash
python3 build-with-demo.py \
  --course-dir /path/to/P-02_xxx \
  --demo-slides "5=recordings/p02/basic-search.webm,8=recordings/p02/followup.webm"
```

## ファイル構成

```
_pipeline/
├── README.md                  ← これ
├── package.json               ← Playwright + tsx
├── src/
│   ├── record-screen.ts       ← Playwright画面録画
│   ├── debug-page.ts          ← セレクタ調査ツール
│   └── utils/
│       ├── wait-ai-response.ts ← AI応答完了検知
│       └── browser-session.ts  ← セッション管理
├── build-with-demo.py         ← 実演付き動画合成（汎用版）★メイン
├── build-p02.py               ← P-02専用版（参考実装）
├── compose-video.py           ← 動画結合（スライドのみ版）
├── review-recording.py        ← Claude Vision精査
├── scenarios/                 ← 操作シナリオJSON
├── recordings/                ← 録画ファイル（gitignore）
├── sessions/                  ← Cookie保存（gitignore）
└── .env                       ← APIキー（gitignore）
```

## シナリオのアクション一覧

| アクション | パラメータ | 説明 |
|-----------|-----------|------|
| `click` | `selector`, `description?` | 要素クリック |
| `type` | `text`, `delay?`, `selector?` | テキスト入力 |
| `press` | `key` | キー押下（Enter等） |
| `waitForAI` | `timeout?`, `stableMs?` | AI応答完了待ち |
| `wait` | `ms` | 指定時間待機 |
| `scroll` | `direction`, `amount` | スクロール |
| `screenshot` | `path` | スクリーンショット |
| `highlight` | `selector`, `duration?` | 赤枠ハイライト |
| `goto` | `url` | URL移動 |

## 必要ツール

- Node.js + npm
- Python 3 + edge-tts + anthropic
- Playwright（`npx playwright install chromium`）
- FFmpeg + ffprobe
- LibreOffice（PPTX→画像変換用）
- pdftoppm（poppler）
