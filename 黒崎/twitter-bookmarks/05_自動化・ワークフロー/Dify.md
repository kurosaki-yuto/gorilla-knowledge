# Dify

## 概要
Difyはオープンソースの生成AIアプリケーション開発プラットフォーム。ノーコードでLLMワークフローの構築・チャットボット作成・AIエージェント開発が可能。
NTT DATAなど大企業も導入しており、日本市場での需要が急速に拡大中。Bubble・GAS・Supabase等との連携でMicro SaaSの構築にも活用されている。

## ツール・サービス
| 名前 | 概要 | URL |
|------|------|-----|
| Dify | オープンソースLLMアプリ開発プラットフォーム | https://dify.ai |
| Dify教育支援版 | 学生・教育者向け50%割引プラン | https://dify.ai |
| Dify Supabaseプラグイン | DifyアプリとSupabaseデータベースの連携プラグイン（Langgenius公式） | - |
| Dify Base | Dify/AX情報発信メディア | https://x.com/dify_base |
| Dify Japan | Dify日本コミュニティ公式アカウント | https://x.com/DifyJapan |

## 知見・ナレッジ

### Dify x 他ツール連携
- DifyをバックエンドにしてフロントをCursor/Windsurfで開発する手法がDify公式から公開されている
- Dify x GAS x 生成AIでSEO記事の自動生成ワークフローが構築可能
- 外部のNotionからDifyにプロンプトをインサートする実装で柔軟なプロンプト管理が可能
- DifyにSupabaseプラグインが登場し、DB行のCRUD操作やフィルターを使った柔軟なデータ操作が可能に
- 出典: @DifyJapan, @bunkaich, @dify_base

### Dify x Bubbleでのマネタイズ
- Difyで需要検証とコア機能開発 → 近しい人に公開して検証 → BubbleでUIを構築しSaaS化するロードマップ
- 出典: @yoshio_nocode (https://x.com/yoshio_nocode/status/1906993264244478208)

### Dify x Manusの組み合わせ
- ManusでDifyのワークフロー作成からWebアプリ化まで完結できる
- LLM処理はDifyワークフローで柔軟に対応し、改善もしやすい
- 出典: @ayami_marketing (https://x.com/ayami_marketing/status/1979842544122155153)

### Difyとn8nの違い
- 代替関係ではなく共存するもの。大きな違いは「作った仕組みと人がどう関わるか」
- Difyはチャットボット・対話型AIアプリに強み、n8nはワークフロー自動化に強み
- 出典: @rik423__ai (https://x.com/rik423__ai/status/1925865540515496364)

### 企業導入事例
- NTT DATAが「Difyを活用したAIエージェント基盤サービス」をリリース
- 営業AIエージェント「アポドリ」では1日1万回以上Difyを呼び出している
- 出典: @dify_base, @yasu_wakamenori

### Dify人材の市場価値
- Difyで10個以上のブロックを組んだ経験がある人は数%程度
- n8n・Cursor・Claude Code・MCP連携も組み合わせられるスキルセットの需要が高い
- 出典: @sasuu_biz (https://x.com/sasuu_biz/status/1944955134758543606)

### 学習リソース
- Difyハッカソンでの2時間分のハンズオン込み講座資料が公開されている
- Dify Japan主催のスペースで初心者向けQ&Aが実施されている
- Dify BaseではGASをGoogle Workspace Flowsに組み込む方法を無料公開
- 出典: @miyatti, @sora19ai, @dify_base

## 参考ツイート一覧
| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @satori_sz9 | 2024/10/10 | 各職業が最低限覚えるべきAIツール一覧（マーケター・CS等にDify推奨） | https://x.com/satori_sz9/status/1844295044938989677 |
| @DifyJapan | 2024/10/18 | Dify x GAS x 生成AIでSEO記事自動生成ワークフロー | https://x.com/DifyJapan/status/1847248489585246649 |
| @bunkaich | 2024/11/11 | 外部のNotionからDifyにプロンプトをインサートする活用法 | https://x.com/bunkaich/status/1855968060852891778 |
| @DifyJapan | 2024/12/26 | Difyアプリ「今年の漢字」X投稿履歴分析デモ | https://x.com/DifyJapan/status/1872069822407991412 |
| @dify_base | 2025/01/28 | Dify公式のDify x Windsurf連携アプリ開発手法の早見表 | https://x.com/dify_base/status/1884179657135906899 |
| @sora19ai | 2025/02/13 | Difyなんでも質問コーナー スペース告知 | https://x.com/sora19ai/status/1889776149972263397 |
| @yasu_wakamenori | 2025/03/31 | 営業AIエージェント「アポドリ」がDifyを1日1万回呼び出す理由 | https://x.com/yasu_wakamenori/status/1906653902193491998 |
| @yoshio_nocode | 2025/04/01 | Dify x BubbleでMicro SaaS構築・マネタイズのロードマップ | https://x.com/yoshio_nocode/status/1906993264244478208 |
| @DifyJapan | 2025/04/02 | Dify教育支援版の紹介（学生・教育者向け50%割引） | https://x.com/DifyJapan/status/1907304870937575482 |
| @dify_base | 2025/04/17 | NTT DATAのDify活用AIエージェント基盤サービスの紹介 | https://x.com/dify_base/status/1912794136756859105 |
| @rik423__ai | 2025/05/23 | DifyエンジニアによるDifyとn8nの違い・共存の考察 | https://x.com/rik423__ai/status/1925865540515496364 |
| @miyatti | 2025/05/31 | Difyハッカソン講座資料（2時間分ハンズオン込み）の公開 | https://x.com/miyatti/status/1928754085525667996 |
| @sasuu_biz | 2025/07/15 | Dify+n8n+Cursor+Claude Codeの複合スキルの希少性と市場価値 | https://x.com/sasuu_biz/status/1944955134758543606 |
| @dify_base | 2025/07/20 | DifyにSupabaseプラグイン登場（公式開発、CRUD対応） | https://x.com/dify_base/status/1946752844658577906 |
| @ayami_marketing | 2025/10/19 | Dify x Manusでワークフロー作成からWebアプリ化まで完結 | https://x.com/ayami_marketing/status/1979842544122155153 |
| @dify_base | 2025/11/15 | GASをGoogle Workspace Flowsに組み込む方法の無料公開 | https://x.com/dify_base/status/1989538247954051460 |
| @dify_base | 2026/3/5 | OpenAI「Symphony」公開、タスク登録だけでAIが自動コード・テスト・デプロイ完結 | https://x.com/dify_base/status/2029366173629116740 |
