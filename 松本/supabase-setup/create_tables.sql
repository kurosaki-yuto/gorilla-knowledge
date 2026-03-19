-- ==========================================
-- AI寺子屋 LMS - 本番データベーススキーマ
-- 要件定義書 + 受講生側コード準拠
-- 最終更新: 2026-03-19
-- ==========================================

-- クリーンアップ
DROP TABLE IF EXISTS completions CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS watch_logs CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS trainings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS viewing_history CASCADE;

-- updated_at 自動更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 1. companies（企業）
-- 要件: 企業の登録（契約情報）
-- 出力: 領収書PDF（企業名・住所・月額）
-- ==========================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- 企業名
  contact_name TEXT,                           -- 担当者名
  contact_email TEXT,                          -- 担当者メール
  phone TEXT,                                  -- 電話番号
  address TEXT,                                -- 住所（領収書用）
  contract_start_date DATE,                    -- 契約開始日
  contract_end_date DATE,                      -- 契約終了日
  plan TEXT NOT NULL DEFAULT 'standard',       -- プラン
  monthly_fee INT DEFAULT 0,                   -- 月額料金（領収書用）
  max_users INT DEFAULT 50,                    -- 最大ユーザー数
  is_active BOOLEAN NOT NULL DEFAULT true,     -- 有効/無効
  notes TEXT DEFAULT '',                       -- 備考
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_companies_updated
  BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 2. users（受講者 + 管理者）
-- 要件: 受講者の登録（企業に紐づく）
-- コード: User { id, passwordHash, name, companyName, role, createdAt }
-- CSV出力: 受講者名
-- 修了証: 受講者氏名
-- ==========================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,                         -- ログインID（コード: User.id）
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,  -- 所属企業FK
  company_name TEXT DEFAULT '',                -- 会社名（直接入力用、コード: User.companyName）
  password_hash TEXT NOT NULL,                 -- bcryptハッシュ（コード: User.passwordHash）
  name TEXT NOT NULL,                          -- 氏名（コード: User.name）
  email TEXT,                                  -- メールアドレス
  role TEXT NOT NULL DEFAULT 'student'
    CHECK (role IN ('admin', 'student')),       -- 権限（コード: User.role）
  is_active BOOLEAN NOT NULL DEFAULT true,     -- 有効/無効
  last_login_at TIMESTAMPTZ,                   -- 最終ログイン日時
  must_change_password BOOLEAN DEFAULT false,  -- 初回パスワード変更
  created_at TIMESTAMPTZ NOT NULL DEFAULT now() -- コード: User.createdAt
);

CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_role ON users(role);

-- ==========================================
-- 3. trainings（研修）
-- コード: Training { id, name, description, createdAt, updatedAt }
-- ==========================================
CREATE TABLE trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- コード: Training.name
  description TEXT DEFAULT '',                 -- コード: Training.description
  is_published BOOLEAN NOT NULL DEFAULT false, -- 公開状態
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_trainings_updated
  BEFORE UPDATE ON trainings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 4. categories（カテゴリー）
-- コード: Category { id, trainingId, name, description, order, createdAt, updatedAt }
-- ==========================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,  -- コード: Category.trainingId
  name TEXT NOT NULL,                          -- コード: Category.name
  description TEXT DEFAULT '',                 -- コード: Category.description
  sort_order INT NOT NULL DEFAULT 0,           -- コード: Category.order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_training ON categories(training_id);

CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 5. courses（講座 = コンテンツ）
-- コード: Course { id, categoryId, name, description, videoUrl, isPublished, durationSeconds, thumbnailUrl, createdAt, updatedAt }
-- CSV出力: コンテンツID, コンテンツ名, 標準学習時間（分）
-- 修了証: コンテンツ名, 標準学習時間
-- カリキュラム一覧PDF: ID, タイトル, 標準学習時間
-- ==========================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,  -- コード: Course.categoryId
  name TEXT NOT NULL,                          -- コード: Course.name
  description TEXT DEFAULT '',                 -- コード: Course.description
  video_url TEXT DEFAULT '',                   -- コード: Course.videoUrl
  is_published BOOLEAN NOT NULL DEFAULT false, -- コード: Course.isPublished
  duration_seconds INT NOT NULL DEFAULT 0,     -- コード: Course.durationSeconds（完了判定: -10秒許容）
  level TEXT DEFAULT '入門'
    CHECK (level IN ('入門', '実践', '応用', '管理者')),  -- 要件定義書: レベル
  thumbnail_url TEXT DEFAULT '',               -- コード: Course.thumbnailUrl
  content_json JSONB DEFAULT '[]',             -- BlockNoteエディタのJSON
  sort_order INT NOT NULL DEFAULT 0,           -- 表示順
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_published ON courses(is_published);

