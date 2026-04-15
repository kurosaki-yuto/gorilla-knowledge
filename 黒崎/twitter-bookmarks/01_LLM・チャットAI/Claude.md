# Claude（Anthropic）

## 概要
Anthropicが開発するLLM「Claude」に関するブックマーク集。Claude Code（CLI開発ツール）、Artifacts、MCP連携、Skills、Agent SDKなど、Claudeエコシステム全体の活用法・最新情報・開発Tipsを網羅している。2024年6月から2026年2月までの49件のツイートを収録。

## ツール・サービス
| 名前 | 概要 | URL |
|------|------|-----|
| Claude Code | Anthropic公式CLI開発ツール。ターミナルからAI駆動開発が可能 | https://claude.ai |
| Claude Desktop | デスクトップアプリ版。Claude Code統合やMCP連携に対応 | https://claude.ai/download |
| Claude Agent SDK | カスタムエージェント構築用SDK。1Mコンテキスト、サンドボックス対応 | - |
| Claude Skills | チーム全体で共通の思考手順を配布・再利用できる仕組み | - |
| Claude Plugins | Claude Code公式プラグイン（29個）。自動アップデート対応 | - |
| SuperClaude v3.0 | Claude Codeの能力を拡張するフレームワーク | - |
| Claude Harness | Plan→Work→Reviewの循環でAI開発品質を担保するプラグイン | - |
| 天秤AI | GPT-4o、Gemini、Claude、Perplexityを同時比較できる無料ツール | - |
| Anthropic Workbench | 新モデルをいち早く試せるAnthropic公式ツール | - |
| Claude Code公式コース | Anthropic提供の無料Claude Codeコース | - |

## 知見・ナレッジ

