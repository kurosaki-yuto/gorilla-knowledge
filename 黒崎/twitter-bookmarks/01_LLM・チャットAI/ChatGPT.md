# ChatGPT・OpenAI

## 概要
ChatGPT/OpenAIに関するTwitterブックマーク21件をまとめたナレッジ集。AIツールの活用法、代替ツール比較、プロンプトテクニック、最新モデル情報、開発者向けTips、および業界動向を網羅する。2024年7月〜2025年11月の投稿を収録。

## ツール・サービス
| 名前 | 概要 | URL |
|------|------|-----|
| 天秤AI | GPT-4o、Claude 3.5など複数LLMを比較利用できるサービス | - |
| Genspark | AI検索エンジン（Perplexity代替） | - |
| Kolors | 画像生成AI（Midjourney代替） | - |
| Mapify | マインドマップ自動生成ツール | - |
| flotai | GPT-4oを無制限で利用可能 | - |
| Hugging Chat | Llama 3.1 405Bなどオープンソースモデルを無料利用 | - |
| Image FX | Google製の画像生成AI | - |
| Dify | ワークフロー自動化プラットフォーム（Notion連携等） | - |
| Suno | 音楽生成AI | - |
| GitHub Copilot | プログラミング支援AI | - |
| Create | Webサイト制作AI | - |
| vibecodeapp | モバイルアプリを10分以内で構築できるツール | - |

## 知見・ナレッジ

