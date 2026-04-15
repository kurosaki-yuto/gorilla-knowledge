# AIフレームワーク・SDK（2026年3月版）

> エージェント構築のための主要SDK・フレームワーク比較

## 概要

2025年後半から2026年にかけて、AIエージェント構築のためのSDK・フレームワークが急速に成熟した。各社がエージェントループ、マルチエージェント連携、ツール実行、MCP統合といった機能を標準装備し、開発者は少ないコードで本格的なエージェントを構築できるようになっている。本ドキュメントでは主要4つのSDK/フレームワークを比較する。

---

## 1. Vercel AI SDK

### 最新バージョン・主要変更点

**AI SDK v6**（2026年初頭リリース）が現行の最新メジャーバージョン。v5からの主な進化点は以下の通り。

- **ToolLoopAgent クラス**: エージェントループを本格サポート。LLM呼び出し → ツール実行 → 結果追加 → 再呼び出しのサイクルを自動管理（デフォルト最大20ステップ）
- **Human-in-the-loop ツール承認**: ツール実行前にユーザー承認を挟むワークフローをネイティブサポート
- **MCP統合の安定化**: `@ai-sdk/mcp` パッケージでOAuth認証、リソース、プロンプトテンプレート、エリシテーション（サーバーからのユーザー入力要求）をフルサポート
- **DevTools**: エージェントの実行ステップをデバッグ・可視化するツール群
- **画像編集・リランキング**: マルチモーダル対応の拡充
- **v5からの自動マイグレーション**: `npx @ai-sdk/codemod v6` で移行可能

v5での変更（v6に引き継ぎ）:
- ツール定義を MCP仕様に合わせ `parameters` → `inputSchema`、`result` → `output` にリネーム
- `dynamicTool` 関数で実行時に型が決まる動的ツールをサポート

### 使い方・コード例

```typescript
import { ToolLoopAgent, stepCountIs } from "ai";

const agent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  system: "あなたは天気情報を提供するエージェントです。",
  tools: { weather: weatherTool },
  stopWhen: [stepCountIs(20)],
});

const result = await agent.generate({
  prompt: "東京の今日の天気は？",
});
```

### 料金・制約

- **SDK自体は無料・OSS**（Apache 2.0相当）
- LLMプロバイダーのAPI料金は別途発生（任意のプロバイダーを選択可能）
- Vercel AI Gateway（オプション）: LLMルーティングサービス。無料枠あり、従量課金でマークアップなし
- Vercel上にデプロイする場合はホスティング料金（関数実行時間・エグレス等）が別途発生
- TypeScript/Node.js環境が前提

---

## 2. Claude Agent SDK

### 概要・主要変更点

Claude Agent SDK は、Claude Code の内部で使われているエージェントループ・ツール管理・コンテキスト管理をそのままプログラマブルに利用できるSDK。Python版とTypeScript版が提供されている。

- **SubAgents**: `Task` ツールを通じてサブエージェントを起動。セキュリティレビュー、テスト分析など専門特化エージェントを並列実行可能
- **allowedTools によるパーミッション設計**: エージェントごとに使用可能なツール（Bash, Read, Grep, Glob 等）を明示的に制限
- **AgentDefinition**: サブエージェントの説明・プロンプト・ツールを定義。Claude が説明文を元にタスクに最適なサブエージェントを自動選択
- **ストリーミング対応**: `async for` でリアルタイムにメッセージを受信
- **構造化出力**: JSON Schema による出力型の強制

### 使い方・コード例

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

async for message in query(
    prompt="認証モジュールのセキュリティレビューをして",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob", "Task"],
        agents={
            "security-reviewer": AgentDefinition(
                description="セキュリティ専門のコードレビュアー",
                prompt="脆弱性、認証フロー、入力検証を重点的に確認",
                tools=["Read", "Grep", "Glob"],
            )
        },
    ),
):
    print(message)
```

### 料金・制約

- **SDK自体は無料・OSS**
- 裏側で Claude API を呼び出すため、**APIトークン課金**が発生
  - Sonnet 4.5 / 4.6: 入力 $3 / 出力 $15（100万トークンあたり）
  - Opus 4.6: より高額（公式価格表参照）
  - 200Kトークン超のプロンプト: 割増料金（入力 $6 / 出力 $22.50）
- システムプロンプトは自動キャッシュ（2回目以降は10%のコスト）
- Batch API 利用で50%割引（非リアルタイム処理向け）
- レート制限: 使用ティアにより RPM（リクエスト/分）が異なる

---

## 3. OpenAI Agents SDK

### 概要・主要変更点

OpenAI Agents SDK は、実験的だった Swarm フレームワークの後継として正式リリースされた軽量マルチエージェントフレームワーク。Python製。

- **Agent / Handoff / Guardrails**: 3つのプリミティブでエージェントシステムを構築
  - **Agent**: LLM + 指示 + ツール
  - **Handoff**: エージェント間のタスク委譲（LLMにはツールとして見える）
  - **Guardrails**: 入出力のバリデーション
- **Deep Research API 統合**: `o4-mini-deep-research-alpha` モデルでWebSearch付きの深掘り調査エージェントを構築可能
- **組み込みトレーシング**: エージェントの実行フロー可視化・デバッグ・評価・ファインチューニングに対応
- **Runner**: エージェントの実行を管理する統一インターフェース
- **Voice / Redis セッション**: オプションで音声対応やRedisベースのセッション管理が可能

### 使い方・コード例

```python
from agents import Agent, Runner
import asyncio

