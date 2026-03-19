# AI研修講座 開発ナレッジ

## 概要

AI研修の一環として、企業向け動画研修プラットフォーム「AI寺子屋」を2つのNext.jsアプリとして構築した。

- **skillplus-lms** : 受講者向けの学習管理システム（LMS）
- **skillplus-admin** : 管理者向けの講座・ユーザー管理ダッシュボード

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| UIコンポーネント | shadcn/ui (LMS側), BlockNote (Admin側) |
| 認証 | JWT (jose) + bcryptjs |
| データストア | Mock Adapter（インメモリ）※ Supabase対応準備済 |

## アーキテクチャ

### データ構造（3階層）

```
Training（研修プログラム）
  └── Category（カテゴリ）
        └── Course（講座 = 動画1本）
```

### 認証フロー

1. ユーザーがID/パスワードでログイン
2. bcryptでパスワード検証
3. JWTトークン発行（HS256, 7日間有効）
4. HTTP-only Cookieに保存
5. APIアクセス時にCookieからセッション検証

### DB層の設計

`DatabaseAdapter` インターフェースを定義し、MockAdapterで実装。将来的にSupabaseなど実DBに差し替え可能な設計にした。

```typescript
// src/lib/db/index.ts
export interface DatabaseAdapter {
  getTrainings(): Promise<Training[]>
  createTraining(data: Partial<Training>): Promise<Training>
  // ... 26メソッド
}
```

## skillplus-lms（受講者向け）

### 主な機能

- **ログイン**: ユーザーID/パスワード認証
- **研修一覧**: 全研修プログラムをカード表示
- **カテゴリ・講座ブラウズ**: 階層的にドリルダウン
- **動画視聴**: YouTube埋め込みプレーヤーで視聴
- **進捗トラッキング**: 視聴時間を1秒ごとに記録
- **不正防止**: 早送り防止（3秒以上先にスキップすると巻き戻し）
- **完了判定**: 動画の長さ - 10秒以上視聴で完了扱い

### ルーティング（App Router）

```
/                           → ホーム（研修一覧）
/login                      → ログイン
/[trainingId]               → 研修詳細
/[trainingId]/[categoryId]  → カテゴリ内の講座一覧
/[trainingId]/[categoryId]/[courseId] → 動画視聴ページ
```

### API エンドポイント

| エンドポイント | メソッド | 用途 |
|--------------|---------|------|
| `/api/auth` | POST/GET/DELETE | ログイン/セッション確認/ログアウト |
| `/api/trainings` | GET | 研修一覧取得 |
| `/api/categories?trainingId=` | GET | カテゴリ取得 |
| `/api/courses?categoryId=` | GET | 講座取得 |
| `/api/progress` | GET/POST | 視聴履歴の取得/保存 |

### 動画プレーヤーの実装ポイント

- YouTube iframe APIを使用
- 1秒間隔のインターバルで視聴時間を記録
- `beforeunload` イベントで `navigator.sendBeacon()` を使い、ページ離脱時も視聴データを送信
- 早送り検知: 前回位置から3秒以上先に飛んだ場合、自動で巻き戻し

## skillplus-admin（管理者向け）

### 主な機能

- **講座管理**: 研修/カテゴリ/講座のCRUD操作（3階層を1画面で管理）
- **コースエディタ**: BlockNoteリッチテキストエディタ + YouTube動画設定
- **ユーザー管理**: 受講者アカウントの作成・編集・削除
- **進捗確認**: 全受講者の視聴履歴・完了状況を一覧表示

### コースエディタの特徴

- 3つのセクション（動画上テキスト / 動画 / 動画下テキスト）
- ドラッグ&ドロップでセクション順序を変更可能
- BlockNoteエディタでリッチテキスト編集
- YouTube URLを入力するとプレビュー表示
- 動画の長さ（秒）を設定可能

### API エンドポイント

| エンドポイント | メソッド | 用途 |
|--------------|---------|------|
| `/api/auth` | POST/GET/DELETE | ログイン/セッション/ログアウト |
| `/api/admin?type=` | GET | データ取得（trainings/categories/courses/users/progress） |
| `/api/admin` | POST | CRUD操作（action パラメータで振り分け） |

## モックデータ

開発用に以下のデータを用意:

- **研修**: 新入社員研修 2025, マネジメント研修, IT基礎スキル研修
- **カテゴリ**: ビジネスマナー, コミュニケーション基礎, 情報セキュリティ 等 計7-8件
- **講座**: 挨拶と第一印象, 名刺交換のマナー, Excel基本操作 等 計12件
- **ユーザー**: user001/test1234（受講者）, admin/admin1234（管理者）

## 学んだこと・Tips

### Next.js 16 App Router

- Server ComponentとClient Componentの使い分けが重要
- `"use client"` を付けるのはインタラクティブな操作が必要なコンポーネントだけ
- API Routeは `route.ts` に `GET`, `POST`, `DELETE` 等をexportする形式

### BlockNote エディタ

- SSR非対応のため `dynamic import` + `ssr: false` で読み込む必要がある
- エディタの内容はJSON形式でシリアライズ/デシリアライズする

### JWT認証

- `jose` ライブラリはEdge Runtime対応で Next.js と相性が良い
- HTTP-only Cookieに保存することでXSS対策になる
- トークンの有効期限は用途に応じて設定（今回は7日間）

### shadcn/ui

- `components.json` で設定後、必要なコンポーネントだけ `npx shadcn@latest add` でインストール
- カスタマイズしやすく、Tailwindとの相性が良い

## ディレクトリ構成

ソースコードは以下のディレクトリに格納:

- `松本/skillplus-lms/` : LMS側の全ソースコード
- `松本/skillplus-admin/` : Admin側の全ソースコード
