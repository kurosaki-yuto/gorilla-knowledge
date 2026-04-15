# LLM比較・選び方

## 概要
Claude、ChatGPT、Geminiなど主要LLMの特徴比較と用途別の選び方をまとめたナレッジ。各モデルの強み・弱みを把握し、タスクに応じた最適なLLMを選択するための指針。

## 主要LLM比較

| LLM | 提供元 | 強み | 弱み | 最適な用途 |
|-----|--------|------|------|-----------|
| Claude (Opus/Sonnet/Haiku) | Anthropic | 長文理解、コード生成、指示遵守、日本語品質 | 画像生成不可（単体） | 開発、文書作成、分析 |
| ChatGPT (GPT-4o/o1) | OpenAI | 汎用性、プラグイン、画像生成(DALL-E)、検索連携 | 長文で精度低下の場合あり | 汎用タスク、画像生成、リサーチ |
| Gemini (Pro/Ultra) | Google | マルチモーダル、Google連携、長いコンテキスト | 日本語がやや弱い場合あり | Google Workspace連携、動画理解 |
| DeepSeek | DeepSeek | 推論特化、オープンソース、コスト低 | エコシステム未成熟 | 推論タスク、コスト重視の用途 |
| Llama 3.1 | Meta | オープンソース、カスタマイズ自由 | セルフホスト必要 | ローカル運用、プライバシー重視 |

## 用途別おすすめ

### コーディング
- **1位**: Claude Code（CLIベースの自律開発、Skills対応）
- **2位**: Cursor + Claude/GPT-4（IDE統合型）
- **3位**: GitHub Copilot（補完特化）

### 文章作成・翻訳
- **Claude**: 日本語の自然さ、長文の一貫性が高い
- **ChatGPT**: テンプレ的な出力が得意、Custom GPTで特化可能

### 画像・動画生成
- **ChatGPT (DALL-E 3)**: テキストから画像生成
- **Gemini (Imagen)**: Google品質の画像生成
- **Grok**: リアルタイム情報 + 画像生成

### ビジネス活用
- **Claude**: 事業計画書、契約書分析、コード監査
- **ChatGPT**: 汎用ビジネスタスク、プレゼン作成
- **Gemini**: Google Workspace統合、メール・スプレッドシート連携

## 選び方のポイント

### タスクの性質で選ぶ
- **正確性重視** → Claude（指示遵守率が高い）
- **汎用性重視** → ChatGPT（プラグイン・GPTsエコシステム）
- **Google連携** → Gemini（Workspace統合）
- **コスト重視** → DeepSeek / Llama（オープンソース）

### 組み合わせ活用
- 1つのLLMに固執せず、タスクに応じて使い分けるのが最適解
- 出典: @SuguruKun_ai, @shota7180 等の複数ブックマークで共通見解

## 2026年3月追加分

### Qwen 3.5 Small（Alibaba）
- **9Bパラメータで120Bモデルを凌駕**する驚異的な性能。Apache 2.0ライセンス
- 4モデル同時公開（9B/1.5B他）、マルチモーダル対応
- **ラズパイ5で秒間5-6トークン**で実用的に動作 → エッジAIの可能性
- 家庭用GPUでも動作可能、ローカルLLMの新たな選択肢
- 出典: @masahirochaen, @ai_hakase_ (複数ツイート)

### Gemma（Google / ローカルLLM）
- M4 MacBook Airで軽量ローカルLLM gemmaを使ったCLIチャットアプリが動作確認
- 出典: @Mathmeganekun

| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @masahirochaen | 2026/3/3 | Alibaba「Qwen 3.5 Small」4モデル公開、9Bが120B凌駕 | https://x.com/masahirochaen/status/2028954595981181055 |
| @ai_hakase_ | 2026/3/3 | Qwen3.5-9Bが90億パラメータで巨大モデルを凌駕 | https://x.com/ai_hakase_/status/2028742682269376555 |
| @ai_hakase_ | 2026/3/3 | 最強ローカルAI「Qwen 3.5 Small」の紹介動画 | https://x.com/ai_hakase_/status/2028730595476439252 |
| @ai_hakase_ | 2026/3/5 | ラズパイ5でQwen3.5が秒間5-6トークンで実用動作 | https://x.com/ai_hakase_/status/2029467719876182224 |
| @Mathmeganekun | 2026/2/28 | 軽量ローカルLLM gemmaでCLIチャットアプリ動作確認 | https://x.com/Mathmeganekun/status/2027867218391011487 |

## 参考
- 各LLMの詳細は個別ファイル（Claude.md, ChatGPT.md, Gemini.md）を参照
