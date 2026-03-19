import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// 修了証PDFを生成・ダウンロード
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

    // 管理者が他ユーザーの修了証を取得する場合
    const requestedUserId = request.nextUrl.searchParams.get("userId");
    const currentUser = await db.getUserById(session.id);
    let targetUserId = session.id;

    if (requestedUserId && requestedUserId !== session.id) {
      if (!currentUser || currentUser.role !== "admin") {
        return NextResponse.json(
          { success: false, message: "権限がありません" },
          { status: 403 }
        );
      }
      targetUserId = requestedUserId;
    }

    // 修了チェック
    const completion = await db.getCompletion(targetUserId, courseId);
    const viewingHistory = await db.getViewingHistoryByCourse(targetUserId, courseId);
    const videoCompleted = viewingHistory.some((h) => h.isComplete);
    const quizResults = await db.getQuizResultsByCourse(targetUserId, courseId);
    const quizPassed = quizResults.some((r) => r.passed);
    const quizzes = await db.getQuizzesByCourse(courseId);
    const hasQuiz = quizzes.length > 0;

    const isCompleted = hasQuiz ? (videoCompleted && quizPassed) : videoCompleted;

    if (!isCompleted) {
      return NextResponse.json(
        { success: false, message: "この講座はまだ修了していません" },
        { status: 403 }
      );
    }

    // 講座情報を取得
    const course = await db.getCourseById(courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "講座が見つかりません" },
        { status: 404 }
      );
    }

    const user = await db.getUserById(targetUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const completedAt = completion?.completedAt || new Date().toISOString();
    const completionDate = new Date(completedAt);
    const standardMinutes = Math.floor(course.durationSeconds / 60);

    // 修了証発行フラグ更新
    if (completion && !completion.certificateIssued) {
      await db.updateCompletion(completion.id, { certificateIssued: true });
    }

    // SVGベースのPDFライクなHTML → PDF
    // ブラウザ側でwindow.print()を使うため、印刷用HTMLを返す
    const html = generateCertificateHTML({
      userName: user.name,
      courseName: course.name,
      standardMinutes,
      completionDate,
      companyName: user.companyName,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to generate certificate:", error);
    return NextResponse.json(
      { success: false, message: "修了証の生成に失敗しました" },
      { status: 500 }
    );
  }
}

function generateCertificateHTML(params: {
  userName: string;
  courseName: string;
  standardMinutes: number;
  completionDate: Date;
  companyName: string;
}) {
  const { userName, courseName, standardMinutes, completionDate, companyName } = params;
  const dateStr = `${completionDate.getFullYear()}年${completionDate.getMonth() + 1}月${completionDate.getDate()}日`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>修了証 - ${courseName}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #f5f5f5;
    }
    .certificate {
      width: 297mm; height: 210mm; background: white;
      position: relative; padding: 20mm 30mm;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .border-outer {
      position: absolute; inset: 8mm;
      border: 3px double #1a1a1a;
    }
    .border-inner {
      position: absolute; inset: 12mm;
      border: 1px solid #666;
    }
    .title {
      font-size: 36pt; font-weight: bold; letter-spacing: 16pt;
      color: #1a1a1a; margin-bottom: 24pt;
    }
    .recipient {
      font-size: 24pt; margin-bottom: 8pt;
      border-bottom: 1px solid #333; padding: 4pt 40pt;
    }
    .company {
      font-size: 11pt; color: #666; margin-bottom: 24pt;
    }
    .body-text {
      font-size: 12pt; line-height: 2.2; text-align: center;
      color: #333; margin-bottom: 24pt; max-width: 500pt;
    }
    .course-name {
      font-size: 16pt; font-weight: bold; color: #1a1a1a;
      margin: 8pt 0;
    }
    .details {
      font-size: 10pt; color: #666; margin-bottom: 32pt;
    }
    .footer {
      display: flex; justify-content: space-between; align-items: flex-end;
      width: 100%; max-width: 600pt;
    }
    .date { font-size: 11pt; color: #333; }
    .issuer {
      text-align: center;
    }
    .issuer-name {
      font-size: 13pt; font-weight: bold; color: #1a1a1a;
      border-top: 1px solid #333; padding-top: 4pt; min-width: 160pt;
    }
    .issuer-label {
      font-size: 9pt; color: #666; margin-bottom: 4pt;
    }
    .stamp {
      width: 48pt; height: 48pt; border: 2px solid #c00;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      color: #c00; font-size: 10pt; font-weight: bold;
      margin: 0 auto 8pt;
    }
    @media print {
      body { background: white; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border-outer"></div>
    <div class="border-inner"></div>

    <div class="title">修 了 証</div>

    <div class="recipient">${userName}</div>
    <div class="company">${companyName}</div>

    <div class="body-text">
      あなたは下記の研修を修了したことを証します。
    </div>

    <div class="course-name">${courseName}</div>
    <div class="details">標準学習時間: ${standardMinutes}分</div>

    <div class="footer">
      <div class="date">${dateStr}</div>
      <div class="issuer">
        <div class="stamp">認定</div>
        <div class="issuer-label">訓練機関</div>
        <div class="issuer-name">AI寺子屋</div>
      </div>
    </div>
  </div>

  <div class="no-print" style="position:fixed;bottom:20px;right:20px;display:flex;gap:8px;">
    <button onclick="window.print()" style="padding:12px 24px;background:#1a1a1a;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">
      PDF保存 / 印刷
    </button>
    <button onclick="window.close()" style="padding:12px 24px;background:#f5f5f5;color:#333;border:1px solid #ddd;border-radius:6px;cursor:pointer;font-size:14px;">
      閉じる
    </button>
  </div>
</body>
</html>`;
}
