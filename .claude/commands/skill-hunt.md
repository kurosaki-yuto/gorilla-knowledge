---
description: 他の人が後悔するほど便利なClaude Codeスキルを探し出してインストールする
allowed-tools: Read, Write, Edit, Bash(git:*), Bash(ls:*), Bash(mkdir:*), Bash(cp:*), Bash(curl:*), WebSearch, WebFetch, Agent
argument-hint: "[ジャンル] (例: フロントエンド, DevOps, AI, 全部)"
skills: skill-hunter
---

# Skill Hunter 起動

ユーザーの要望: $ARGUMENTS

skill-hunter スキルの手順に従って、以下を実行せよ:

1. まずユーザーの既存スキルを確認（`~/.claude/skills/` と `.claude/skills/`）
2. 引数があればそのジャンルに絞る。なければヒアリングする
3. **必ず複数の research-expert サブエージェントを並列起動**して情報収集:
   - Agent 1: awesome-claude-code (hesreallyhim) のリソーステーブルを取得・分析
   - Agent 2: awesome-claude-skills (ComposioHQ) のREADMEを取得・分析
   - Agent 3: Zenn/Medium/Dev.to の最新記事から評判を収集
   - Agent 4: GitHub トレンドリポジトリを検索
4. 結果を統合してスコアリング、レポートを提示
5. ユーザーが選んだスキルをインストール
