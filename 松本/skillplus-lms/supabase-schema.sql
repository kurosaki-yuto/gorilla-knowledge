-- ==========================================
-- LMS助成金対応 Supabaseスキーマ
-- ==========================================

-- テスト問題
create table if not exists quizzes (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade,
  question text not null,
  choices jsonb not null,
  correct_answer integer not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- テスト結果
create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  score integer not null,
  passed boolean not null default false,
  answers jsonb not null,
  taken_at timestamptz default now()
);

-- 修了記録
create table if not exists completions (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  video_completed boolean default false,
  quiz_passed boolean default false,
  completed_at timestamptz,
  certificate_issued boolean default false,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);

-- ログイン記録
create table if not exists login_logs (
  id uuid default gen_random_uuid() primary key,
  user_id text references users(id) on delete cascade,
  login_at timestamptz default now(),
  logout_at timestamptz,
  ip_address text,
  user_agent text
);

-- インデックス
create index if not exists idx_quizzes_course on quizzes(course_id);
create index if not exists idx_quiz_results_user_course on quiz_results(user_id, course_id);
create index if not exists idx_completions_user on completions(user_id);
create index if not exists idx_completions_user_course on completions(user_id, course_id);
create index if not exists idx_login_logs_user on login_logs(user_id);
create index if not exists idx_login_logs_login_at on login_logs(login_at);

-- RLS ポリシー（必要に応じて有効化）
-- alter table quizzes enable row level security;
-- alter table quiz_results enable row level security;
-- alter table completions enable row level security;
-- alter table login_logs enable row level security;
