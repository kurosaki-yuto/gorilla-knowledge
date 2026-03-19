-- 講座のテストタイプ追加
-- quiz: LMS内自動採点テスト
-- pdf: PDF添付型（自己申告）
-- none: テストなし
ALTER TABLE courses ADD COLUMN IF NOT EXISTS quiz_type TEXT NOT NULL DEFAULT 'none' CHECK (quiz_type IN ('quiz', 'pdf', 'none'));
ALTER TABLE courses ADD COLUMN IF NOT EXISTS quiz_pdf_url TEXT DEFAULT '';
