-- login_logs テーブル追加
CREATE TABLE IF NOT EXISTS login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  logout_at TIMESTAMPTZ,
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_logs_user ON login_logs(user_id);

ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON login_logs FOR ALL USING (true) WITH CHECK (true);
