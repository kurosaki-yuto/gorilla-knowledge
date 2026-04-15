# Claude Code活用法

## 概要
Claude CodeはAnthropicが提供するCLIベースのAIコーディングアシスタント。Agent Skills、拡張思考モード、バックグラウンドタスク、MCP連携など多彩な機能を備え、開発ワークフローを大幅に効率化する。
スキル設計やCLAUDE.mdの育成が品質を左右するため、設定・運用ノウハウの蓄積が重要となっている。

## ツール・サービス
| 名前 | 概要 | URL |
|------|------|-----|
| Claude Code | Anthropic公式CLIコーディングアシスタント | https://docs.anthropic.com/en/docs/claude-code |
| SkillsMP | 25,000以上のAgent Skillsを横断検索できるサービス | https://x.com/SuguruKun_ai/status/2012924404754428375 |
| UI UX Pro Max | Claude Codeを"UI/UXデザイナー"にするSkill (GitHub 1.4k Star) | https://x.com/yusuke_post/status/2003411960193515695 |
| Remotion Skills | Claude Codeで動画制作を可能にするSkill | https://x.com/AI_masaou/status/2013779271425069292 |
| Nano Banana Pro | 議事録からスライド・挿絵画像を自動生成するツール | https://x.com/tegnike/status/1996500814031200294 |
| Antigravity | VS Codeフォーク。Claude Code拡張をインストールしてvibe codingが可能 | https://x.com/__SatoshiSsSs__/status/2008829772890325397 |
| skill-creator | Agent Skillsを簡単に作成するツール | https://x.com/gorilla0513/status/2004090250872946716 |
| Dify | ノーコードAIワークフロー構築ツール。Claude Code/Codexと連携可能 | https://x.com/kokisennyu/status/1946128447933391036 |
| OpenClaw | ローカルLLM等でClaude Codeを動かすためのOSSツール | https://x.com/ml0_1337/status/1930285150228906127 |

## 知見・ナレッジ

