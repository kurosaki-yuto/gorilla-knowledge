# P-04: セキュリティ・コンプライアンス・対象者〜Gemini Enterpriseのセキュアな使い方

> 標準学習時間: 12分
> レベル: 実践（全社員・特にセキュリティ責任者・企画部向け）
> 形式: スライド動画（スライド説明のみ）

---

## メタデータ

| 項目 | 内容 |
|-----|------|
| コンテンツID | P-04 |
| タイトル | セキュリティ・コンプライアンス・対象者〜Gemini Enterpriseのセキュアな使い方 |
| 標準学習時間 | 12分 |
| 対象者 | 全社員（特にセキュリティ責任者・経営層・企画部・システム管理者） |
| レベル | 実践 |
| 前提知識 | P-01・P-02・P-03（Gemini Enterprise・Google Workspace統合の基本） |
| 情報基準日 | 2026年4月 |

## 学習目標

この動画を見終わると、以下ができるようになります：

1. **Gemini Enterprise のセキュリティ機能（CMEK・EKM・VPC Service Controls）を理解し、企業のセキュリティ要件に合わせた導入を判断できる**
2. **HIPAA・FedRAMP・ISO 27001・SOC2・PCI DSS などのコンプライアンス認証を知り、自社の業界要件に合った導入プランを立案できる**
3. **Gemini Enterprise が向いている企業・業界・職種を特定し、最適な展開戦略を提案できる**
4. **セキュリティと利便性のバランスを理解し、組織に合った運用方針を決定できる**

## 修了条件

- 動画を最後まで視聴完了
- 確認テスト 80%以上（5問中4問正解）

---

## スライド構成（12枚）

| # | タイトル | 形式 |
|---|---------|------|
| 1 | タイトル | タイトルスライド |
| 2 | 今日のゴール | 通常 |
| 3 | Gemini Enterprise のセキュリティ全体像 | 通常 |
| 4 | CMEK・EKM・VPC Service Controls とは | 通常 |
| 5 | 暗号化キー管理：3つのレベル | 通常 |
| 6 | コンプライアンス認証ガイド | 通常 |
| 7 | HIPAA・FedRAMP 準備企業の導入事例 | 通常 |
| 8 | 業界別：向いている企業・向かない企業 | 通常 |
| 9 | 職種別：Gemini企業向きの人・そうでない人 | 通常 |
| 10 | セキュリティ vs 利便性のバランス | 通常 |
| 11 | まとめ：導入チェックリスト | 通常 |
| 12 | エンド（次回予告P-05） | 通常 |

---

## 成果物一覧

| ファイル | 内容 |
|---------|------|
| [台本.md](./台本.md) | ナレーション台本（スライドごと） |
| [テスト.md](./テスト.md) | 確認テスト（5問・4択・解説付き） |
| [narrations.json](./narrations.json) | ナレーションJSON（動画生成用） |
| [generate_slides.js](./generate_slides.js) | PPTX生成スクリプト |
| [スライド.pptx](./スライド.pptx) | 生成されたPPTXスライド |
| [動画.mp4](./動画.mp4) | ナレーション同期の最終動画 |

---

## 主要概念用語集

| 用語 | 説明 |
|------|------|
| **CMEK** | Customer Managed Encryption Keys - 顧客が独自の暗号化キーを持つ方式 |
| **EKM** | External Key Manager - Google Cloud外のキー管理サービスを使用 |
| **VPC Service Controls** | バーチャルプライベートクラウド内での安全な実行 |
| **DLP** | Data Loss Prevention - データ流出防止機能 |
| **HIPAA** | Health Insurance Portability and Accountability Act - 医療データ保護規制 |
| **FedRAMP** | Federal Risk and Authorization Management Program - 米国政府機関向け認証 |
| **ISO 27001** | 情報セキュリティ国際標準 |
| **SOC2** | Service Organization Control 2 - 監査報告書 |
| **PCI DSS** | Payment Card Industry Data Security Standard - クレジットカード業界標準 |

---

## 学習のコツ

- 自社の業界・職種・セキュリティ要件を明確にしてから視聴してください
- テスト解説で初心者向けの説明を用意しました
- セキュリティ用語が難しいと感じたら、用語集を参考に何度も見直してください
