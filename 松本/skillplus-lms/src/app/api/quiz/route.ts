import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

const PASS_THRESHOLD = 80; // 合格基準: 正答率80%以上

// テスト問題を取得（正解は返さない）
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
    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "courseIdが必要です" },
        { status: 400 }
      );
    }

    const quizzes = await db.getQuizzesByCourse(courseId);

    // 正解を除外して返す
    const questions = quizzes.map(({ correctAnswer, ...rest }) => rest);

    // 過去の結果も返す
    const results = await db.getQuizResultsByCourse(session.id, courseId);
    const bestResult = results.length > 0
      ? results.reduce((best, r) => (r.score > best.score ? r : best))
      : null;

    return NextResponse.json({
      success: true,
      questions,
      hasQuiz: quizzes.length > 0,
      bestResult: bestResult ? { score: bestResult.score, passed: bestResult.passed, takenAt: bestResult.takenAt } : null,
    });
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    return NextResponse.json(
      { success: false, message: "テストの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// テスト回答を送信
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, message: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId, answers, selfDeclaredPass } = body as { courseId: string; answers: number[]; selfDeclaredPass?: boolean };

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "courseIdが必要です" },
        { status: 400 }
      );
    }

    // 動画視聴完了チェック
    const viewingHistory = await db.getViewingHistoryByCourse(session.id, courseId);
    const videoCompleted = viewingHistory.some((h) => h.isComplete);
    if (!videoCompleted) {
      return NextResponse.json(
        { success: false, message: "先に動画を最後まで視聴してください" },
        { status: 400 }
      );
    }

    // === PDF自己申告型 ===
    if (selfDeclaredPass) {
      const score = 100;
      const passed = true;

      await db.saveQuizResult({
        userId: session.id, courseId, score, passed,
        takenAt: new Date().toISOString(), answers: [],
      });

      const existing = await db.getCompletion(session.id, courseId);
      if (existing) {
        await db.updateCompletion(existing.id, {
          quizPassed: true,
          completedAt: existing.completedAt || new Date().toISOString(),
        });
      } else {
        await db.saveCompletion({
          userId: session.id, courseId, videoCompleted: true, quizPassed: true,
          completedAt: new Date().toISOString(), certificateIssued: false,
        });
      }

      return NextResponse.json({
        success: true, score, passed, correctCount: 0, totalCount: 0,
        corrections: [], message: "自己申告により合格を記録しました",
      });
    }

    // === LMS内自動採点テスト ===
    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { success: false, message: "回答が必要です" },
        { status: 400 }
      );
    }

    const quizzes = await db.getQuizzesByCourse(courseId);
    if (quizzes.length === 0) {
      return NextResponse.json(
        { success: false, message: "この講座にテストがありません" },
        { status: 404 }
      );
    }

    let correctCount = 0;
    const corrections: { questionId: string; correct: boolean }[] = [];
    quizzes.forEach((quiz, i) => {
      const isCorrect = answers[i] === quiz.correctAnswer;
      if (isCorrect) correctCount++;
      corrections.push({ questionId: quiz.id, correct: isCorrect });
    });

    const score = Math.round((correctCount / quizzes.length) * 100);
    const passed = score >= PASS_THRESHOLD;

    // 結果保存
    const resultId = await db.saveQuizResult({
      userId: session.id,
      courseId,
      score,
      passed,
      takenAt: new Date().toISOString(),
      answers,
    });

    // 合格した場合、修了判定を更新
    if (passed) {
      const existing = await db.getCompletion(session.id, courseId);
      if (existing) {
        await db.updateCompletion(existing.id, {
          quizPassed: true,
          completedAt: videoCompleted && !existing.completedAt
            ? new Date().toISOString()
            : existing.completedAt,
        });
      } else {
        await db.saveCompletion({
          userId: session.id,
          courseId,
          videoCompleted: true,
          quizPassed: true,
          completedAt: new Date().toISOString(),
          certificateIssued: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      id: resultId,
      score,
      passed,
      correctCount,
      totalCount: quizzes.length,
      corrections,
      message: passed
        ? `合格！ ${score}点（${correctCount}/${quizzes.length}問正解）`
        : `不合格。${score}点（合格基準: ${PASS_THRESHOLD}点以上）再チャレンジしてください。`,
    });
  } catch (error) {
    console.error("Failed to submit quiz:", error);
    return NextResponse.json(
      { success: false, message: "テストの送信に失敗しました" },
      { status: 500 }
    );
  }
}
