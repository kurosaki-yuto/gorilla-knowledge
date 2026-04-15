# Cursor IDE活用法

## 概要
Cursor IDEはAIを搭載したコードエディタで、Composerやエージェントモードなど強力なAI支援機能を備える。v0やClaude等の生成AIツールと組み合わせることで、要件定義から実装・デプロイまでの開発フローを大幅に効率化できる。非エンジニアからプロの開発者まで幅広いユーザーに支持されている。

## ツール・サービス
| 名前 | 概要 | URL |
|------|------|-----|
| Cursor | AI搭載コードエディタ。Composer・エージェントモード・Yoloモード等を備える | https://www.cursor.com/ |
| Cursor CLI | ターミナルからCursorのAIコーディング支援を利用できるCLIツール（ベータ版） | https://www.cursor.com/ |
| SpecStory | Composerとの対話履歴をMarkdownに自動変換するCursor拡張機能（Memory Bank相当） | - |
| v0 | Vercel提供のUI生成AI。生成したコードをCursorに持ち込んで本格開発する連携が定番 | https://v0.dev/ |
| Supabase + MCP | CursorとMCP連携でバックエンド・DB・マイグレーションをAIで自動化するMVP開発手法 | https://supabase.com/ |
| Antigravity | Cursorの競合となるAIコーディングツール。現状はCursorの方が成熟している | - |

## 知見・ナレッジ

