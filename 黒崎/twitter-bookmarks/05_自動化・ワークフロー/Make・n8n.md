# Make・n8n

## 概要
n8nはオープンソースのワークフロー自動化ツールで、ノーコードで複雑な業務自動化を構築できる。
Claude CodeやCursorとMCPサーバー経由で連携し、AIにワークフロー構築を任せる「Vibe Coding」スタイルが注目されている。
AAAモデル（AI Automation Agency）においてもn8nは中核ツールとして位置づけられている。

## ツール・サービス
| 名前 | 概要 | URL |
|------|------|-----|
| n8n | オープンソースのワークフロー自動化プラットフォーム | https://n8n.io |
| n8n MCPサーバー | n8nワークフローをAI（Claude Code/Cursor）から直接編集できるサーバー | - |
| Make (Integromat) | クラウド型ワークフロー自動化ツール | https://make.com |

## 知見・ナレッジ

### n8n x AI（Claude Code / Cursor）連携
- n8nのMCPサーバーを使えば、ワークフローをAIで直接編集・作成できる
- Claude CodeやCursorと組み合わせることで、ポチポチ作業を最小限にできる
- Claude Codeでn8nワークフローを指示するだけで変更・完成させられる
- 出典: @AI_masaou (https://x.com/AI_masaou/status/1956302822066286715)

### n8nのVibe Coding化
- Claude Code x n8nでワークフローもVibe codingの時代へ
- Claude Desktopではトークン数制限があったが、Claude Codeなら超複雑ワークフローも構築可能
- Claudeでn8nワークフローが完成し、一部の変更も指示するだけで対応可能
- 出典: @Shimayus (https://x.com/Shimayus/status/1941658849213284729, https://x.com/Shimayus/status/1951150040241807516)

### n8nの脆弱性情報
- n8nにCVSS 9.9の深刻なRCE脆弱性が発見され、10万超のインスタンスが影響を受けた
- セルフホスト運用時はセキュリティアップデートの適用が重要
- 出典: @nakajimeeee (https://x.com/nakajimeeee/status/2003602990561960054)

### AAAモデル（AI Automation Agency）でのn8n活用
- リアム・オットリーのAAAモデルでは、n8n・Botpress等のノーコードツールを組み合わせて企業の業務自動化を提供
- ツール納品ではなくROI（投資対効果）の提供として高単価で販売
- 出典: @kumataro_design（AAA事例研究）

### Difyとn8nの使い分け
- Difyとn8nは代替ではなく共存関係。「作った仕組みと人がどう関わるか」が大きな違い
- Difyは対話型AIアプリ向け、n8nはバックエンドのワークフロー自動化向け
- 出典: @rik423__ai (https://x.com/rik423__ai/status/1925865540515496364)

## 参考ツイート一覧
| 投稿者 | 日付 | 要約 | URL |
|--------|------|------|-----|
| @Shimayus | 2025/07/06 | n8nのワークフローをClaudeで完成させる方法の紹介 | https://x.com/Shimayus/status/1941658849213284729 |
| @Shimayus | 2025/08/01 | Claude Code x n8nでVibe codingスタイルのワークフロー構築 | https://x.com/Shimayus/status/1951150040241807516 |
| @AI_masaou | 2025/08/15 | n8n MCPサーバーでAIからワークフローを直接編集する方法 | https://x.com/AI_masaou/status/1956302822066286715 |
| @nakajimeeee | 2025/12/24 | n8nにCVSS 9.9の深刻なRCE脆弱性、10万超インスタンスが影響 | https://x.com/nakajimeeee/status/2003602990561960054 |
