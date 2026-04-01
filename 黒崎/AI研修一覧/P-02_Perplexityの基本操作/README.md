# P-02: Perplexityの基本操作〜はじめてのAI検索

> 標準学習時間: 12分
> レベル: 入門（全社員向け）
> 形式: スライド動画（実演2本含む） + 確認テスト

---

## メタデータ

| 項目 | 内容 |
|-----|------|
| コンテンツID | P-02 |
| タイトル | Perplexityの基本操作〜はじめてのAI検索 |
| 標準学習時間 | 12分 |
| 対象者 | 全社員（ITスキル不問） |
| 前提知識 | なし |
| 最終更新 | 2026年4月 |

## 学習目標

この動画を見終わると、以下ができるようになります：

1. **Perplexityにアクセスして基本検索ができる**
2. **回答の出典（Citation）を確認してファクトチェックできる**
3. **フォローアップ質問で対話的に深掘りできる**

## 修了条件

- 動画を最後まで視聴完了
- 確認テスト 80%以上（5問中4問正解）

---

## 成果物一覧

| ファイル | 内容 |
|---------|------|
| [台本.md](./台本.md) | ナレーション台本（スライドごと） |
| [テスト.md](./テスト.md) | 確認テスト（5問・選択式） |
| [narrations.json](./narrations.json) | ナレーションJSON（動画生成用） |
| [プレゼン.html](./プレゼン.html) | アニメーション付きHTMLスライド（Notebook Tabsテーマ） |
| [generate_slides.js](./generate_slides.js) | PPTX生成スクリプト |

## 実演動画

本コースにはスライド5・スライド8に実演録画が組み込まれます。

| スライド | 録画ファイル | 尺 | 内容 |
|---------|------------|-----|------|
| 5 | basic-search.webm | 33秒 | Perplexityで基本検索を実演 |
| 8 | followup.webm | 52秒 | フォローアップ質問を実演 |

## 動画ビルド

```bash
# 1. PPTX生成
node generate_slides.js

# 2. 実演込み動画ビルド（build-p02.py使用）
python3 /Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/_pipeline/build-p02.py
```

## Perplexity最新情報（2026年4月時点）

- 評価額226億ドル、ARR 2億ドル、月間4500万ユーザー
- 料金: Free（Quick Search無制限）/ Pro $20/月 / Max $200/月
- 主要機能: Quick Search、Pro Search、Deep Research、Focus、Spaces、Perplexity Computer、Comet（AIブラウザ）