### Skills設計のベストプラクティス
- Skillsはトークン効率が高く、必要な時だけ自動ロードされる「プログレッシブ・ディスクロージャー」方式
- 「こうやってください」だけでなく「こういう意図でやってます」まで書くと精度が段違いに上がる
- SkillsとSubagentがうまく発火しない原因と対策を把握しておくことが重要
- skill-creatorで作ったスキルはベストプラクティスに沿っていないことが多いため、手動で調整が必要
- 出典: @dani_avila7 (https://x.com/dani_avila7/status/1979349357636767986)
- 出典: @_nogu66 (https://x.com/_nogu66/status/2003792943262622054)
- 出典: @oikon48 (https://x.com/oikon48/status/1994687106158137643)
- 出典: @gorilla0513 (https://x.com/gorilla0513/status/2004090250872946716)

### Skills活用の具体例
- UI/UXデザイン用Skill（UI UX Pro Max）でLP生成。デザインDBがCSV形式でSkill内に組み込まれている
- Remotion Skillsを入れるだけでReact動画が自動生成可能。マーケ動画の叩き台が一瞬で作れる
- UIがダサい問題を解決するSkill（8年のプロダクトデザイン経験を凝縮）
- 用途別おすすめSkills 9選の記事あり
- 出典: @yusuke_post (https://x.com/yusuke_post/status/2003411960193515695)
- 出典: @AI_masaou (https://x.com/AI_masaou/status/2013779271425069292)
- 出典: @__SatoshiSsSs__ (https://x.com/__SatoshiSsSs__/status/2008337761775042918)
- 出典: @kara_mage (https://x.com/kara_mage/status/2012826225019081024)

### CLAUDE.md育成と開発フロー
- 仕事の大半が「Claude Code育てゲー」になるほど、CLAUDE.mdの育成が重要
- 50本のSQLをdbt化した実例で、具体的な育成フローが解説されている
- PSBフロー（Plan → Structure → Build）を使うことでプロジェクト崩壊を防ぐ
- いきなりコードを書き始めるのではなく、計画→構造化→実装の順序が重要
- 出典: @Tocyuki (https://x.com/Tocyuki/status/1986387814901293394)
- 出典: @kuwa_tw (https://x.com/kuwa_tw/status/1986934773106024590)
- 出典: @AiAircle34052 (https://x.com/AiAircle34052/status/2009151079817068932)

### Skillsの設計思想と学習方法
- 「明示的に指示しなくても、必要に応じてLLMの判断で読み込む」状態をいかに作るかがポイント
- 無料の2時間19分の講座が公開されており、スキル設計をマスター可能（英語、文字起こしあり）
- コード生成/レビュー、データ分析、リサーチ用カスタムスキルの作成方法を学べる
- 出典: @akihiro_genai (https://x.com/akihiro_genai/status/1997483066969973081)
- 出典: @masahirochaen (https://x.com/masahirochaen/status/2018555192107778544)

### 拡張思考モードとバックグラウンドタスク
- Claude Codeの拡張思考モードの詳細解説記事あり
- 「&」を入力するだけでバックグラウンドタスクを開始し、Claude Code Webに転送可能
- 出典: @siguma_sig (https://x.com/siguma_sig/status/1990670017906761783)
- 出典: @trq212 (https://x.com/trq212/status/1991977749821735341)

### MCPとコンテキスト管理
- MCPがコンテキストを大量消費する問題の解決策がドキュメントに記載されている
- デフォルトでClaude Code内に組み込んでほしいという要望あり
- 出典: @swarm_ai_cloud (https://x.com/swarm_ai_cloud/status/1985925411193438361)

### レビュー・品質管理への活用
- KINTOテクノロジーズがClaude Codeをレビュー負荷軽減の「説明補助ツール」として実践活用
- 実践的なユースケースとして参考になる事例
- 出典: @kinopee_ai (https://x.com/kinopee_ai/status/1988862912686092429)

### コンテンツ自動生成
- Claude Codeでnote記事の完全自動化が可能（Nano Banana統合で挿絵画像の自動生成+自動挿入まで対応）
- 議事録から提案書スライドを自動生成するワークフロー
- Claude Codeに「チームを組め」と指示し、企画→調査→執筆→校正を40分で完了する事例
- 出典: @ytiskw (https://x.com/ytiskw/status/2013478697161179199)
- 出典: @tegnike (https://x.com/tegnike/status/1996500814031200294)
- 出典: @The_AGI_WAY (https://x.com/The_AGI_WAY/status/2021567930874650827)

### ローカルLLM連携
- OpenAI/Geminiモデル、ローカルLLMをClaude Code上で動かせるOSSツールが登場
- 自宅GPUがあれば無料でエージェント機能を使い放題
- ローカルLLMでClaude Codeを動かしたい人向けのツール情報あり
- 出典: @ml0_1337 (https://x.com/ml0_1337/status/1930285150228906127)
- 出典: @laiso (https://x.com/laiso/status/2012702333675716683)

### 環境構築・初期設定
- Claude Code初心者が絶対にすべき安全設定まとめ（最低限の設定でリスク排除）
- Mac Mini 24h稼働でClaude Code常時起動、ブラウザ操作のスマホ起動など
- Claude Code動作中にTikTokを自動開閉するネタスクリプト（話題性あり）
- 出典: @makaneko_AI (https://x.com/makaneko_AI/status/2027010270258983239)
- 出典: @usutaku_channel (https://x.com/usutaku_channel/status/2026533538355621981)
- 出典: @Handball_Jin (https://x.com/Handball_Jin/status/2009817415098810462)

### UIデザイン改善
- Claude Code Actionで雑なプロンプトからUIデザイン修正を実行（電車内スマホ操作で完了）
- Webサイトデザインを10倍レベルアップするプロンプト手法
- 出典: @masa_oka108 (https://x.com/masa_oka108/status/1928232032615751814)
- 出典: @donvito (https://x.com/donvito/status/1992292892644413682)

### 外部ツール連携
- DifyとClaude Codeの完全連携が可能に（Dify上でClaude CodeやCodexを制御）
- Antigravity（VS Codeフォーク）でClaude Codeを使ったvibe codingが可能
- 出典: @kokisennyu (https://x.com/kokisennyu/status/1946128447933391036)
- 出典: @__SatoshiSsSs__ (https://x.com/__SatoshiSsSs__/status/2008829772890325397)

## 参考ツイート一覧
| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @yoshi8__ | 2024/10/22 | Difyの使いこなし方の紹介 | https://x.com/yoshi8__/status/1848504600028160323 |
| @masa_oka108 | 2025/5/30 | Claude Code Actionで電車内からスマホでUIデザイン修正を依頼した事例 | https://x.com/masa_oka108/status/1928232032615751814 |
| @ml0_1337 | 2025/6/5 | OpenAI/GeminiモデルやローカルLLMをClaude Code上で動かせるOSSツール紹介 | https://x.com/ml0_1337/status/1930285150228906127 |
| @kokisennyu | 2025/7/18 | DifyとClaude Codeの完全連携が可能になった速報 | https://x.com/kokisennyu/status/1946128447933391036 |
| @dani_avila7 | 2025/10/18 | Claude Code Skillsのトークン効率の良さと設定方法の解説 | https://x.com/dani_avila7/status/1979349357636767986 |
| @swarm_ai_cloud | 2025/11/5 | MCPのコンテキスト大量消費問題の解決策に関する情報共有 | https://x.com/swarm_ai_cloud/status/1985925411193438361 |
| @Tocyuki | 2025/11/6 | 仕事の大半がClaude Code育てゲーになっているという実感の共有 | https://x.com/Tocyuki/status/1986387814901293394 |
| @kuwa_tw | 2025/11/8 | Claude Codeの具体的な育成フロー（50本SQLをdbt化した事例記事の紹介） | https://x.com/kuwa_tw/status/1986934773106024590 |
| @kinopee_ai | 2025/11/13 | KINTOテクノロジーズによるClaude Codeレビュー活用の実践事例紹介 | https://x.com/kinopee_ai/status/1988862912686092429 |
| @siguma_sig | 2025/11/18 | Claude Codeの拡張思考モードに関する解説記事の紹介 | https://x.com/siguma_sig/status/1990670017906761783 |
| @trq212 | 2025/11/22 | 「&」でバックグラウンドタスクを開始しClaude Code Webに転送する機能紹介 | https://x.com/trq212/status/1991977749821735341 |
| @donvito | 2025/11/23 | Webサイトのデザインを10倍レベルアップするClaude Codeプロンプト紹介 | https://x.com/donvito/status/1992292892644413682 |
| @oikon48 | 2025/11/29 | SkillsとSubagentがうまく発火しない原因と対策の記事紹介 | https://x.com/oikon48/status/1994687106158137643 |
| @tegnike | 2025/12/4 | Claude CodeとNano Banana Proで議事録からスライドを自動生成する手法 | https://x.com/tegnike/status/1996500814031200294 |
| @akihiro_genai | 2025/12/7 | Skillsの設計思想：LLMの判断で自動読み込みされる状態を作ることがポイント | https://x.com/akihiro_genai/status/1997483066969973081 |
| @yusuke_post | 2025/12/23 | UI UX Pro MaxスキルでLP生成した実例紹介 | https://x.com/yusuke_post/status/2003411960193515695 |
| @_nogu66 | 2025/12/24 | Agent Skillsの極意：意図まで書くと精度が段違いに上がる | https://x.com/_nogu66/status/2003792943262622054 |
| @gorilla0513 | 2025/12/25 | skill-creatorの改善ツールとAgent Skills作成方法の記事紹介 | https://x.com/gorilla0513/status/2004090250872946716 |
| @__SatoshiSsSs__ | 2026/1/6 | UIダサい問題を解決するSkill紹介（Redditで393いいね） | https://x.com/__SatoshiSsSs__/status/2008337761775042918 |
| @__SatoshiSsSs__ | 2026/1/7 | AntigravityとClaude Codeの併用によるvibe coding手順の紹介 | https://x.com/__SatoshiSsSs__/status/2008829772890325397 |
| @AiAircle34052 | 2026/1/8 | Claude Code初心者の失敗原因とPSBフロー（Plan→Structure→Build）の紹介 | https://x.com/AiAircle34052/status/2009151079817068932 |
| @Handball_Jin | 2026/1/10 | Claude Code動作中にTikTokを自動開閉するスクリプトの紹介 | https://x.com/Handball_Jin/status/2009817415098810462 |
| @laiso | 2026/1/18 | ローカルLLMでClaude Codeを動かすツールの紹介 | https://x.com/laiso/status/2012702333675716683 |
| @kara_mage | 2026/1/18 | Claude Code Skills用途別おすすめ9選の記事紹介 | https://x.com/kara_mage/status/2012826225019081024 |
| @SuguruKun_ai | 2026/1/19 | SkillsMPサービス紹介（25,000以上のAgent Skillsを横断検索） | https://x.com/SuguruKun_ai/status/2012924404754428375 |
| @ytiskw | 2026/1/20 | Claude Codeでnote記事の完全自動化（Nano Banana統合で挿絵自動生成） | https://x.com/ytiskw/status/2013478697161179199 |
| @AI_masaou | 2026/1/21 | Remotion Skillsで動画制作が可能になった紹介 | https://x.com/AI_masaou/status/2013779271425069292 |
| @masahirochaen | 2026/2/3 | Claude Codeを無料で学べる2時間19分の講座が公開された情報 | https://x.com/masahirochaen/status/2018555192107778544 |
| @The_AGI_WAY | 2026/2/11 | Claude Codeにチームを組ませ企画→調査→執筆→校正を40分で完了する手法 | https://x.com/The_AGI_WAY/status/2021567930874650827 |
| @usutaku_channel | 2026/2/25 | Mac Mini 24h稼働でClaude Code常時起動などの環境構築事例 | https://x.com/usutaku_channel/status/2026533538355621981 |
| @makaneko_AI | 2026/2/26 | Claude Code初心者向け安全設定まとめ記事 | https://x.com/makaneko_AI/status/2027010270258983239 |
| @makaneko_AI | 2026/2/27 | Claude Code中の人の教えをCLAUDE.mdにまとめた日本語版（プランモード等） | https://x.com/makaneko_AI/status/2027202920719192099 |
| @MacopeninSUTABA | 2026/3/2 | コードレビュー指摘をCLAUDE.mdに書いてClaude Codeを開発パートナーに昇華 | https://x.com/MacopeninSUTABA/status/2028274589772529757 |
| @masahirochaen | 2026/3/3 | Claude Code活用のカギは「フォルダ設計力」、mdファイル・skillsの最適化 | https://x.com/masahirochaen/status/2028490152235205070 |
| @masahirochaen | 2026/3/3 | Claude Coworkを最強にする17の方法 - 仕組みで差がつく | https://x.com/masahirochaen/status/2028609546730762511 |
| @nakaaki04 | 2026/3/8 | Claude Codeが完全ローカル・無料・無制限で動かせるように | https://x.com/nakaaki04/status/2030745634194792461 |
| @nakaaki04 | 2026/3/8 | Claude Codeをローカル・無料で動かす方法（Ollama + Qwen Coder） | https://x.com/nakaaki04/status/2030745646450552946 |