CREATE TRIGGER trg_courses_updated
  BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 6. quizzes（テスト問題）
-- コード: Quiz { id, courseId, question, choices: string[], correctAnswer: number, order }
-- 要件: 選択式テスト（3〜5問/コンテンツ）、合格判定80%
-- ==========================================
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,  -- コード: Quiz.courseId
  question TEXT NOT NULL,                      -- コード: Quiz.question
  choices JSONB NOT NULL DEFAULT '[]',         -- コード: Quiz.choices（string[]をJSONBで格納）
  correct_answer INT NOT NULL DEFAULT 0,       -- コード: Quiz.correctAnswer（choicesのインデックス）
  sort_order INT NOT NULL DEFAULT 0,           -- コード: Quiz.order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quizzes_course ON quizzes(course_id);

-- ==========================================
-- 7. watch_logs（視聴ログ）
-- コード: ViewingHistory { id, userId, courseId, date, startTime, endTime, durationSeconds, progress, isComplete }
-- コードの完了判定: actualViewingSeconds >= (durationSeconds - 10)
-- CSV出力: 視聴開始日時, 視聴完了日時
-- ==========================================
CREATE TABLE watch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,     -- コード: ViewingHistory.userId
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE, -- コード: ViewingHistory.courseId
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),    -- コード: ViewingHistory.startTime（CSV出力）
  completed_at TIMESTAMPTZ,                         -- コード: ViewingHistory.endTime（CSV出力、NULL=未完了）
  duration_seconds INT NOT NULL DEFAULT 0,          -- コード: ViewingHistory.durationSeconds
  progress INT NOT NULL DEFAULT 0,                  -- コード: ViewingHistory.progress（0 or 100）
  is_completed BOOLEAN NOT NULL DEFAULT false,      -- コード: ViewingHistory.isComplete
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_watch_logs_user ON watch_logs(user_id);
CREATE INDEX idx_watch_logs_course ON watch_logs(course_id);
CREATE INDEX idx_watch_logs_user_course ON watch_logs(user_id, course_id);

-- ==========================================
-- 8. quiz_results（テスト結果）
-- コード: QuizResult { id, userId, courseId, score, passed, takenAt, answers: number[] }
-- 要件: 合格判定（正答率80%以上）
-- CSV出力: テスト合否
-- ==========================================
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,     -- コード: QuizResult.userId
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE, -- コード: QuizResult.courseId
  score INT NOT NULL DEFAULT 0
    CHECK (score >= 0 AND score <= 100),            -- コード: QuizResult.score（正答率%）
  passed BOOLEAN NOT NULL DEFAULT false,            -- コード: QuizResult.passed（80%以上）
  answers JSONB DEFAULT '[]',                       -- コード: QuizResult.answers（number[]）
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now()        -- コード: QuizResult.takenAt
);

CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_user_course ON quiz_results(user_id, course_id);

-- ==========================================
-- 9. completions（修了記録）
-- コード: Completion { id, userId, courseId, videoCompleted, quizPassed, completedAt, certificateIssued }
-- コードの修了ロジック:
--   テストあり → videoCompleted && quizPassed → completedAt設定
--   テストなし → videoCompleted → completedAt即設定
-- 要件: 未修了の人には修了証が出せない制御必須
-- CSV出力: 修了ステータス, 修了日
-- 修了証PDF: 修了日
-- ==========================================
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,     -- コード: Completion.userId
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE, -- コード: Completion.courseId
  video_completed BOOLEAN NOT NULL DEFAULT false,      -- コード: Completion.videoCompleted
  quiz_passed BOOLEAN NOT NULL DEFAULT false,           -- コード: Completion.quizPassed
  completed_at TIMESTAMPTZ,                             -- コード: Completion.completedAt（修了日）
  certificate_issued BOOLEAN NOT NULL DEFAULT false,    -- コード: Completion.certificateIssued
  certificate_issued_at TIMESTAMPTZ,                    -- 修了証発行日（要件追加）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_completions_user ON completions(user_id);
CREATE INDEX idx_completions_course ON completions(course_id);
CREATE INDEX idx_completions_completed ON completions(completed_at);

-- ==========================================
-- RLS + ポリシー
-- ==========================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON trainings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON watch_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON quiz_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON completions FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 初期データ: 管理者のみ
-- ログインID: admin / パスワード: admin1234
-- ==========================================
INSERT INTO users (id, password_hash, name, company_name, role, must_change_password) VALUES
  ('admin', '$2b$10$lHEGUk7Ae0ww3pucqoP6Aea52E.dtEfmI.5G0DXLLyE73coeu0fD6', '管理者', 'AI寺子屋', 'admin', true);
