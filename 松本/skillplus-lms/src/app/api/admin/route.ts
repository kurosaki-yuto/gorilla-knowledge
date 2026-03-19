import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// 管理者チェック
async function requireAdmin() {
  const session = await getSession();
  if (!session?.id) return null;
  const user = await db.getUserById(session.id);
  if (!user || user.role !== "admin") return null;
  return session;
}

// GET: データ取得
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type");

  switch (type) {
    case "trainings": {
      const trainings = await db.getTrainings();
      return NextResponse.json(trainings);
    }
    case "categories": {
      const trainingId = request.nextUrl.searchParams.get("trainingId");
      if (!trainingId) return NextResponse.json({ error: "trainingId必須" }, { status: 400 });
      const categories = await db.getCategoriesByTraining(trainingId);
      return NextResponse.json(categories);
    }
    case "courses": {
      const categoryId = request.nextUrl.searchParams.get("categoryId");
      if (!categoryId) return NextResponse.json({ error: "categoryId必須" }, { status: 400 });
      const courses = await db.getCoursesByCategory(categoryId);
      return NextResponse.json(courses);
    }
    case "users": {
      const users = await db.getAllUsers();
      return NextResponse.json(
        users.map(({ passwordHash, ...u }) => u)
      );
    }
    case "progress": {
      const history = await db.getAllViewingHistory();
      return NextResponse.json(history);
    }
    case "completions": {
      // 全ユーザーの修了状況を取得
      const users = await db.getAllUsers();
      const allCompletions = [];
      for (const user of users) {
        if (user.role === "admin") continue;
        const completions = await db.getCompletionsByUser(user.id);
        for (const comp of completions) {
          const course = await db.getCourseById(comp.courseId);
          allCompletions.push({
            ...comp,
            userName: user.name,
            companyName: user.companyName,
            courseName: course?.name || "不明",
            standardDurationMin: course ? Math.floor(course.durationSeconds / 60) : 0,
          });
        }
      }
      return NextResponse.json(allCompletions);
    }
    case "csv": {
      // 受講履歴CSV出力
      const companyFilter = request.nextUrl.searchParams.get("company");
      const users = await db.getAllUsers();
      const allHistory = await db.getAllViewingHistory();

      const rows: string[][] = [
        ["受講者名", "会社名", "コンテンツID", "コンテンツ名", "標準学習時間（分）", "視聴開始日時", "視聴完了日時", "テスト合否", "修了ステータス", "修了日"],
      ];

      for (const user of users) {
        if (user.role === "admin") continue;
        if (companyFilter && user.companyName !== companyFilter) continue;

        const userHistory = allHistory.filter((h) => h.userId === user.id);
        // 講座ごとにまとめる
        const courseIds = [...new Set(userHistory.map((h) => h.courseId))];

        for (const courseId of courseIds) {
          const course = await db.getCourseById(courseId);
          if (!course) continue;

          const histories = userHistory.filter((h) => h.courseId === courseId);
          const completedHistory = histories.find((h) => h.isComplete);
          const firstHistory = histories[0];

          // テスト結果
          const quizResults = await db.getQuizResultsByCourse(user.id, courseId);
          const bestQuiz = quizResults.length > 0
            ? quizResults.reduce((best, r) => r.score > best.score ? r : best)
            : null;

          // 修了情報
          const completion = await db.getCompletion(user.id, courseId);
          const quizzes = await db.getQuizzesByCourse(courseId);
          const hasQuiz = quizzes.length > 0;
          const videoCompleted = !!completedHistory;
          const quizPassed = bestQuiz?.passed || false;
          const isCompleted = hasQuiz ? (videoCompleted && quizPassed) : videoCompleted;

          rows.push([
            user.name,
            user.companyName,
            courseId,
            course.name,
            String(Math.floor(course.durationSeconds / 60)),
            firstHistory ? `${firstHistory.date} ${firstHistory.startTime}` : "",
            completedHistory ? `${completedHistory.date} ${completedHistory.endTime}` : "",
            hasQuiz ? (quizPassed ? "合格" : "不合格") : "テストなし",
            isCompleted ? "修了" : "未修了",
            completion?.completedAt ? new Date(completion.completedAt).toLocaleDateString("ja-JP") : "",
          ]);
        }
      }

      const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
      const bom = "\uFEFF";

      return new NextResponse(bom + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="受講履歴_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }
    default:
      return NextResponse.json({ error: "不明なtype" }, { status: 400 });
  }
}

// POST: データ変更
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  const body = await request.json();
  const { action, ...data } = body;

  switch (action) {
    // === 研修 ===
    case "createTraining": {
      const id = await db.createTraining({
        id: "",
        name: data.name,
        description: data.description || "",
      });
      return NextResponse.json({ success: true, id });
    }
    case "updateTraining": {
      await db.updateTraining(data.id, { name: data.name, description: data.description });
      return NextResponse.json({ success: true });
    }
    case "deleteTraining": {
      await db.deleteTraining(data.id);
      return NextResponse.json({ success: true });
    }

    // === カテゴリー ===
    case "createCategory": {
      const id = await db.createCategory({
        id: "",
        trainingId: data.trainingId,
        name: data.name,
        description: data.description || "",
        order: data.order || 1,
      });
      return NextResponse.json({ success: true, id });
    }
    case "updateCategory": {
      await db.updateCategory(data.id, { name: data.name, description: data.description });
      return NextResponse.json({ success: true });
    }
    case "deleteCategory": {
      await db.deleteCategory(data.id);
      return NextResponse.json({ success: true });
    }

    // === 講座 ===
    case "createCourse": {
      const id = await db.createCourse({
        id: "",
        categoryId: data.categoryId,
        name: data.name,
        description: data.description || "",
        videoUrl: data.videoUrl || "",
        isPublished: true,
        durationSeconds: data.durationSeconds || 0,
        thumbnailUrl: "",
      });
      return NextResponse.json({ success: true, id });
    }
    case "updateCourse": {
      await db.updateCourse(data.id, {
        name: data.name,
        description: data.description,
        videoUrl: data.videoUrl,
        durationSeconds: data.durationSeconds,
      });
      return NextResponse.json({ success: true });
    }
    case "deleteCourse": {
      await db.deleteCourse(data.id);
      return NextResponse.json({ success: true });
    }

    // === ユーザー ===
    case "createUser": {
      const hash = await bcrypt.hash(data.password, 10);
      const id = await db.createUser({
        id: data.id,
        passwordHash: hash,
        name: data.name,
        companyName: data.companyName,
        role: data.role || "student",
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, id });
    }
    case "updateUser": {
      const updateData: Record<string, unknown> = {
        name: data.name,
        companyName: data.companyName,
        role: data.role,
      };
      if (data.password) {
        updateData.passwordHash = await bcrypt.hash(data.password, 10);
      }
      await db.updateUser(data.id, updateData);
      return NextResponse.json({ success: true });
    }
    case "deleteUser": {
      await db.deleteUser(data.id);
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "不明なaction" }, { status: 400 });
  }
}
