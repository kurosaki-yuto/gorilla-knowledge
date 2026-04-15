# MCP・AIエージェント技術

## 概要
MCP（Model Context Protocol）やAIエージェントに関するツール・フレームワーク・設計パターン・実践知見をまとめたカテゴリ。
RAG/CAGなどの検索拡張技術、Claude Code/Cline/Dify/n8nなどのエージェントツール、Skills/SubAgent等の設計思想、
さらにはエージェントフレームワーク選定やビジネス活用事例まで幅広くカバーしている（75件）。

---

## ツール・サービス

| 名前 | 概要 | URL |
|------|------|-----|
| Postgres AI Chat | 自然言語でデータベースを生成できるSupabase製ツール | https://x.com/taiyo_ai_gakuse/status/1823293921067401682 |
| Roo Cline | MCPサーバーを自分で作成できるAIコーディングツール | https://x.com/mugu_KagawaAI/status/1869755790170718492 |
| Cline | AIエージェントのノウハウが詰まったツール。自動化システム構築に活用 | https://x.com/sora19ai/status/1879362500027994378 |
| Open Operator | ChatGPT Operatorの無料OSSクローン | https://x.com/taiyo_ai_gakuse/status/1882935161148383331 |
| Dify | ワークフロー型AIエージェント構築ツール。経費精算自動化等に活用 | https://x.com/KIRIKO_tech/status/1884476641260494977 |
| Agno | Python製AIエージェントフレームワーク | https://x.com/sora19ai/status/1897904936522072343 |
| Mastra | TypeScript製AIエージェントフレームワーク | https://x.com/sora19ai/status/1897904936522072343 |
| n8n | ノーコード/ローコード自動化ツール。MCP連携やエージェント構築に活用 | https://x.com/fukuchan___3/status/1946177013209080190 |
| GitHub Spec-kit | GitHub公式OSS。仕様開発の爆速化を支援 | https://x.com/Shimayus/status/1964162126613762348 |
| OpenAI Agents SDK | OpenAI製エージェントSDK。DeepResearch相当の機能を構築可能 | https://x.com/taiyo_ai_gakuse/status/1899768347111071916 |
| Claude Agent SDK | Claude製エージェントSDK。SubAgents/Skills/Toolsでカスタマイズ可能 | https://x.com/sora19ai/status/2008227990078136803 |
| Stripe AIエージェントSDK | 決済連携型AIエージェント。旅行手配やSaaS利用の自動化 | https://x.com/satori_sz9/status/1857465776237851058 |
| Hyperbrowser | AIエージェントがWebからスキルを自動学習するツール | https://x.com/hyperbrowser/status/2019126793119338649 |
| RentAHuman.ai | AIエージェントが人間を「雇う」サービス | https://x.com/masahirochaen/status/2019244672024211727 |
| miyabi | App SDKとMCPを活用したモバイルAIエージェント | https://x.com/rute1203d/status/1995822105204801605 |
| RAGBoost | 検索結果の並び替えでLLMキャッシュヒット率を向上させるRAG高速化手法 | https://x.com/sasa_kuna_/status/1988047341908291974 |
| BookRAG | ナレッジグラフ・レイアウトデータ・動的検索を組み合わせた高精度RAG | https://x.com/sasa_kuna_/status/1998928685232214235 |
| 行政オープンデータリモートMCPサーバ | 行政オープンデータにAIエージェントからアクセスできるMCPサーバ | https://x.com/ozaken_AI/status/2021774315600166977 |
| Excel→JSON OSSライブラリ | RAG向けにExcel文書を意味構造JSON化するライブラリ | https://x.com/jrpj2010/status/2001550188490690913 |

---

## 知見・ナレッジ

### MCP（Model Context Protocol）関連

