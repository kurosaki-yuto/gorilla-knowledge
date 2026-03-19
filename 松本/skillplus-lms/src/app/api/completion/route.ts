import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// 修了ステータスを取得
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

    if (courseId) {
      // 特定講座の修了ステータス
      const completion = await db.getCompletion(session.id, courseId);
      const viewingHistory = await db.getViewingHistoryByCourse(session.id, courseId);
      const videoCompleted = viewingHistory.some((h) => h.isComplete);
      const quizResults = await db.getQuizResultsByCourse(session.id, courseId);
      const quizPassed = quizResults.some((r) => r.passed);
      const quizzes = await db.getQuizzesByCourse(courseId);
      const hasQuiz = quizzes.length > 0;

      return NextResponse.json({
        success: true,
        status: {
          videoCompleted,
          quizPassed,
          hasQuiz,
          isCompleted: hasQuiz ? (videoCompleted && quizPassed) : videoCompleted,
          completedAt: completion?.completedAt || null,
        },
      });
    }

    // ユーザーの全修了状況
    const completions = await db.getCompletionsByUser(session.id);
    return NextResponse.json({ success: true, completions });
  } catch (error) {
    console.error("Failed to fetch completion:", error);
    return NextResponse.json(
      { success: false, message: "修了情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
