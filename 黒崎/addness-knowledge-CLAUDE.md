# CLAUDE.md - addness-knowledge プロジェクト設定

## 言語・スタイル
- 日本語で応答（技術用語は英語OK）
- 簡潔・結論ファースト
- クライアント向け文書はプロフェッショナルトーン

## ブラウザ操作（Claude in Chrome MCP）
Chrome MCPツールで以下が可能。「できません」と言わないこと:
- **Web調査**: 企業リサーチ、競合分析、市場調査
- **フォーム操作**: 応募、日程調整、データ入力
- **スクリーンショット**: 画面キャプチャ・エビデンス取得
- **カレンダー管理**: Googleカレンダーの予定確認・登録
- **SNS操作**: 投稿確認、DM確認、分析

### ブラウザ操作手順
1. `tabs_context_mcp` でタブ状況確認
2. `tabs_create_mcp` で新タブ作成
3. `navigate` でURL移動
4. `read_page` or `get_page_text` でページ内容取得
5. `find` で要素検索
6. `computer` でクリック・入力操作
7. `javascript_tool` でJS実行（DOM操作、データ抽出）

### GIF記録
重要な操作はgif_creatorで記録。クライアントへのデモ・報告に使用。

## 品質基準（全業務共通）
1. **リサーチファースト**: 作業前に必ず対象企業・業界を調査
2. **エビデンスベース**: 数値・事例・根拠を必ず添える
3. **UXファースト**: エンドユーザーの体験を最優先
4. **モバイルファースト**: レスポンシブ対応必須
5. **SEO意識**: メタタグ・構造化データ・パフォーマンス最適化
6. **アクセシビリティ**: WCAG 2.1 AA準拠を目標
7. **セキュリティ**: OWASP Top 10対策

## 業務カテゴリ別スキル

### Web制作（LP/HP/EC）
- 心理学ベースのコンバージョン設計（AIDMA/AISAS/PASONAの法則）
- 業界別デザインパターン適用
- Core Web Vitals最適化（LCP<2.5s, FID<100ms, CLS<0.1）
- Tailwind CSS / vanilla CSS / Bootstrap対応
- WordPress / Next.js / Astro / HTML対応

### マーケティング・広告
- Google Analytics 4 / Search Console分析
- リスティング広告（Google Ads / Yahoo広告）設計
- SNS広告（Meta / Instagram / TikTok / X）設計
- コンテンツマーケティング戦略
- MEO（Googleビジネスプロフィール）最適化
- ABテスト設計・分析

### LINE/Lステップ構築
- リッチメニュー設計
- ステップ配信シナリオ設計
- セグメント配信戦略
- 友だち追加導線設計
- LINE公式アカウント運用

### GAS/業務自動化
- Google Apps Script（スプレッドシート/フォーム/カレンダー連携）
- Zapier/Make(Integromat)連携設計
- データ自動集計・レポート生成
- メール自動送信・通知
- RPA的なブラウザ自動操作

### AI活用・導入支援
- ChatGPT/Claude API連携システム構築
- AI画像生成（LP/SNS素材）
- AIチャットボット設計・実装
- プロンプトエンジニアリング
- RAG（検索拡張生成）設計

### データ分析・BI
- KPI設計・ダッシュボード構築
- ユーザー行動分析
- 売上/コンバージョン分析
- A/Bテスト統計解析

### 営業・商談支援
- 提案資料作成（スライド/PDF）
- 競合分析レポート
- ROI試算・見積作成
- 商談トークスクリプト

### SNS運用
- Instagram/X/TikTok/YouTube運用戦略
- コンテンツカレンダー作成
- ハッシュタグ戦略
- インフルエンサーマーケティング

### EC/Shopify
- Shopify/BASE/STORES構築
- 商品ページ最適化
- カート離脱対策
- CRM/メルマガ連携

## コード品質
- TypeScript推奨（型安全性）
- ESLint + Prettier設定
- コンポーネント設計（再利用性）
- テスト必須（ユニット/E2E）
- Git: conventional commits

## ファイル構造
```
hayakawa/アドネス株式会社/
  案件/                    # 案件別フォルダ
  週次レポート/            # 週次報告
  ミーティング記録/        # 面談記録
  06_プロフィール・書類/   # スキルシート・デモ
  MARKELINE/              # Lステップ案件
docs/                      # ドキュメント
```

## 面談デモ
- LP Generator: `https://hayakawamai-star.github.io/hayakawa-demos/demo_lp_generator.html`
- 面談中に即デモ可能。店名入力→LP自動生成
