# AI研修コース生成（実演動画付き・完全自動版）

テーマを聞いて、最新情報をリサーチして、台本→スライド→実演録画→動画まで完全自動で作る。
`_toolkit/` ディレクトリのツール群を使う。

---

## Step 0: テーマ確認

ユーザーに聞く:
1. **題材名**: トップディレクトリ名になる（例: Perplexity, ChatGPT, Notion）
2. **テーマ**: 何についての研修か
3. **パート数**: デフォルト5
4. **実演対象サービスのURL**: 実演で操作するサービス
5. **対象者・レベル**: 誰向け・入門/実践/応用

**ディレクトリは `黒崎/AI研修一覧/<題材名>/P-XX_パート名/` に作成する。**

## Step 1: 最新情報リサーチ（★絶対に飛ばすな）

**WebSearchで対象テーマの最新情報を徹底的に調べる。**

調べること:
- サービスの最新機能・アップデート（2025-2026年）
- 料金プラン・制限
- ユーザー数・市場規模
- 競合との違い
- 企業導入事例

リサーチ結果を `_toolkit/<テーマ名>-latest.md` に保存する。
**古い知識で台本を書くな。必ずリサーチしてから書け。**

## Step 2: パート構成を決める

各パートの構成案を作ってユーザーに提示:
```
Part 1: ○○とは？（スライド説明のみ）〜12分
Part 2: 基本操作（スライド＋実演）〜12分
Part 3: 応用テクニック（スライド＋実演）〜12分
Part 4: 比較・考察（スライド説明のみ）〜12分
Part 5: 業務活用（スライド＋実演）〜12分
```

**実演パートには「実演で何を操作して何を見せるか」を明記する。**

## Step 3: 実演録画（先にやる）

実演パートの録画を先に撮る。録画の尺が台本のベースになるから。

### 3-1. シナリオJSON作成
各実演パートの操作手順を `_toolkit/scenarios/<name>.json` に書く。

シナリオ作成のルール:
- 最初に `wait` 4000ms（ページ読み込み完了待ち。白画面を見せるな）
- タイピングは `delay: 65` 前後（人間っぽい速度）
- 送信後に `waitForAI`（AI応答完了検知）
- 回答表示後に `wait` 3000ms（回答を見せる間）
- スクロールの間に `wait` 2000〜3000ms（視聴者が読む時間）
- **各サービスの入力欄セレクタは事前に `debug-page.ts` で確認すること**

```bash
# セレクタ確認
cd 黒崎/AI研修一覧/_pipeline
npx tsx src/debug-page.ts  # ← URLを変えて使う
```

### 3-2. 録画実行
```bash
cd 黒崎/AI研修一覧/_pipeline
rm -f sessions/<service>.json  # 古いセッションをクリア
npx tsx src/record-screen.ts --scenario scenarios/<name>.json --output recordings/<part>/
```

ログインが必要な場合はユーザーに通知。

### 3-3. 録画のタイムライン確認
```bash
# フレーム抽出して内容確認
ffmpeg -y -i recordings/<part>/<file>.webm -vf "fps=1/3" /tmp/frames/<name>_%03d.png
```
抽出したフレームを見て、何秒で何が起きているかメモする。

## Step 4: 各パートのコンテンツ生成（並列実行）

Agent で各パートを並列生成。**各Agentに以下を必ず渡す:**

1. `_toolkit/<テーマ名>-latest.md` の最新情報全文
2. スライドのデザインルール（下記テンプレート参照）
3. 実演パートの場合: 録画のタイムライン情報

### スライドのみパート → 各Agentに指示:
```
① README.md 生成
② 台本.md 生成（最新情報を使え）
③ テスト.md 生成（5問4択）
④ narrations.json 生成
⑤ generate_slides.js 書いて実行 → スライド.pptx
⑥ video-generator.py 実行 → 動画.mp4
```

※ プレゼン.html は生成しない。PPTXのみ。

### 実演ありパート → 各Agentに指示:
```
①〜④ は同上
⑤ generate_slides.js 書いて実行 → スライド.pptx
⑥ 実演スライドのナレーションは録画タイムラインに完全同期させる
   - 録画の尺（例: 33秒）に合わせたナレーションを書く
   - 「今画面で〜しています」のように画面実況するナレーション
⑧ build スクリプトで実演込み動画を生成:
   python3 _toolkit/build-with-demo.py \
     --course-dir <パートディレクトリ> \
     --demo-slides "5=recordings/<part>/<file>.webm,8=recordings/<part>/<file2>.webm" \
     --narrations narrations.json
```

## Step 5: 確認

- 各パートの動画ファイルサイズ・尺を表示
- 実演部分のナレーションが画面と同期しているか確認
- ユーザーに確認を促す

---

## 必読スキルファイル（生成前に必ず読む）

- `@黒崎/AI研修一覧/_toolkit/design-system.js` — PPTXのデザインルール（カラー・フォント・レイアウト）
- `@.claude/skills/ai-training-course/SKILL.md` — 生成ルール（台本・テスト・動画の仕様）

※ frontend-slides（HTML）関連のスキルは読まなくてよい。PPTXのみ生成する。

## シナリオJSONアクション一覧

| アクション | 説明 |
|-----------|------|
| `click` | `selector` の要素をクリック |
| `type` | テキスト入力（`delay` でタイピング速度調整） |
| `press` | キー押下（Enter等） |
| `waitForAI` | AI応答完了を検知（DOM安定化待ち） |
| `wait` | 指定ミリ秒待機 |
| `scroll` | `direction` + `amount` でスクロール |
| `screenshot` | スクリーンショット保存 |
| `highlight` | 要素を赤枠ハイライト |
| `goto` | URL移動 |

## パイプラインツール

```
黒崎/AI研修一覧/_toolkit/
├── src/record-screen.ts      # Playwright画面録画
├── src/utils/
│   ├── wait-ai-response.ts   # AI応答完了検知
│   └── browser-session.ts    # セッション管理
├── build-p02.py              # 実演込み動画合成（参考実装）
├── compose-video.py          # 動画結合
├── review-recording.py       # Claude Vision精査
└── scenarios/                # 操作シナリオ
```

## 出力ディレクトリ構成

**必ず題材名のディレクトリを先に作り、その下にパートディレクトリを配置する。**

```
黒崎/AI研修一覧/
├── <題材名>/                 ← 題材ごとのトップディレクトリ（例: Perplexity/）
│   ├── P-01_パート名/
│   │   ├── README.md
│   │   ├── 台本.md
│   │   ├── テスト.md
│   │   ├── narrations.json
│   │   ├── generate_slides.js
│   │   ├── スライド.pptx
│   │   ├── スライド画像/
│   │   └── 動画.mp4          ← 実演込み完成動画
│   ├── P-02_パート名/
│   └── ...
└── _toolkit/                ← 共有ツール群（テーマ問わず使い回す）
```

例: Perplexityの講座なら `黒崎/AI研修一覧/Perplexity/P-01_なぜ今Perplexityなのか/`