### AIツールの使い分け・代替サービス
- ChatGPT一本ではなく用途別にツールを使い分けるのが重要。文章生成、情報検索、画像生成、コーディングなど目的に応じた最適ツールがある
- 無料で使える代替ツールも多数存在し、課金不要で高品質な結果が得られるケースがある
- 出典: @chatgptair (https://x.com/chatgptair/status/1814782358496940143)
- 出典: @taiyo_ai_gakuse (https://x.com/taiyo_ai_gakuse/status/1812680577755259051)
- 出典: @Kohaku_NFT (https://x.com/Kohaku_NFT/status/1808969214905946400)

### 業務改善のためのAIツール活用
- ChatGPT以外の厳選AIツールを業務内容に応じて導入することで効率を大幅改善できる
- スライド特化AIツールでは、指示1つで30枚のスライドが自動生成可能
- 出典: @chatgptair (https://x.com/chatgptair/status/1828915510458909109)
- 出典: @SuguruKun_ai (https://x.com/SuguruKun_ai/status/1808122296235876804)

### プロンプトテクニック
- ChatGPTで「エモい文章」を作るコツ: 「失敗してきた書き手が、過去の自分と同じ経験をする人を救いたい一心で熱量を込めて書いている文章にしてください」という指示が効果的
- 出典: @minnano_copy (https://x.com/minnano_copy/status/1894740488806453712)

### DeepSeekの推論機能とモデル連携
- DeepSeekの推論（reasoning）部分だけを抽出し、他モデル（GPT-4o、Gemini、Claude）に連携させる手法がある
- 推論だけの出力トークンがほぼ1で、コスト的にもほぼ無料で高性能推論が実現可能
- 出典: @tetumemo (https://x.com/tetumemo/status/1881982319088832781)

### 開発AIエージェントの最適な組み合わせ（Cursor社員推奨）
- 計画や推論にはGPT-5（高性能）
- 実装（ライブコーディング）にはComposer-1（速度・精度に優れる）
- クラウドでの長時間作業にはGPT-5-Codex
- 出典: @SuguruKun_ai (https://x.com/SuguruKun_ai/status/1984960251334897894)

### ChatGPT for macOS デスクトップ連携
- ChatGPT macOS版がVS Code、Xcode、Terminal、iTerm2と連携可能に（ベータ）
- コーディングアプリの内容をChatGPTが参照して回答精度を向上
- 出典: @OpenAIDevs (https://x.com/OpenAIDevs/status/1857129790312272179)

### DifyでのHTTPリクエスト活用Tips
- JSON形式のHTTPレスポンスから特定データを取得する際、JSON Parseツールではなく LLMノードに「〇〇を取得してください」と指示するだけで簡単に回答取得できる
- 出典: @riku_ai_chatgpt (https://x.com/riku_ai_chatgpt/status/1846903248973975974)

### ChatGPT × Dify × Notion連携
- GPTs経由でリサーチレポートや対話内容をNotionに保存するワークフローが構築可能
- DifyのNotion保存ワークフローをAPI化し、GPTsのActionsに登録する方法
- LLMを使わないワークフローならDify Cloud無料アカウントでも利用可能
- 出典: @bunkaich (https://x.com/bunkaich/status/1869029284226207813)

### AIクローン・パーソナライゼーション研究
- MITとGoogle DeepMindの研究: たった2時間の質的インタビューで85%精度のAIクローンを作成可能
- 膨大なデータがなくても「人をAIで再現する」ことが現実的に
- 出典: @pop_ikeda (https://x.com/pop_ikeda/status/1870759890165371232)

### o1-proと哲学的議論
- o1-proを使った高度な知的議論（AIの生物性、独自言語、感じることの哲学的射程）が可能
- 出典: @m2ai_jp (https://x.com/m2ai_jp/status/1869015401470083326)

### Sam Altman 東大イベントでのQ&A
- OpenAIのSam Altmanが東大イベントに来場し、印象的なQ&Aが共有された
- 出典: @houseiwang (https://x.com/houseiwang/status/1886222374691123504)

### Llama 3.1 405B（オープンソース）
- GPT-4o、Claude 3.5を超えるとされるLlama 3.1 405Bがオープンソースで公開
- Hugging Chatから無料で利用可能
- 出典: @taiyo_ai_gakuse (https://x.com/taiyo_ai_gakuse/status/1815861950108119471)

### 有名大学の無料公開資料（ChatGPT活用含む）
- 慶應義塾大学がChatGPT活用に関する資料を無料公開
- 東大、京大、早稲田、ハーバードなども各種教育資料を公開
- 出典: @MacopeninSUTABA (https://x.com/MacopeninSUTABA/status/1811554348130009245)

### モバイルアプリ爆速開発
- vibecodeappを使い、Frontend・DB・Auth・決済・OpenAI APIを含むモバイルアプリを10分以内で構築
- 出典: @learn2vibe (https://x.com/learn2vibe/status/1992430158683476149)

## 参考ツイート一覧
| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @SuguruKun_ai | 2024/7/2 | スライド特化AIツールの紹介。指示1つで30枚のスライド完成 | https://x.com/SuguruKun_ai/status/1808122296235876804 |
| @Kohaku_NFT | 2024/7/5 | 使いこなすべきAIツール10選まとめ（Mapify、flotai、Claudeなど） | https://x.com/Kohaku_NFT/status/1808969214905946400 |
| @MacopeninSUTABA | 2024/7/12 | 有名大学が公開する無料資料まとめ（ChatGPT活用含む） | https://x.com/MacopeninSUTABA/status/1811554348130009245 |
| @taiyo_ai_gakuse | 2024/7/15 | 課金不要のAIツール代替リスト（Genspark、Kolors、天秤AI等） | https://x.com/taiyo_ai_gakuse/status/1812680577755259051 |
| @chatgptair | 2024/7/21 | ChatGPT以外の用途別おすすめAIツール8選 | https://x.com/chatgptair/status/1814782358496940143 |
| @taiyo_ai_gakuse | 2024/7/24 | Llama 3.1 405Bがオープンソースで公開、Hugging Chatから利用可能 | https://x.com/taiyo_ai_gakuse/status/1815861950108119471 |
| @chatgptair | 2024/8/29 | 業務改善のための厳選AIツール一覧 | https://x.com/chatgptair/status/1828915510458909109 |
| @SuguruKun_ai | 2024/8/29 | AIツールでChatGPTクローンサイトを2分で構築 | https://x.com/SuguruKun_ai/status/1829145946523160805 |
| @chatgptair | 2024/9/8 | Google Image FXの画像生成AIの使い方紹介 | https://x.com/chatgptair/status/1832539395616076193 |
| @riku_ai_chatgpt | 2024/10/17 | DifyでJSON HTTPリクエスト処理時にLLMノードを使うTips | https://x.com/riku_ai_chatgpt/status/1846903248973975974 |
| @OpenAIDevs | 2024/11/15 | ChatGPT macOS版がVS Code等と連携するベータ機能を発表 | https://x.com/OpenAIDevs/status/1857129790312272179 |
| @m2ai_jp | 2024/12/17 | o1-proとのAI哲学的議論の共有 | https://x.com/m2ai_jp/status/1869015401470083326 |
| @bunkaich | 2024/12/17 | GPTs×Dify×Notion連携ワークフロー（無料運用可能） | https://x.com/bunkaich/status/1869029284226207813 |
| @pop_ikeda | 2024/12/22 | MIT・Google DeepMind研究: 2時間インタビューで85%精度AIクローン作成 | https://x.com/pop_ikeda/status/1870759890165371232 |
| @masahirochaen | 2024/12/27 | Deepthink・ネット検索・ファイル添付が無料で使えるツール紹介 | https://x.com/masahirochaen/status/1872572490628956465 |
| @tetumemo | 2025/1/22 | DeepSeekの推論機能だけ抽出し他モデルに連携する手法の図解 | https://x.com/tetumemo/status/1881982319088832781 |
| @houseiwang | 2025/2/3 | Sam Altmanが東大OpenAIイベントに来場、Q&Aまとめ | https://x.com/houseiwang/status/1886222374691123504 |
| @minnano_copy | 2025/2/26 | ChatGPTでエモい文章を作るプロンプトテクニック | https://x.com/minnano_copy/status/1894740488806453712 |
| @AInokuhaku | 2025/6/12 | ChatGPTに聞くべき質問の紹介 | https://x.com/AInokuhaku/status/1933154527072727498 |
| @SuguruKun_ai | 2025/11/2 | Cursor社員推奨の開発AIエージェント組み合わせ（GPT-5、Composer-1等） | https://x.com/SuguruKun_ai/status/1984960251334897894 |
| @learn2vibe | 2025/11/23 | vibecodeappでモバイルアプリを10分以内で構築するデモ | https://x.com/learn2vibe/status/1992430158683476149 |
