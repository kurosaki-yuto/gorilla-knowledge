import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { CompletionResult } from "@/types";
import { createClient } from "@supabase/supabase-js";

const COMPLETION_TOLERANCE_SECONDS = 10;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 助成金対応: 完了判定
// - YouTube ENDEDイベントが必須
// - 実再生時間（一時停止除外）が動画時間-10秒以上
function checkCompletion(
  courseDurationSeconds: number,
  actualPlaySeconds: number,
  videoEnded: boolean
): CompletionResult {
  const requiredSeconds = Math.max(0, courseDurationSeconds - COMPLETION_TOLERANCE_SECONDS);
  // 二重判定: ENDEDイベント + 実再生時間
  const isComplete = videoEnded && actualPlaySeconds >= requiredSeconds;

  return {
    isComplete,
    requiredSeconds,
    actualSeconds: Math.round(actualPlaySeconds),
    message: `視聴${Math.round(actualPlaySeconds)}秒 / 必要${requiredSeconds}秒 / ENDED=${videoEnded} → ${isComplete ? "完了" : "未完了"}`,
  };
}

// 視聴履歴を取得
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ success: false, message: "認証が必要です" }, { status: 401 });
    }

    const courseId = request.nextUrl.searchParams.get("courseId");
    const userId = session.id;

    if (courseId) {
      const history = await db.getViewingHistoryByCourse(userId, courseId);
      return NextResponse.json({ success: true, history });
    }

    const history = await db.getViewingHistory(userId);
    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json({ success: false, message: "進捗データの取得に失敗しました" }, { status: 500 });
  }
}

// 視聴履歴を保存（助成金対応版）
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ success: false, message: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const userId = session.id;

    const course = await db.getCourseById(body.courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: "講座が見つかりません" }, { status: 404 });
    }

    // 助成金対応: 二重判定
    const actualPlaySeconds = body.actualPlaySeconds || body.actualViewingSeconds || 0;
    const videoEnded = body.videoEnded ?? false;
    const progressPercent = body.progressPercent || 0;

    const completion = checkCompletion(course.durationSeconds, actualPlaySeconds, videoEnded);

    // 視聴履歴を保存
    const startDate = new Date(body.startTimestamp);
    const endDate = new Date(body.endTimestamp);

    const id = await db.saveViewingHistory({
      userId,
      courseId: body.courseId,
      date: new Date().toLocaleDateString("ja-JP"),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      durationSeconds: Math.round(actualPlaySeconds),
      progress: progressPercent,
      isComplete: completion.isComplete,
    });

    // watch_logsの追加カラム更新（actual_play_seconds, progress_percent, is_first_view）
    if (id) {
      await supabase.from("watch_logs").update({
        actual_play_seconds: Math.round(actualPlaySeconds),
        progress_percent: progressPercent,
      }).eq("id", id);
    }

    // 視聴イベントログ保存（助成金監査用）
    const events = body.events as Array<{
      eventType: string;
      videoTime: number;
      wallClockAt: string;
      metadata?: Record<string, unknown>;
    }> | undefined;

    if (events && events.length > 0 && id) {
      const eventRows = events.map((e) => ({
        watch_log_id: id,
        user_id: userId,
        course_id: body.courseId,
        event_type: e.eventType,
        video_time: e.videoTime,
        wall_clock_at: e.wallClockAt,
        metadata: e.metadata || {},
      }));
      await supabase.from("watch_events").insert(eventRows);
    }

    // 動画完了時に修了レコードを作成/更新
    if (completion.isComplete) {
      const existing = await db.getCompletion(userId, body.courseId);
      if (existing) {
        await db.updateCompletion(existing.id, { videoCompleted: true });
      } else {
        const quizzes = await db.getQuizzesByCourse(body.courseId);
        const hasQuiz = quizzes.length > 0;
        await db.saveCompletion({
          userId,
          courseId: body.courseId,
          videoCompleted: true,
          quizPassed: false,
          completedAt: hasQuiz ? "" : new Date().toISOString(),
          certificateIssued: false,
        });
      }
    }

    return NextResponse.json({ success: true, id, completion });
  } catch (error) {
    console.error("Failed to save progress:", error);
    return NextResponse.json({ success: false, message: "視聴履歴の保存に失敗しました" }, { status: 500 });
  }
}