### Claude Code 開発のベストプラクティス
- Claude Code作成者Boris氏のセットアップチートシート: Claudeを5〜10並列稼働、Plan Mode→Auto-acceptで1shot実装、重い処理のみOpus 4.5を使用
- 個人開発フロー: MAXプラン契約→Claude Code→マルチディスプレイ→要件定義から任せる→テストを先に書かせる→GitHubで管理
- 仕様ベース開発: 最小限の仕様を入力→AskUserQuestionToolでインタビュー→詳細な仕様書を自動生成→新セッションで実装
- CLAUDE.mdファイルで開発能力を10倍に: Workflow/Subagent/自己改善ループ/検証/自律バグ修正を網羅した構造化ファイル
- 出典: @AiAircle34052 (https://x.com/AiAircle34052/status/2009751284480651712), @_nogu66 (https://x.com/_nogu66/status/2005645420744318984), @masahirochaen (https://x.com/masahirochaen/status/2025423179578311048)

### Claude Code 並列実行・自律運行
- tmuxでClaude Code MaxプランによるAI組織を並列動作させるローカル環境の構築が可能（Claude-Code-Communicationリポジトリ活用）
- Anthropicが16体のClaude Codeチームを並列稼動させてCコンパイラを自律構築した事例を公開。長時間自律動作のための実践Tips集
- --dangerously-skip-permissions モード: Claude Code Desktopで完全自律動作（承認不要）が可能に
- 出典: @akira_papa_IT (https://x.com/akira_papa_IT/status/1932547492199182733), @__SatoshiSsSs__ (https://x.com/__SatoshiSsSs__/status/2020145601678303607), @tetumemo (https://x.com/tetumemo/status/2021180397824938048)

### Claude Skills の活用
- Skillsはチームや企業全体で「共通の思考手順」を配布できる仕組み。個人向けのカスタムコマンドとは異なる位置づけ
- Anthropic公式リポジトリにコピペ可能なSkill一覧が全公開されている
- Skills作成のベストプラクティス: 簡潔さが鍵。会話履歴とコンテキストを共有するため冗長にしない
- Skillsの強化ライフサイクル: Claude Aで通常タスク実行→スキル作成→Claude Bでスキル適用→問題があれば反復改善
- 確度を求めるならasset、reference、evaluationが必須。チーム利用にはSDKやClaude -pも必要
- 「スタイル」機能で自分のクローン的な応答パターンを設定可能
- 出典: @furoku (https://x.com/furoku/status/1979195035670450692), @tetumemo (https://x.com/tetumemo/status/1979344864325284264), @suna_gaku (https://x.com/suna_gaku/status/2004130495450567034), @_nogu66 (https://x.com/_nogu66/status/1990007862345802056)

### Claude Code プラグイン・拡張
- 公式プラグイン（claude-plugins-official）29個が自動インストール・自動アップデート対応に
- フロントエンドデザイン用プラグイン: `/plugin marketplace add anthropics/claude-code` でインストール可能
- Design Skillsプラグインでフロントエンドデザインの品質が大幅向上
- GLM 4.6コーディングプランとClaude Codeの連携設定方法
- /compact にカスタム指示を追加可能（重要な詳細の保持に有効）
- 出典: @oikon48 (https://x.com/oikon48/status/2000749874128806060), @trq212 (https://x.com/trq212/status/1993786552233939042), @dani_avila7 (https://x.com/dani_avila7/status/1993797396241723505)

### Claude Agent SDK
- Anthropicが3つのアップデートを発表: 1Mコンテキストウィンドウ対応、サンドボックス機能、TypeScriptインターフェースV2
- Anthropicエンジニアによる2時間ワークショップが公開。Claude Codeの開発経験に基づくエージェント構築の設計思想と実践Tips
- 出典: @claudeai (https://x.com/claudeai/status/1998446342583050262), @Ka888aa (https://x.com/Ka888aa/status/2008340819090997424)

### MCP（Model Context Protocol）連携
- Claude Desktop + BraveSearch API + MCPでウェブ検索機能を搭載可能
- Claude MCP + Perplexity MCP連携でDeep Research級の調査が可能（141のWeb調査、37,000文字のレポートを一発生成）
- Claudeにウェブ検索機能が標準搭載され、DeepResearchの月3万円課金が不要に
- 出典: @masahirochaen (https://x.com/masahirochaen/status/1862784425085579334), @tetumemo (https://x.com/tetumemo/status/1901076005911159044), @masahirochaen (https://x.com/masahirochaen/status/1900006184549245306)

### Claude Artifacts 活用
- 「SPAでお願いします」と指示するだけでリッチなUIが完成
- marp形式でスライド作成: Claudeで出力→marp.appに貼り付けでスライド完成
- 無料でClaude 3.5 Sonnet Artifacts相当が使えるオープンソースツール（Python data analyst、Next.js developer、Streamlit developer対応、Vercelへワンクリックデプロイ可能）
- 出典: @yoshi8__ (https://x.com/yoshi8__/status/1806578757098221939), @yoshi8__ (https://x.com/yoshi8__/status/1807163132969971955), @masahirochaen (https://x.com/masahirochaen/status/1819858835173224862)

### Claude Desktop アップデート
- Claude Desktop経由でClaude Codeがローカルファイルに直接アクセス可能に（ターミナル不要）
- Claude for Excel: 数式作成やテーブル整形を高精度で実行。Chrome操作も全ユーザーにリリース
- コンピューター操作・iPhone制御が可能に
- 出典: @AiAircle34052 (https://x.com/AiAircle34052/status/2008816984671351200), @yusuke_m_MU (https://x.com/yusuke_m_MU/status/1993146282232496232), @CodeByPoonam (https://x.com/CodeByPoonam/status/1862151895626006704)

### Claude Code 環境変数
- 40以上の環境変数が存在（認証、モデル、パフォーマンス、クラウド関連）
- CLAUDE_CODE_EXIT_AFTER_STOP_DELAY: アイドル後にSDKモードを自動終了。CI/CD・自動化ワークフローに有用
- 出典: @dani_avila7 (https://x.com/dani_avila7/status/1986826412985082305)

### Anthropic ビジネス・教育動向
- Claude for Education: 大学向け、対話型学習モード搭載、キャンパスアンバサダー制度、学生向けAPIクレジット提供
- Anthropicがサードパーティツール（OpenCode、Clawdbot等）をBAN。食べ放題ビュッフェ問題（公式は速度制限あり、サードパーティは制限回避）が背景
- Anthropic社長のオープンソース見解: 実態は「オープンウェイト」であり、パラメータ公開だけでは技術発展の好循環が働かない
- Kali LinuxがClaude Desktop GUI + Anthropic Sonnet LLMとの連携手法を公開
- 出典: @taiyo_ai_gakuse (https://x.com/taiyo_ai_gakuse/status/1907454432255819837), @AI_masaou (https://x.com/AI_masaou/status/2009784056515571795), @tamuramble (https://x.com/tamuramble/status/1984801045734965410)

### AI活用ワークフロー（Claude含む複合利用）
- スライド作成: Gensparkで情報検索→PlusAIでスライド生成→Claude 3.5 Sonnetで図解補強
- 生成AIアニメ制作: Claude/ChatGPTでストーリー作成→他ツールで映像化
- 出典: @SuguruKun_ai (https://x.com/SuguruKun_ai/status/1811384352523301054), @miyabi_foxx (https://x.com/miyabi_foxx/status/1813743951922491492)

## 参考ツイート一覧
| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @yoshi8__ | 2024/6/28 | Artifacts活用: 「SPAでお願いします」でリッチUI完成 | https://x.com/yoshi8__/status/1806578757098221939 |
| @yoshi8__ | 2024/6/30 | Claude + marp形式でスマホだけでスライド作成 | https://x.com/yoshi8__/status/1807163132969971955 |
| @masahirochaen | 2024/7/3 | 天秤AI: 複数AIを同時比較できる無料サイト | https://x.com/masahirochaen/status/1808454140965884074 |
| @shota7180 | 2024/7/7 | Claudeの隠された裏技5選 | https://x.com/shota7180/status/1809882623915008155 |
| @SuguruKun_ai | 2024/7/11 | Genspark + PlusAI + Claude 3.5 Sonnetでスライド作成 | https://x.com/SuguruKun_ai/status/1811384352523301054 |
| @miyabi_foxx | 2024/7/18 | 生成AIで自作アニメを作る方法10ステップ | https://x.com/miyabi_foxx/status/1813743951922491492 |
| @masahirochaen | 2024/8/4 | 無料のClaude 3.5 Sonnet Artifacts上位互換ツール | https://x.com/masahirochaen/status/1819858835173224862 |
| @taiyo_ai_gakuse | 2024/10/23 | Claude 3.5 Sonnet (new)がAnthropic Workbenchで利用可能に | https://x.com/taiyo_ai_gakuse/status/1848753067921182807 |
| @CodeByPoonam | 2024/11/29 | Claudeがコンピューター・iPhoneを操作可能に。11の活用例 | https://x.com/CodeByPoonam/status/1862151895626006704 |
| @masahirochaen | 2024/11/30 | Claude Desktop + BraveSearch API + MCPでウェブ検索搭載 | https://x.com/masahirochaen/status/1862784425085579334 |
| @masahirochaen | 2025/3/13 | Claude標準ウェブ検索でDeepResearch不要に | https://x.com/masahirochaen/status/1900006184549245306 |
| @tetumemo | 2025/3/16 | Claude MCP + Perplexity MCPでDeep Research級の調査が可能 | https://x.com/tetumemo/status/1901076005911159044 |
| @taiyo_ai_gakuse | 2025/4/3 | Claude for Education発表、キャンパスアンバサダー制度 | https://x.com/taiyo_ai_gakuse/status/1907454432255819837 |
| @akira_papa_IT | 2025/6/11 | tmuxでClaude Code MaxプランのAI組織を並列稼働 | https://x.com/akira_papa_IT/status/1932547492199182733 |
| @fadysan_rh | 2025/7/5 | 個人AI開発の最適フロー（MAXプラン + Claude Code） | https://x.com/fadysan_rh/status/1941267493605212284 |
| @tetumemo | 2025/7/13 | Claudeの「スタイル」機能で自分のクローンを作成 | https://x.com/tetumemo/status/1944202779335307542 |
| @akira_papa_IT | 2025/8/1 | SuperClaude v3.0リリース。開発速度10倍の拡張フレームワーク | https://x.com/akira_papa_IT/status/1950976858423775536 |
| @claudeai | 2025/8/2 | Claude公式アカウント開設。プロダクトアップデートを共有予定 | https://x.com/claudeai/status/1951309308869877778 |
| @furoku | 2025/10/17 | Skillsはチーム全体の思考・出力品質を標準化する仕組み | https://x.com/furoku/status/1979195035670450692 |
| @tetumemo | 2025/10/18 | Anthropic公式Skill一覧リポジトリの紹介 | https://x.com/tetumemo/status/1979344864325284264 |
| @tamuramble | 2025/11/2 | Anthropic社長のオープンソース（オープンウェイト）に対する見解 | https://x.com/tamuramble/status/1984801045734965410 |
| @dani_avila7 | 2025/11/8 | Claude Code環境変数40以上の完全リファレンス | https://x.com/dani_avila7/status/1986826412985082305 |
| @ai_for_success | 2025/11/11 | Claude Skills最優秀リポジトリ紹介（450+ stars） | https://x.com/ai_for_success/status/1987922043854270506 |
| @_nogu66 | 2025/11/16 | Claude Skills強化ライフサイクル（A/Bテスト的な反復改善） | https://x.com/_nogu66/status/1990007862345802056 |
| @Yamori_ds | 2025/11/18 | Claude Skillsドキュメントに含まれるAgent開発のヒント | https://x.com/Yamori_ds/status/1990616235554611591 |
| @yusuke_m_MU | 2025/11/25 | Claude for Excel・Chrome操作が全ユーザーにリリース | https://x.com/yusuke_m_MU/status/1993146282232496232 |
| @donvito | 2025/11/25 | GLM 4.6コーディングプランとClaude Codeの連携方法 | https://x.com/donvito/status/1993319464373567604 |
| @trq212 | 2025/11/27 | Claude Codeプラグインマーケットプレイスの使い方 | https://x.com/trq212/status/1993786552233939042 |
| @dani_avila7 | 2025/11/27 | /compactにカスタム指示を追加可能に | https://x.com/dani_avila7/status/1993797396241723505 |
| @oikon48 | 2025/11/28 | Claude Skillsでフロントエンドデザインが改善。Design Skillsプラグイン公開 | https://x.com/oikon48/status/1994327183352058165 |
| @donvito | 2025/12/7 | Anthropic公式の無料Claude Codeコース紹介 | https://x.com/donvito/status/1997561580511481889 |
| @claudeai | 2025/12/10 | Agent SDK: 1Mコンテキスト、サンドボックス、TypeScript V2 | https://x.com/claudeai/status/1998446342583050262 |
| @oikon48 | 2025/12/16 | 公式プラグイン29個が自動インストール・アップデート対応 | https://x.com/oikon48/status/2000749874128806060 |
| @AI_masaou | 2025/12/19 | Claude Skills awesomeリスト紹介 | https://x.com/AI_masaou/status/2001799700970885403 |
| @vibecoder_japan | 2025/12/21 | Claude Harness: Plan→Work→Reviewの開発品質管理プラグイン | https://x.com/vibecoder_japan/status/2002675610255245440 |
| @suna_gaku | 2025/12/25 | Anthropic公式Skills作成ベストプラクティスの整理・共有 | https://x.com/suna_gaku/status/2004130495450567034 |
| @_nogu66 | 2025/12/29 | Thariq氏の「仕様ベース開発」手法（AskUserQuestionTool活用） | https://x.com/_nogu66/status/2005645420744318984 |
| @Ka888aa | 2026/1/6 | Anthropicエンジニアによる2時間Agent SDKワークショップ | https://x.com/Ka888aa/status/2008340819090997424 |
| @AiAircle34052 | 2026/1/7 | Claude Desktop経由でClaude Codeがローカルファイルにアクセス可能に | https://x.com/AiAircle34052/status/2008816984671351200 |
| @Naoki_GPT | 2026/1/9 | Skills活用は稼げる仕組みの半自動化が重要 | https://x.com/Naoki_GPT/status/2009578708131267058 |
| @AiAircle34052 | 2026/1/10 | Boris氏のClaude Codeセットアップチートシート（5〜10並列稼働） | https://x.com/AiAircle34052/status/2009751284480651712 |
| @AI_masaou | 2026/1/10 | Anthropicがサードパーティツールを突然BAN | https://x.com/AI_masaou/status/2009784056515571795 |
| @kenfjt | 2026/1/15 | Skills作成過程の実践記事紹介 | https://x.com/kenfjt/status/2011464770659176800 |
| @tegnike | 2026/1/23 | Claude Code公式ベストプラクティスの推奨 | https://x.com/tegnike/status/2014378779595178180 |
| @__SatoshiSsSs__ | 2026/2/7 | Anthropicが16体Claude Codeチームで自律的にCコンパイラ構築 | https://x.com/__SatoshiSsSs__/status/2020145601678303607 |
| @tetumemo | 2026/2/10 | Claude Code Desktopに--dangerously-skip-permissionsモード追加 | https://x.com/tetumemo/status/2021180397824938048 |
| @masahirochaen | 2026/2/22 | Claude Codeの能力を10倍にするCLAUDE.md（海外バズ） | https://x.com/masahirochaen/status/2025423179578311048 |
| @yugen_matuni | 2026/2/26 | Skills活用にはasset/reference/evaluation/SDK/Claude -pが必須 | https://x.com/yugen_matuni/status/2026674574059008478 |
| @kalilinux | 2026/2/26 | Kali Linux + Claude Desktop GUI + Anthropic Sonnet LLM連携 | https://x.com/kalilinux/status/2026705303656702233 |
| @ho4not | 2026/3/2 | Claudeの設計思想を深く理解できる参考記事の紹介 | https://x.com/ho4not/status/2028268789734019559 |
| @kosuke_agos | 2026/3/2 | Anthropic CEOダリオ・アモデイが「オープンソースAI民主化」の幻想を指摘 | https://x.com/kosuke_agos/status/2028292330596499711 |
