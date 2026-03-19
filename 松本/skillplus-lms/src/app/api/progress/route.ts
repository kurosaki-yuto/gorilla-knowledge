import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ViewingSessionData, CompletionResult } from "@/types";

const COMPLETION_TOLERANCE_SECONDS = 10;

function checkCompletion(
  courseDurationSeconds: number,
  actualViewingSeconds: number
): CompletionResult {
  const requiredSeconds = Math.max(
    0,
    courseDurationSeconds - COMPLETION_TOLERANCE_SECONDS
  );
  const isComplete = actualViewingSeconds >= requiredSeconds;

  return {
    isComplete,
    requiredSeconds,
    actualSeconds: Math.round(actualViewingSeconds),
    message: `視聴${Math.round(actualViewingSeconds)}秒 / 必要${requiredSeconds}秒 → ${isComplete ? "完了" : "未完了"}`,
  };
}

// 視聴履歴を取得
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, message: "認証が必要です" },
        { status: 401 }
      );
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
    return NextResponse.json(
      { success: false, message: "進捗データの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// 視聴履歴を保存
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, message: "認証が必要です" },
        { status: 401 }
      );
    }

    const body: ViewingSessionData = await request.json();
    const userId = session.id;

    // 講座の動画時間を取得
    const course = await db.getCourseById(body.courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "講座が見つかりません" },
        { status: 404 }
      );
    }

    // 完了判定
    const completion = checkCompletion(
      course.durationSeconds,
      body.actualViewingSeconds
    );

    // 視聴履歴を保存
    const now = new Date();
    const startDate = new Date(body.startTimestamp);
    const endDate = new Date(body.endTimestamp);

    const id = await db.saveViewingHistory({
      userId,
      courseId: body.courseId,
      date: now.toLocaleDateString("ja-JP"),
      startTime: startDate.toLocaleTimeString("ja-JP"),
      endTime: endDate.toLocaleTimeString("ja-JP"),
      durationSeconds: Math.round(body.actualViewingSeconds),
      progress: completion.isComplete ? 100 : 0,
      isComplete: completion.isComplete,
    });

    return NextResponse.json({
      success: true,
      id,
      completion,
    });
  } catch (error) {
    console.error("Failed to save progress:", error);
    return NextResponse.json(
      { success: false, message: "視聴履歴の保存に失敗しました" },
      { status: 500 }
    );
  }
}
