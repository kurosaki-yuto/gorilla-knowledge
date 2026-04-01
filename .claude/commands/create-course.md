# AI研修コース生成

## やること

ユーザーの要望に基づき、AI研修の講座コンテンツを**企画→台本→スライド→動画まで一気通貫で**生成する。
途中で止めない。最終成果物（HTMLスライド + PPTX + 動画.mp4）まで完走する。

## 手順

### Step 1: 企画（ユーザーと確認）

以下をユーザーに確認:

1. **題材名**: トップディレクトリ名になる（例: AI基礎, ChatGPT, Notion）
2. **テーマ**: 何についての研修か
3. **チャプター数**: 何本に分けるか（各10分）
4. **対象者**: 誰向けか（全社員/選抜/管理者）
5. **レベル**: 入門/実践/応用

**ディレクトリは `黒崎/AI研修一覧/<題材名>/` の下にチャプターを作成する。**

確認したら、各チャプターの構成案（タイトル + 学習目標3つ + スライド12枚の構成）を提示して承認を得る。

### Step 2: 生成（並列実行）

スキルファイルを **必ず全て読む**:
- `@黒崎/AI研修一覧/_toolkit/design-system.js` — デザインシステム
- `@.claude/skills/ai-training-course/SKILL.md` — 生成ルール
- `@黒崎/AI研修一覧/_toolkit/frontend-slides/SKILL.md` — HTMLスライドのデザイン原則
- `@黒崎/AI研修一覧/_toolkit/frontend-slides/STYLE_PRESETS.md` — テーマ定義（Notebook Tabs使用）
- `@黒崎/AI研修一覧/_toolkit/frontend-slides/viewport-base.css` — レスポンシブCSS基盤
- `@黒崎/AI研修一覧/_toolkit/frontend-slides/html-template.md` — HTML構造テンプレート
- `@黒崎/AI研修一覧/_toolkit/frontend-slides/animation-patterns.md` — アニメーションパターン

承認後、各チャプターを **並列で** Agent を使って生成する:

```
各Agentに渡す指示:

1. `黒崎/AI研修一覧/<題材名>/AI-XXX_タイトル/` フォルダを作成
2. README.md を生成（メタデータ・学習目標・修了条件）
3. 台本.md を生成（12スライド分のナレーション台本）
4. テスト.md を生成（5問・4択・解説付き）
5. narrations.json を生成（スライド番号→ナレーションテキスト）
6. プレゼン.html を生成（★ frontend-slides方式、Notebook Tabsテーマ）
7. generate_slides.js を書いて実行（PPTX版、design-system.js のルールに従う）
8. video-generator.py を実行して動画生成
```

**重要**: 各 Agent には以下を **全て** 明示的に伝える:
- design-system.js の全内容（カラー・フォント・レイアウト定義）
- SKILL.md のデザインルール
- frontend-slides の SKILL.md + STYLE_PRESETS.md + viewport-base.css + html-template.md + animation-patterns.md の全内容
- 既存のAI-101のgenerate_slides_v3.jsをリファレンスとして参照させる

### Step 3: 確認

全チャプターの生成完了後:
- プレゼン.html をブラウザで開いてユーザーに見せる
- スライド画像もユーザーに見せる
- 問題なければコミット&プッシュ

## 出力先

**必ず題材名のディレクトリを先に作り、その下にチャプターを配置する。**

```
黒崎/AI研修一覧/
├── _toolkit/                ← テンプレート（変更しない）
├── <題材名>/                  ← 題材ごとのトップディレクトリ（例: AI基礎/）
│   ├── AI-101_AIの基本/       ← チャプター1
│   │   ├── スライド.pptx
│   │   └── ...
│   ├── AI-102_生成AI/         ← チャプター2
│   └── AI-103_プロンプト/     ← チャプター3
├── <別の題材名>/              ← 別の題材
│   └── ...
└── _pipeline/                 ← 共有ツール群
```

例: AI基礎の講座なら `黒崎/AI研修一覧/AI基礎/AI-101_AIの基本/`
