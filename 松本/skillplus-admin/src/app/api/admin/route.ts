import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.getUserById(session.id);
  if (!user || user.role !== "admin") return null;
  return session;
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");

  switch (type) {
    case "trainings":
      return NextResponse.json(await db.getTrainings());
    case "categories": {
      const tid = request.nextUrl.searchParams.get("trainingId") || "";
      return NextResponse.json(await db.getCategoriesByTraining(tid));
    }
    case "courses": {
      const cid = request.nextUrl.searchParams.get("categoryId") || "";
      return NextResponse.json(await db.getCoursesByCategory(cid));
    }
    case "users":
      return NextResponse.json(
        (await db.getAllUsers()).map((u) => ({ ...u, passwordHash: undefined }))
      );
    case "progress":
      return NextResponse.json(await db.getAllViewingHistory());
    case "quizzes": {
      const courseId = request.nextUrl.searchParams.get("courseId") || "";
      return NextResponse.json(await db.getQuizzesByCourse(courseId));
    }
    case "completions": {
      const { data } = await (await import("@supabase/supabase-js")).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ).from("completions").select(`
        user_id, course_id, video_completed, quiz_passed, completed_at, certificate_issued,
        users!inner(name, company_name),
        courses!inner(name, duration_seconds)
      `);
      return NextResponse.json((data || []).map((c: Record<string, unknown>) => ({
        userId: c.user_id,
        courseId: c.course_id,
        videoCompleted: c.video_completed,
        quizPassed: c.quiz_passed,
        completedAt: c.completed_at,
        certificateIssued: c.certificate_issued,
        userName: (c.users as Record<string, unknown>)?.name || "",
        companyName: (c.users as Record<string, unknown>)?.company_name || "",
        courseName: (c.courses as Record<string, unknown>)?.name || "",
        standardDurationMin: Math.round(((c.courses as Record<string, unknown>)?.duration_seconds as number || 0) / 60),
      })));
    }
    case "userAccess": {
      const userId = request.nextUrl.searchParams.get("userId") || "";
      return NextResponse.json(await (db as unknown as { getUserAccess: (id: string) => Promise<{ trainingIds: string[]; categoryIds: string[] }> }).getUserAccess(userId));
    }
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action, ...data } = body;

  try {
    switch (action) {
      case "createTraining": {
        const id = await db.createTraining({ id: "", name: data.name, description: data.description || "" });
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
      case "createCategory": {
        const id = await db.createCategory({ id: "", trainingId: data.trainingId, name: data.name, description: data.description || "", order: data.order || 0 });
        return NextResponse.json({ success: true, id });
      }
      case "updateCategory": {
        await db.updateCategory(data.id, { name: data.name, description: data.description, order: data.order });
        return NextResponse.json({ success: true });
      }
      case "deleteCategory": {
        await db.deleteCategory(data.id);
        return NextResponse.json({ success: true });
      }
      case "createCourse": {
        const id = await db.createCourse({
          id: "", categoryId: data.categoryId, name: data.name, description: data.description || "",
          videoUrl: data.videoUrl || "", isPublished: data.isPublished ?? true,
          durationSeconds: data.durationSeconds || 0, thumbnailUrl: data.thumbnailUrl || "",
          contentJson: data.contentJson || null,
        });
        return NextResponse.json({ success: true, id });
      }
      case "updateCourse": {
        await db.updateCourse(data.id, data);
        return NextResponse.json({ success: true });
      }
      case "deleteCourse": {
        await db.deleteCourse(data.id);
        return NextResponse.json({ success: true });
      }
      case "createUser": {
        const hash = await bcrypt.hash(data.password, 10);
        await db.createUser({ id: data.id, passwordHash: hash, name: data.name, companyName: data.companyName || "", role: data.role || "student", createdAt: new Date().toISOString() });
        return NextResponse.json({ success: true });
      }
      case "updateUser": {
        const update: Record<string, unknown> = { name: data.name, companyName: data.companyName, role: data.role };
        if (data.password) update.passwordHash = await bcrypt.hash(data.password, 10);
        await db.updateUser(data.id, update);
        return NextResponse.json({ success: true });
      }
      case "deleteUser": {
        await db.deleteUser(data.id);
        return NextResponse.json({ success: true });
      }
      case "setUserAccess": {
        await (db as unknown as { setUserAccess: (userId: string, trainingIds: string[], categoryIds: string[]) => Promise<void> }).setUserAccess(data.userId, data.trainingIds || [], data.categoryIds || []);
        return NextResponse.json({ success: true });
      }
      // テスト問題CRUD
      case "createQuiz": {
        const supabaseClient = (await import("@supabase/supabase-js")).createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: quiz } = await supabaseClient.from("quizzes").insert({
          course_id: data.courseId,
          question: data.question,
          choices: data.choices,
          correct_answer: data.correctAnswer,
          sort_order: data.sortOrder || 0,
        }).select("id").single();
        return NextResponse.json({ success: true, id: quiz?.id });
      }
      case "updateQuiz": {
        const supabaseClient2 = (await import("@supabase/supabase-js")).createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabaseClient2.from("quizzes").update({
          question: data.question,
          choices: data.choices,
          correct_answer: data.correctAnswer,
          sort_order: data.sortOrder,
        }).eq("id", data.id);
        return NextResponse.json({ success: true });
      }
      case "deleteQuiz": {
        const supabaseClient3 = (await import("@supabase/supabase-js")).createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabaseClient3.from("quizzes").delete().eq("id", data.id);
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (e) {
    console.error("Admin API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