### v0からCursorへの連携フロー
- v0で生成したコード・コンポーネントをCursorに持ち込んで本格開発するワークフローが定番化している
- 手順: `npx create-next-app@latest --typescript` でプロジェクト作成後、v0のコードを組み込む方法が基本
- より簡単な方法としてnote記事にまとめられた手順も存在する
- 出典: @moz_ai_tech (https://x.com/moz_ai_tech/status/1846953384139804998)
- 出典: @mugu_KagawaAI (https://x.com/mugu_KagawaAI/status/1847122688294506990)
- 出典: @moz_ai_tech (https://x.com/moz_ai_tech/status/1847282952591552956)

### Claude → Create → Cursor の「3Cフロー」
- Claudeで要件を整理し、Createでコード生成、Cursorでアニメーション追加など仕上げを行う開発フロー
- スクロールアニメーション等のインタラクション実装に有効
- 出典: @kawai_design (https://x.com/kawai_design/status/1819629683274920355)

### v0 → Cursor の本格開発ワークフロー
- 日本語で要件定義 → YAMLでディレクトリ構造 → 技術スタック決定 → v0で20-30ファイル生成 → ZIPダウンロード → Cursorで本格開発
- 段階的にAIツールを使い分けることで効率的な開発が可能
- 出典: @yoshi8__ (https://x.com/yoshi8__/status/1849597728738984109)

### Cursor + Supabase + MCPによるMVP高速開発
- CursorにMCP（Model Context Protocol）でSupabaseを接続し、バックエンド・DB・マイグレーションをAIで処理
- クライアントMVPをより速く・安く・スマートに構築する手法
- 出典: @PrajwalTomar_ (https://x.com/PrajwalTomar_/status/1901640012346568869)
- 出典: @PrajwalTomar_ (https://x.com/PrajwalTomar_/status/1920114778007015851)

### Cursorによる開発時間の短縮
- Composerのエージェントモード・Yoloモードの活用で実装が大幅に高速化
- DB設計をDeep Researchで行い、実装方針をo1 Proに相談することで30分で実装完了した事例あり
- 実装時間を1/5にする具体的手法が技術記事として公開されている
- 出典: @fadysan_rh (https://x.com/fadysan_rh/status/1887985792804651150)
- 出典: @Jessicazu418 (https://x.com/Jessicazu418/status/1891357051613573628)

### SpecStory拡張機能によるCursor強化
- WindsurfのMemory機能やClineのMemory Bankに相当する機能をCursorで実現
- Composerとの対話履歴を自動的にMarkdownファイルに変換し、プロジェクトの知識を蓄積
- 出典: @KeisukeShibata_ (https://x.com/KeisukeShibata_/status/1890332709387686139)

### Cursorでの要件定義プロセス改善
- プロジェクトルールの設定、影響範囲の特定、設計方針の策定、ドキュメント生成まで要件定義全体をCursorで効率化
- 出典: @MacopeninSUTABA (https://x.com/MacopeninSUTABA/status/1990948639368491088)

### Cursor CLI（ベータ版）
- ターミナルから直接AIコーディング支援が可能になるCLI版が登場
- Claude Codeのような使い方をCursorで実現でき、あらゆるIDEから最新AIモデルを利用可能
- 出典: @akira_papa_IT (https://x.com/akira_papa_IT/status/1953562609984450896)

### 非エンジニアにとってのCursor
- 非エンジニアにとって「ちょうど良い」ツールとして支持されている
- Claude Codeなどより高度なツールと比較して、GUIベースのCursorは学習コストが低い
- 出典: @suh_sunaneko (https://x.com/suh_sunaneko/status/1984489338470822387)

### Cursorと競合ツールの比較
- Antigravityとの比較では現状Cursorの方が使いやすいとの評価（習熟度の差も要因）
- 出典: @yuzu_curiosity (https://x.com/yuzu_curiosity/status/1992821379218145305)

## 参考ツイート一覧
| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @kawai_design | 2024/8/3 | Claude→Create→Cursorの「3Cフロー」でスクロールアニメーション実装 | https://x.com/kawai_design/status/1819629683274920355 |
| @moz_ai_tech | 2024/10/18 | v0からCursorに持っていく手順のメモ（npx create-next-app方式） | https://x.com/moz_ai_tech/status/1846953384139804998 |
| @mugu_KagawaAI | 2024/10/18 | v0→Cursor手順をv0で図解化。ハッカソン参加者必見 | https://x.com/mugu_KagawaAI/status/1847122688294506990 |
| @moz_ai_tech | 2024/10/18 | v0→Cursorのより簡単な方法をnoteに画像付きでまとめ | https://x.com/moz_ai_tech/status/1847282952591552956 |
| @yoshi8__ | 2024/10/25 | 要件定義→YAML→技術スタック→v0→ZIP→Cursorの開発フロー紹介 | https://x.com/yoshi8__/status/1849597728738984109 |
| @fadysan_rh | 2025/2/2 | 生成AIツール全体の使い分け紹介（Cursor含む） | https://x.com/fadysan_rh/status/1885851372882674078 |
| @fadysan_rh | 2025/2/8 | Cursorのエージェント・Yoloモード活用で時給4万円の研修案件獲得 | https://x.com/fadysan_rh/status/1887985792804651150 |
| @gorilla0513 | 2025/2/10 | Zenn記事「Cursorの本当の使い方を徹底解説」の共有 | https://x.com/gorilla0513/status/1888808234586349947 |
| @KeisukeShibata_ | 2025/2/14 | SpecStory拡張機能でCursorにMemory Bank機能を実現 | https://x.com/KeisukeShibata_/status/1890332709387686139 |
| @Jessicazu418 | 2025/2/17 | Cursorで実装時間を1/5にする具体的手法の技術記事 | https://x.com/Jessicazu418/status/1891357051613573628 |
| @PrajwalTomar_ | 2025/3/17 | Cursor + Supabase + MCPでAI駆動MVP開発の手法解説 | https://x.com/PrajwalTomar_/status/1901640012346568869 |
| @PrajwalTomar_ | 2025/5/7 | Cursor + Supabase + MCPによるMVP開発手法の続編 | https://x.com/PrajwalTomar_/status/1920114778007015851 |
| @akira_papa_IT | 2025/8/8 | Cursor CLIベータ版リリース。ターミナルからAIコーディング支援が可能に | https://x.com/akira_papa_IT/status/1953562609984450896 |
| @suh_sunaneko | 2025/11/1 | 非エンジニアにとってCursorがちょうど良いツールである理由 | https://x.com/suh_sunaneko/status/1984489338470822387 |
| @yuzu_curiosity | 2025/11/15 | Cursorを使ったプロダクトローンチの修正改善プロセス | https://x.com/yuzu_curiosity/status/1989593890723069992 |
| @MacopeninSUTABA | 2025/11/19 | Cursorで要件定義プロセスを改善する実践的手法 | https://x.com/MacopeninSUTABA/status/1990948639368491088 |
| @yuzu_curiosity | 2025/11/24 | CursorとAntigravityの比較。現状Cursorの方が使いやすい | https://x.com/yuzu_curiosity/status/1992821379218145305 |
| @cursor_ai | 2026/3/5 | Cursor Automationsが発表、常時稼働エージェントの構築が可能に | https://x.com/cursor_ai/status/2029604182286856663 |