- MCPサーバーストアには343種類以上のMCPサーバーが登録されており、新たな発想や改善のヒントになる
  - 出典: @mugu_KagawaAI (https://x.com/mugu_KagawaAI/status/1868275692703809847)
- MCPサーバーの基礎から実践レベルまでの知識をまとめたスライド資料が公開されている
  - 出典: @Keisuke69 (https://x.com/Keisuke69/status/1986701086561083896)
- 「MCP Apps（SEP-1865）」提案: MCPにインタラクティブUIを標準追加する拡張が提案された。Anthropic、OpenAIのメンバーらが参加
  - 出典: @LangChainJP (https://x.com/LangChainJP/status/1992835605571514802)
- 「ほとんどの状況においてMCPサーバーは必要ない」という指摘。多くの人気MCPサーバーは特定タスクに対して非効率
  - 出典: @iwashi86 (https://x.com/iwashi86/status/1992450542870659395)
- MCPを使わず1関数1ファイルでPythonにする方が、コンテキスト消費を抑えられるという実践的知見。動的にコンテキストをインポートすべき
  - 出典: @bonsen_renge (https://x.com/bonsen_renge/status/1994808733525053826)
- n8nのMCPを活用することで、MCPの真価を実感できるという体験報告
  - 出典: @fukuchan___3 (https://x.com/fukuchan___3/status/1946177013209080190)

### エージェント設計・アーキテクチャ

- Googleがエージェント時代に向けたガイドとナレッジを公開。エージェントの定義と従来AIとの違いを整理
  - 出典: @hokazuya (https://x.com/hokazuya/status/1880382269791375643)
- OpenAIのエージェント構築ガイド日本語版が公開されている
  - 出典: @iwashi86 (https://x.com/iwashi86/status/1985199986624319617)
- AIエージェントに使われる8種類のLLMの分類と役割が整理されている
  - 出典: @mdancho84 (https://x.com/mdancho84/status/1986770182451114349)
- LLM、RAG、AIエージェントは競合ツールではなく「同じインテリジェンススタックの3レイヤー」である。LLMは脳、RAGは記憶、エージェントは行動
  - 出典: @alxnderhughes (https://x.com/alxnderhughes/status/1987112592763154714)
- AI Agentフレームワーク選びの観点: フレームワークは「早すぎる抽象化」になりがち。なるべく低レベルのライブラリを活用しながらチューニングするのが現時点では良い
  - 出典: @y_matsuwitter (https://x.com/y_matsuwitter/status/1987027530713645435)
  - 出典: @fukkyy (https://x.com/fukkyy/status/1987044930838286448)
  - 出典: @po3rin (https://x.com/po3rin/status/1986760812070080646)
- AIエージェントの学習パス: Dify/n8n → Mastra → AI SDK v5 の順が推奨
  - 出典: @taiyo_ai_gakuse (https://x.com/taiyo_ai_gakuse/status/1962503740549927238)
- AIエージェントは「開発する」から「構築する」時代へ。n8nとClaude 4 Opusで業務最適化されたエージェント軍団を構築
  - 出典: @masa_oka108 (https://x.com/masa_oka108/status/1932938090672501087)
- AIエージェントを使いこなすには「マネージャー視点」が重要。業務をスケールする思考が必要
  - 出典: @sarukun99 (https://x.com/sarukun99/status/2006721252262850941)
- AIエージェント設計の常識が変わる可能性: トークン消費・精度低下・コンテキスト汚染という従来の壁への新しいアプローチ
  - 出典: @_nogu66 (https://x.com/_nogu66/status/1993235162935492943)
- 「戦えるAIエージェントの作り方」の技術資料が公開されている
  - 出典: @kazunori_279 (https://x.com/kazunori_279/status/1984746699437588590)
- AIエージェントがチームを自動で組んでシステムを作るサービスが登場
  - 出典: @fadysan_rh (https://x.com/fadysan_rh/status/1895312411126813171)
- スマホでAIと会話してアイデアを固め、自宅PCで自動的に作業が進む仕組みをシンプルな構成で実現
  - 出典: @hokazuya (https://x.com/hokazuya/status/1935287391784419572)

### Claude Skills・SubAgent

- Claude Agent Skillsの概要: AIに専門タスクを教え込める新機能。MCPとの違いも解説
  - 出典: @AI_masaou (https://x.com/AI_masaou/status/1979397626031411525)
- Skills/プロンプト/プロジェクト/MCP/サブエージェントの使い分けが丁寧に解説された公式ドキュメント
  - 出典: @_nogu66 (https://x.com/_nogu66/status/1990051759117697305)
- SubAgentからSkillsを呼び出すのが公式推奨。SubAgentの独立環境でSkillを使うと効果が高い。Skillは専門知識の保持
  - 出典: @_nogu66 (https://x.com/_nogu66/status/1990066660053799351)
- Skills/SubAgentの使い分けと併用の観点からの解説記事が公開
  - 出典: @_nogu66 (https://x.com/_nogu66/status/1990554549296509261)
- Claude Skills/Subagent/MCPの違い: Skillsは「脳」の拡張（知識・手順）、MCPは「感覚器官」の拡張（外部世界の知覚・操作）、Subagentは「分身」を増やす（並行処理）
  - 出典: @kinopee_ai (https://x.com/kinopee_ai/status/1998347144810631594)
- Agent Skillsのベストプラクティスに重要な知見が多数まとめられている
  - 出典: @gota_bara (https://x.com/gota_bara/status/2001305984296161780)
- Agent Skillsがオープンスタンダード化された
  - 出典: @gota_bara (https://x.com/gota_bara/status/2001752075613385150)
- ClaudeのSkillsでフロントエンド生成の「AIっぽさ」を抑える方法が紹介されている
  - 出典: @LangChainJP (https://x.com/LangChainJP/status/1989257110710833592)
- Claude Codeで複数AIエージェントを実行する方法: サブエージェント（Taskツール、10個同時実行）とtmux方式（git worktreeで隔離、ロール分け）
  - 出典: @SuguruKun_ai (https://x.com/SuguruKun_ai/status/2012442270860243215)
- Skillsを30分動かして講座コンテンツを画像付きマニュアル化した実践事例
  - 出典: @rute1203d (https://x.com/rute1203d/status/2013037940939636761)
- 社内AIエージェントを俯瞰管理するシステムを構築。各エージェントのSkills/Rules管理を可視化し、100体規模の組織的運用を目指す
  - 出典: @kenfjt (https://x.com/kenfjt/status/2015064124372488646)

### RAG・CAG・検索拡張技術

- RAG vs CAG: RAGは毎回ベクトルDBを検索するが、CAG（Cache-Augmented Generation）は変わらない静的情報をAIに暗記させる
  - 出典: @akshay_pachaar (https://x.com/akshay_pachaar/status/1985690138756989286)
  - 出典: @omluc_ai (https://x.com/omluc_ai/status/1986229167038603416)
- RAGの誤解: インデックスしたものをそのまま取得するのではない。indexing ≠ retrieval を理解すると高性能なRAGシステムが構築できる
  - 出典: @akshay_pachaar (https://x.com/akshay_pachaar/status/1987497931465990318)
- Traditional RAG vs HyDE: 質問文は回答と意味的に類似しない問題をHyDE（仮説生成）で解決
  - 出典: @_avichawla (https://x.com/_avichawla/status/1988857229483864560)
- RAGからAgentic RAGへの進化: 従来RAGは「検索して回答するだけ」だが、Agentic RAGはツール活用や意思決定を行う
  - 出典: @Python_Dv (https://x.com/Python_Dv/status/1996585280565125536)
- RAGの進化: RAG → Memory-augmented AI Agent。RAGは終着点ではなく、エージェントのメモリシステムへ進化中
  - 出典: @akshay_pachaar (https://x.com/akshay_pachaar/status/1995108099007693206)
- RAG初心者の80%が混乱するRAG Agentsの解説
  - 出典: @mdancho84 (https://x.com/mdancho84/status/1989429689912340695)
- Gemini RAGをGitHub Actionsで自動化する簡単な手法が紹介されている
  - 出典: @kazunori_279 (https://x.com/kazunori_279/status/1988152001553895902)
- RAGの高速化: 人間向け文章はLLMにとって冗長。「AI語」に圧縮してLLMに渡すことでエージェント高速化が可能
  - 出典: @at_sushi_ (https://x.com/at_sushi_/status/2000771437456511322)

### LangChain・マルチエージェント

- LangChain x LangGraphでマルチAIエージェントを個人で始める入門資料（PyCon mini 東海 2025発表）
  - 出典: @komo_fr (https://x.com/komo_fr/status/1987016019198738677)

### コンピュータ操作・ブラウザエージェント

- Claude computer useのデモ: AIがPC画面を操作しながらタスクを遂行するエージェントAI
  - 出典: @takahiroanno (https://x.com/takahiroanno/status/1848974891330257198)
- 24時間365日ウェブを監視し、変化を検知して通知するOSSエージェント
  - 出典: @masahirochaen (https://x.com/masahirochaen/status/1997791000828534997)
- PCのBG Agentからタスクを生成するとスマホで各種モデルが使用可能になる
  - 出典: @taiyo_ai_gakuse (https://x.com/taiyo_ai_gakuse/status/1991397016044462109)

### ビジネス・データ活用

- AI開発ツール一覧（AI Tools Landscape）が有益な情報源として共有
  - 出典: @masa_oka108 (https://x.com/masa_oka108/status/1894711695198822892)
- メルカリの「AI時代のデータ戦略」: データ活用をAIエージェントに移譲するためのデータインターフェース整備
  - 出典: @MacopeninSUTABA (https://x.com/MacopeninSUTABA/status/1998528585620140249)
- CodexやClaudeによるAIエージェントでAutoML（自動機械学習）を実現。特徴量設計から学習・評価・検証サイクルを自動化
  - 出典: @tommy_love123 (https://x.com/tommy_love123/status/1986402263792034134)
- Agentic AI Business Solutions Architect（AB-100）資格試験が新設
  - 出典: @fe_js_engineer (https://x.com/fe_js_engineer/status/1994964604938539405)
- AIエージェントの可能性: 「ハーネスを創れ」 - AIアプリの次のトレンドについての考察
  - 出典: @AI_masaou (https://x.com/AI_masaou/status/1990243895301865512)

### UI/UX・デザイン思想

- AI時代でもデザイン・UI・UXは人間が作るべき領域。ユーザー体験に思想を持つことが重要
  - 出典: @rute1203d (https://x.com/rute1203d/status/1989651336548511900)
  - 出典: @rute1203d (https://x.com/rute1203d/status/1989888739255214576)
- W3CがまとめたWebページ作成パターン仕様をAIに入力すると効率的にページを生成できる
  - 出典: @Shimayus (https://x.com/Shimayus/status/1846542783894716694)

---

## 参考ツイート一覧

| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @taiyo_ai_gakuse | 2024/8/13 | Postgres AI Chatで自然言語からDB生成 | https://x.com/taiyo_ai_gakuse/status/1823293921067401682 |
| @Shimayus | 2024/10/16 | W3CのWebパターン仕様をAIに活用する方法 | https://x.com/Shimayus/status/1846542783894716694 |
| @takahiroanno | 2024/10/23 | Claude computer useのデモと感想 | https://x.com/takahiroanno/status/1848974891330257198 |
| @shanegJP | 2024/11/9 | イーロン・マスクとOpenAI時代の話 | https://x.com/shanegJP/status/1855217017948975398 |
| @satori_sz9 | 2024/11/16 | Stripe AIエージェントSDKのユースケースまとめ | https://x.com/satori_sz9/status/1857465776237851058 |
| @taiyo_ai_gakuse | 2024/11/20 | OpenAI元共同設立者のAI研究論文リーディングリスト紹介 | https://x.com/taiyo_ai_gakuse/status/1859101939843428667 |
| @mugu_KagawaAI | 2024/12/15 | MCPサーバーストア（343種類）の紹介 | https://x.com/mugu_KagawaAI/status/1868275692703809847 |
| @mugu_KagawaAI | 2024/12/19 | Roo Clineを触った感想。Claude課金終了宣言 | https://x.com/mugu_KagawaAI/status/1869755790170718492 |
| @sora19ai | 2025/1/15 | ClineはAIエージェントノウハウの宝庫 | https://x.com/sora19ai/status/1879362500027994378 |
| @hokazuya | 2025/1/18 | Googleのエージェントガイドとナレッジをo1でまとめ | https://x.com/hokazuya/status/1880382269791375643 |
| @taiyo_ai_gakuse | 2025/1/25 | 無料OSSのOpen Operatorの紹介 | https://x.com/taiyo_ai_gakuse/status/1882935161148383331 |
| @KIRIKO_tech | 2025/1/29 | Difyで経費精算を自動化するワークフロー | https://x.com/KIRIKO_tech/status/1884476641260494977 |
| @masa_oka108 | 2025/2/26 | AI開発ツール一覧（AI Tools Landscape） | https://x.com/masa_oka108/status/1894711695198822892 |
| @fadysan_rh | 2025/2/28 | AIエージェントが自動でチームを組むサービス | https://x.com/fadysan_rh/status/1895312411126813171 |
| @sora19ai | 2025/3/7 | Agno（Python）とMastra（TypeScript）のフレームワーク紹介 | https://x.com/sora19ai/status/1897904936522072343 |
| @taiyo_ai_gakuse | 2025/3/12 | OpenAI Agents SDKでDeepResearch相当を自作 | https://x.com/taiyo_ai_gakuse/status/1899768347111071916 |
| @masa_oka108 | 2025/6/12 | Claude 4 Opus + n8nでAIエージェント軍団を構築 | https://x.com/masa_oka108/status/1932938090672501087 |
| @hokazuya | 2025/6/18 | スマホでAIと会話→自宅PCで自動作業する仕組み | https://x.com/hokazuya/status/1935287391784419572 |
| @Shimayus | 2025/7/6 | 解説記事の紹介 | https://x.com/Shimayus/status/1941658852518396235 |
| @fukuchan___3 | 2025/7/18 | n8nのMCPでMCPの凄さを実感 | https://x.com/fukuchan___3/status/1946177013209080190 |
| @taiyo_ai_gakuse | 2025/9/1 | AIエージェント学習パス: Dify/n8n→Mastra→AI SDK v5 | https://x.com/taiyo_ai_gakuse/status/1962503740549927238 |
| @Shimayus | 2025/9/6 | GitHub公式Spec-kitでClaudeCode/GeminiCLIと爆速仕様開発 | https://x.com/Shimayus/status/1964162126613762348 |
| @AI_masaou | 2025/10/18 | Claude Agent Skillsの解説とMCPとの違い | https://x.com/AI_masaou/status/1979397626031411525 |
| @kazunori_279 | 2025/11/2 | 戦えるAIエージェントの作り方 | https://x.com/kazunori_279/status/1984746699437588590 |
| @iwashi86 | 2025/11/3 | OpenAIエージェント構築ガイド日本語版の紹介 | https://x.com/iwashi86/status/1985199986624319617 |
| @akshay_pachaar | 2025/11/4 | RAG vs CAG の比較解説 | https://x.com/akshay_pachaar/status/1985690138756989286 |
| @omluc_ai | 2025/11/6 | CAG（キャッシュ拡張生成）のトレンド解説 | https://x.com/omluc_ai/status/1986229167038603416 |
| @tommy_love123 | 2025/11/6 | AIエージェントによるAutoML（自動機械学習）の実現 | https://x.com/tommy_love123/status/1986402263792034134 |
| @Keisuke69 | 2025/11/7 | MCPサーバーの基礎から実践レベルのスライド資料 | https://x.com/Keisuke69/status/1986701086561083896 |
| @po3rin | 2025/11/7 | LayerXブログリレー: AIエージェントフレームワーク選び | https://x.com/po3rin/status/1986760812070080646 |
| @mdancho84 | 2025/11/7 | AIエージェントに使われる8種類のLLM解説 | https://x.com/mdancho84/status/1986770182451114349 |
| @komo_fr | 2025/11/8 | LangChain x LangGraphでマルチエージェント入門（PyCon資料） | https://x.com/komo_fr/status/1987016019198738677 |
| @y_matsuwitter | 2025/11/8 | フレームワークは早すぎる抽象化になりがち | https://x.com/y_matsuwitter/status/1987027530713645435 |
| @fukkyy | 2025/11/8 | AI Agentフレームワークを使うべきかの考察記事 | https://x.com/fukkyy/status/1987044930838286448 |
| @alxnderhughes | 2025/11/8 | LLM/RAG/AIエージェントは同一スタックの3レイヤー | https://x.com/alxnderhughes/status/1987112592763154714 |
| @akshay_pachaar | 2025/11/9 | RAGの誤解: indexing ≠ retrieval | https://x.com/akshay_pachaar/status/1987497931465990318 |
| @sasa_kuna_ | 2025/11/11 | RAGBoostで検索結果並び替えによるLLMキャッシュ最適化 | https://x.com/sasa_kuna_/status/1988047341908291974 |
| @kazunori_279 | 2025/11/11 | Gemini RAG + GitHub Actionsで自動学習AIアシスタント | https://x.com/kazunori_279/status/1988152001553895902 |
| @_avichawla | 2025/11/13 | Traditional RAG vs HyDE の視覚的解説 | https://x.com/_avichawla/status/1988857229483864560 |
| @LangChainJP | 2025/11/14 | ClaudeのSkillsでフロントエンド生成のAIっぽさを抑える | https://x.com/LangChainJP/status/1989257110710833592 |
| @mdancho84 | 2025/11/15 | RAG Agentsの初心者向け解説スレッド | https://x.com/mdancho84/status/1989429689912340695 |
| @rute1203d | 2025/11/15 | AIで作れないデザイン・UI・UX能力の重要性 | https://x.com/rute1203d/status/1989651336548511900 |
| @rute1203d | 2025/11/16 | AI時代のUI/UXにおける思想の重要性 | https://x.com/rute1203d/status/1989888739255214576 |
| @_nogu66 | 2025/11/16 | Skills/プロンプト/プロジェクト/MCP/サブエージェントの使い分け | https://x.com/_nogu66/status/1990051759117697305 |
| @_nogu66 | 2025/11/16 | SubAgentからSkills呼び出しが公式推奨 | https://x.com/_nogu66/status/1990066660053799351 |
| @AI_masaou | 2025/11/17 | AIエージェントの可能性「ハーネスを創れ」 | https://x.com/AI_masaou/status/1990243895301865512 |
| @_nogu66 | 2025/11/18 | Claude SkillsとSubAgentの使い分け・併用解説記事 | https://x.com/_nogu66/status/1990554549296509261 |
| @taiyo_ai_gakuse | 2025/11/20 | BG Agentからのタスク生成でスマホから各モデル利用可能 | https://x.com/taiyo_ai_gakuse/status/1991397016044462109 |
| @taiyo_ai_gakuse | 2025/11/23 | 予算を抑える方法の発見 | https://x.com/taiyo_ai_gakuse/status/1992445240666693939 |
| @iwashi86 | 2025/11/23 | MCPサーバーは必ずしも必要ないという指摘記事 | https://x.com/iwashi86/status/1992450542870659395 |
| @LangChainJP | 2025/11/24 | MCP Apps（SEP-1865）インタラクティブUI拡張の提案 | https://x.com/LangChainJP/status/1992835605571514802 |
| @_nogu66 | 2025/11/25 | エージェント設計の常識を変える新手法 | https://x.com/_nogu66/status/1993235162935492943 |
| @bonsen_renge | 2025/11/30 | MCP不要論: 1関数1ファイルPythonで動的コンテキスト管理 | https://x.com/bonsen_renge/status/1994808733525053826 |
| @fe_js_engineer | 2025/11/30 | Agentic AI資格試験AB-100の紹介 | https://x.com/fe_js_engineer/status/1994964604938539405 |
| @akshay_pachaar | 2025/11/30 | RAGからAIエージェントのメモリへの進化 | https://x.com/akshay_pachaar/status/1995108099007693206 |
| @rute1203d | 2025/12/2 | miyabi: App SDKとMCPを活用したモバイルエージェント | https://x.com/rute1203d/status/1995822105204801605 |
| @Python_Dv | 2025/12/4 | RAGからAgentic RAGへの進化解説 | https://x.com/Python_Dv/status/1996585280565125536 |
| @masahirochaen | 2025/12/8 | 24時間365日ウェブ監視AIエージェントOSS | https://x.com/masahirochaen/status/1997791000828534997 |
| @kinopee_ai | 2025/12/9 | Skills/Subagent/MCPの違いを一言で整理 | https://x.com/kinopee_ai/status/1998347144810631594 |
| @MacopeninSUTABA | 2025/12/10 | メルカリのAI時代のデータ戦略資料紹介 | https://x.com/MacopeninSUTABA/status/1998528585620140249 |
| @sasa_kuna_ | 2025/12/11 | BookRAG: 複合手法を詰め込んだ高精度RAG | https://x.com/sasa_kuna_/status/1998928685232214235 |
| @at_sushi_ | 2025/12/16 | RAG高速化: 人間向け文章をAI語に圧縮 | https://x.com/at_sushi_/status/2000771437456511322 |
| @gota_bara | 2025/12/17 | Agent Skillsベストプラクティスの紹介 | https://x.com/gota_bara/status/2001305984296161780 |
| @hokazuya | 2025/12/18 | 記事の推薦（内容不明） | https://x.com/hokazuya/status/2001417070500876367 |
| @jrpj2010 | 2025/12/18 | RAG向けExcel→意味構造JSON化OSSライブラリ | https://x.com/jrpj2010/status/2001550188490690913 |
| @gota_bara | 2025/12/19 | Agent Skillsがオープンスタンダード化 | https://x.com/gota_bara/status/2001752075613385150 |
| @sarukun99 | 2026/1/1 | AIエージェント活用にはマネージャー視点が必要 | https://x.com/sarukun99/status/2006721252262850941 |
| @sora19ai | 2026/1/6 | Claude Agent SDKの評価。SubAgents/Skills/Toolsで最強 | https://x.com/sora19ai/status/2008227990078136803 |
| @SuguruKun_ai | 2026/1/17 | Claude Codeで複数AIエージェントを実行する方法 | https://x.com/SuguruKun_ai/status/2012442270860243215 |
| @rute1203d | 2026/1/19 | Skillsで講座を画像付きマニュアル化した実践例 | https://x.com/rute1203d/status/2013037940939636761 |
| @kenfjt | 2026/1/24 | 社内AIエージェント100体の組織的管理システム構築 | https://x.com/kenfjt/status/2015064124372488646 |
| @hyperbrowser | 2026/2/5 | AIエージェントがWebからスキルを自動学習するツール | https://x.com/hyperbrowser/status/2019126793119338649 |
| @masahirochaen | 2026/2/5 | RentAHuman.ai: AIが人間を雇うサービス | https://x.com/masahirochaen/status/2019244672024211727 |
| @kimeragon02 | 2026/2/9 | リンク共有（内容不明） | https://x.com/kimeragon02/status/2020780729849012419 |
| @ozaken_AI | 2026/2/12 | 行政オープンデータリモートMCPサーバの公開 | https://x.com/ozaken_AI/status/2021774315600166977 |
| @yugen_matuni | 2026/2/27 | Skills自動作成サイクルの紹介、asset/evaluationへの分散管理が課題 | https://x.com/yugen_matuni/status/2027545888865063130 |
| @yugen_matuni | 2026/2/27 | AIエージェントに仕事を任せて感情面に集中する時代への所感 | https://x.com/yugen_matuni/status/2027211743718707376 |
| @yusuke_post | 2026/2/28 | AI Skillsの実務応用紹介（49万インプ超え） | https://x.com/yusuke_post/status/2027348800331972703 |
| @taziku_co | 2026/3/2 | 8歳の少年がESP32用自律型エージェントを構築、Telegramでハードウェアをプロンプト駆動 | https://x.com/taziku_co/status/2028238037428392142 |
| @OneBiz_Levela | 2026/3/2 | OneBiz AIスキル関連投稿（99万インプ超え） | https://x.com/OneBiz_Levela/status/2028666852097040738 |
| @taichi_we | 2026/2/28 | Levela CTO長谷川氏の投稿（388万インプ超え） | https://x.com/taichi_we/status/2027666793150767417 |
| @lochieaxon | 2026/3/5 | Web Hapticsスキル（npx skills add）でWebアプリに触覚フィードバック追加 | https://x.com/lochieaxon/status/2029166927336358011 |
| @mugu_KagawaAI | 2026/3/5 | Skills（AIスキル機能）理解を深める記事の紹介 | https://x.com/mugu_KagawaAI/status/2029187166803509525 |
