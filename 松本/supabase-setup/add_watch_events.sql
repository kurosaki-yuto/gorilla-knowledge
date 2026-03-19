-- ==========================================
-- 視聴イベントログテーブル（助成金コンプライアンス対応）
-- 再生/一時停止/再開/完了/シーク操作を秒単位で記録
-- 監査時の出勤簿との突合せに使用
-- ==========================================

CREATE TABLE IF NOT EXISTS watch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_log_id UUID REFERENCES watch_logs(id) ON DELETE CASCADE,  -- 視聴セッションに紐づく
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('play', 'pause', 'resume', 'seek', 'ended', 'speed_change', 'tab_hidden', 'tab_visible')),
  video_time REAL NOT NULL DEFAULT 0,           -- 動画上の再生位置（秒）
  wall_clock_at TIMESTAMPTZ NOT NULL DEFAULT now(),  -- 実際の時刻（出勤簿突合せ用）
  metadata JSONB DEFAULT '{}',                  -- 追加情報（シーク先、再生速度など）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_watch_events_log ON watch_events(watch_log_id);
CREATE INDEX idx_watch_events_user ON watch_events(user_id);
CREATE INDEX idx_watch_events_user_course ON watch_events(user_id, course_id);
CREATE INDEX idx_watch_events_time ON watch_events(wall_clock_at);

ALTER TABLE watch_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON watch_events FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- watch_logsテーブルにカラム追加
-- 実再生時間（一時停止除外）と進捗率
-- ==========================================
ALTER TABLE watch_logs ADD COLUMN IF NOT EXISTS actual_play_seconds INT NOT NULL DEFAULT 0;  -- 実際に再生していた秒数（一時停止除外）
ALTER TABLE watch_logs ADD COLUMN IF NOT EXISTS progress_percent INT NOT NULL DEFAULT 0;      -- 視聴進捗率（0-100）
ALTER TABLE watch_logs ADD COLUMN IF NOT EXISTS is_first_view BOOLEAN NOT NULL DEFAULT true;  -- 初回視聴かどうか
ALTER TABLE watch_logs ADD COLUMN IF NOT EXISTS playback_rate REAL NOT NULL DEFAULT 1.0;      -- 再生速度（1.0=等速）
