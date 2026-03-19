# Supabase セットアップ情報

## 接続情報

```
Project URL:  https://tkdwqsoyheousodvtmuj.supabase.co
Anon Key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjA4MTYsImV4cCI6MjA4OTQ5NjgxNn0.7udwO6nMGyisej4b43suN9bHbAWvXiT6GinGtUdlRmU
Region:       Oceania (Sydney) - ap-southeast-2
```

## .env.local にコピペする内容

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tkdwqsoyheousodvtmuj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjA4MTYsImV4cCI6MjA4OTQ5NjgxNn0.7udwO6nMGyisej4b43suN9bHbAWvXiT6GinGtUdlRmU
```

## テーブル一覧（9テーブル）

| テーブル | 用途 |
|---------|------|
| companies | 企業（契約・領収書） |
| users | 受講者 + 管理者 |
| trainings | 研修 |
| categories | カテゴリー |
| courses | 講座（動画・コンテンツ） |
| quizzes | テスト問題 |
| watch_logs | 視聴ログ |
| quiz_results | テスト結果 |
| completions | 修了記録 |

## テーブル再作成（リセット）

SQL Editorで `create_tables.sql` を実行すれば全テーブルがリセット+再作成される。

## CLIからデータ操作

```bash
# 全ユーザー取得
curl -s "https://tkdwqsoyheousodvtmuj.supabase.co/rest/v1/users?select=id,name,role,company_name" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# ユーザー追加
curl -s -X POST "https://tkdwqsoyheousodvtmuj.supabase.co/rest/v1/users" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id":"user001","password_hash":"$2b$10$xxx","name":"田中太郎","company_name":"テスト株式会社","role":"student"}'

# 研修追加
curl -s -X POST "https://tkdwqsoyheousodvtmuj.supabase.co/rest/v1/trainings" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"name":"AI基礎研修","description":"AIの基礎を学ぶ"}'

# 講座追加
curl -s -X POST "https://tkdwqsoyheousodvtmuj.supabase.co/rest/v1/courses" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"category_id":"UUID","name":"講座名","video_url":"https://youtube.com/...","duration_seconds":300}'

# データ削除（全件）
curl -s -X DELETE "https://tkdwqsoyheousodvtmuj.supabase.co/rest/v1/watch_logs?id=not.is.null" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 管理者ログイン

```
ID: admin
PW: admin1234
```