refund_agent = Agent(
    name="返金担当",
    instructions="返金リクエストを処理する専門エージェント",
)
triage_agent = Agent(
    name="振り分け担当",
    instructions="問い合わせ内容に応じて適切なエージェントに委譲",
    handoffs=[refund_agent],
)

result = await Runner.run(triage_agent, input="返品したいです")
print(result.final_output)
```

### 料金・制約

- **SDK自体は無料・OSS**（MIT License）
- `pip install openai-agents`（Python 3.10以上）
- OpenAI API の従量課金が別途発生（使用モデルに依存）
- Deep Research 利用時は `o4-mini-deep-research-alpha` モデルの料金が適用
- 現時点では Python のみ対応（TypeScript版は未提供）
- Handoff はLLMからはツール呼び出しとして見えるため、モデルのツール対応が前提

---

## 4. Mastra

### 概要・主要変更点

Mastra は Gatsby チームが開発した TypeScript 製 AI エージェントフレームワーク。Y Combinator 支援。プロトタイプからプロダクションまでをカバーする「バッテリー同梱」設計。

- **Agent / Workflow / RAG / Evals**: AI アプリに必要なプリミティブを一式提供
- **Agent Networks**: 複数エージェントのネットワーク構成。ルーティングエージェントが自身で処理するか、サブエージェントに委譲するかを自動判断
- **requestContextSchema**: ツール・エージェント・ワークフロー・ステップに Zod スキーマでリクエストコンテキストを定義。Studio UI にも反映
- **埋め込みドキュメント**: npm パッケージの `dist/docs/` にドキュメントを同梱。コーディングエージェントが `node_modules` から直接フレームワークの使い方を参照可能
- **フロントエンド統合**: React, Next.js, Node.js とネイティブ統合。スタンドアロンサーバーとしてもデプロイ可能
- **Mastra Studio**: エージェントとチャットできるビルトインUI

### 使い方・コード例

```typescript
import { Agent } from "@mastra/core";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const timeTool = createTool({
  id: "get-time",
  description: "指定タイムゾーンの現在時刻を取得",
  inputSchema: z.object({ timezone: z.string() }),
  execute: async ({ context }) =>
    new Date().toLocaleString("ja-JP", { timeZone: context.timezone }),
});

const agent = new Agent({
  name: "TimeAgent",
  instructions: "時刻に関する質問に答えるエージェント",
  model: openai("gpt-4o-mini"),
  tools: { timeTool },
});
```

### 料金・制約

- **完全無料・OSS**（Apache 2.0）
- `npm create mastra` でプロジェクト初期化
- LLMプロバイダーのAPI料金は別途発生（任意のプロバイダーを選択可能）
- TypeScript/Node.js 環境が前提
- Dify/n8n がノーコード・ローコードのワークフロービルダーであるのに対し、Mastra はコードファーストのフレームワーク。開発者がTypeScriptでフル制御したい場合に適する

---

## 比較表

| 観点 | Vercel AI SDK | Claude Agent SDK | OpenAI Agents SDK | Mastra |
|------|--------------|-----------------|-------------------|--------|
| 言語 | TypeScript | Python / TypeScript | Python | TypeScript |
| ライセンス | OSS（無料） | OSS（無料） | OSS（MIT） | OSS（Apache 2.0） |
| エージェントループ | ToolLoopAgent | query() + 自動ループ | Runner.run() | Agent + ネットワーク |
| マルチエージェント | ツール経由で委譲 | SubAgents（Task ツール） | Handoff | Agent Networks |
| MCP統合 | @ai-sdk/mcp（安定版） | ネイティブ対応 | なし（※要確認） | なし（※要確認） |
| ツール承認（HITL） | v6でネイティブ対応 | allowedTools で制御 | Guardrails | requestContextSchema |
| デバッグ・可視化 | DevTools | Claude Code連携 | 組み込みトレーシング | Mastra Studio |
| LLMプロバイダー | 任意（マルチプロバイダー） | Claude のみ | OpenAI のみ（※要確認） | 任意（マルチプロバイダー） |
| Deep Research | - | - | o4-mini対応 | RAG内蔵 |
| 音声対応 | - | - | オプション対応 | - |
| フロントエンド統合 | Next.js / React | - | - | Next.js / React |
| 初期化コマンド | `npm i ai` | `pip install claude-code-sdk` | `pip install openai-agents` | `npm create mastra` |
| 向いている用途 | Next.jsアプリにAI組込 | コードベース操作・自動化 | カスタマーサポート・調査 | TypeScriptでフルスタックAI |

---

## 選定ガイド

- **Next.js/React アプリにAI機能を追加したい** → Vercel AI SDK
- **コードベースの自動操作（レビュー・リファクタ・テスト）を自動化したい** → Claude Agent SDK
- **カスタマーサポートや調査タスクでマルチエージェントを組みたい（Python）** → OpenAI Agents SDK
- **TypeScriptでエージェント・ワークフロー・RAGを一気通貫で構築したい** → Mastra

---

## 関連ドキュメント

- [01_AIコーディングツール最新動向](./01_AIコーディングツール最新動向.md)
- [03_MCP・エージェント設計2026](./03_MCP・エージェント設計2026.md)
