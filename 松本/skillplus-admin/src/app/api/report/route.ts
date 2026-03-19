import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const companyFilter = request.nextUrl.searchParams.get("company") || "";

  switch (type) {
    // ==========================================
    // 助成金提出用CSV データ取得
    // ==========================================
    case "csv": {
      // watch_logs + users + courses をJOIN
      let query = supabase
        .from("watch_logs")
        .select(`
          id,
          user_id,
          course_id,
          started_at,
          completed_at,
          duration_seconds,
          actual_play_seconds,
          progress_percent,
          is_completed,
          created_at
        `)
        .order("created_at", { ascending: true });

      const { data: logs } = await query;

      // ユーザー情報を取得
      const { data: users } = await supabase.from("users").select("id, name, company_name, role").neq("role", "admin");
      const { data: courses } = await supabase.from("courses").select("id, name, duration_seconds");
      const { data: quizResults } = await supabase.from("quiz_results").select("user_id, course_id, passed, score, taken_at").eq("passed", true);
      const { data: completions } = await supabase.from("completions").select("user_id, course_id, video_completed, quiz_passed, completed_at");

      const userMap = Object.fromEntries((users || []).map((u) => [u.id, u]));
      const courseMap = Object.fromEntries((courses || []).map((c) => [c.id, c]));
      const completionMap = new Map<string, typeof completions extends (infer T)[] | null ? T : never>();
      (completions || []).forEach((c) => completionMap.set(`${c.user_id}_${c.course_id}`, c));

      // 企業フィルタ
      const filteredUsers = companyFilter
        ? (users || []).filter((u) => u.company_name === companyFilter)
        : users || [];
      const userIds = new Set(filteredUsers.map((u) => u.id));

      // CSV行を構築
      const rows = (logs || [])
        .filter((log) => userIds.has(log.user_id))
        .map((log) => {
          const user = userMap[log.user_id];
          const course = courseMap[log.course_id];
          const comp = completionMap.get(`${log.user_id}_${log.course_id}`);
          const quizPass = (quizResults || []).find(
            (q) => q.user_id === log.user_id && q.course_id === log.course_id && q.passed
          );

          return {
            受講者名: user?.name || "",
            会社名: user?.company_name || "",
            コンテンツID: log.course_id,
            コンテンツ名: course?.name || "",
            "標準学習時間（分）": course ? Math.round(course.duration_seconds / 60) : 0,
            視聴開始日時: log.started_at,
            視聴完了日時: log.completed_at || "",
            "実視聴時間（秒）": log.actual_play_seconds || log.duration_seconds,
            テスト合否: quizPass ? "合格" : "−",
            修了ステータス: comp?.completed_at ? "修了" : "未修了",
            修了日: comp?.completed_at || "",
          };
        });

      return NextResponse.json({ success: true, rows });
    }

    // ==========================================
    // 1人1時間チェック + 合計10時間チェック
    // ==========================================
    case "subsidy-check": {
      const { data: users } = await supabase.from("users").select("id, name, company_name").eq("role", "student");
      const { data: logs } = await supabase.from("watch_logs").select("user_id, actual_play_seconds, duration_seconds, is_completed");

      // ユーザーごとの合計視聴時間
      const userTotalSeconds: Record<string, number> = {};
      (logs || []).forEach((log) => {
        const seconds = log.actual_play_seconds || log.duration_seconds || 0;
        userTotalSeconds[log.user_id] = (userTotalSeconds[log.user_id] || 0) + seconds;
      });

      // 企業フィルタ
      const targetUsers = companyFilter
        ? (users || []).filter((u) => u.company_name === companyFilter)
        : users || [];

      const userChecks = targetUsers.map((u) => {
        const totalSeconds = userTotalSeconds[u.id] || 0;
        const totalHours = totalSeconds / 3600;
        return {
          userId: u.id,
          name: u.name,
          companyName: u.company_name,
          totalSeconds: Math.round(totalSeconds),
          totalHours: Math.round(totalHours * 10) / 10,
          meetsOneHour: totalHours >= 1, // 1人1時間以上
        };
      });

      const grandTotalSeconds = userChecks.reduce((sum, u) => sum + u.totalSeconds, 0);
      const grandTotalHours = grandTotalSeconds / 3600;
      const qualifiedUsers = userChecks.filter((u) => u.meetsOneHour);

      return NextResponse.json({
        success: true,
        check: {
          // 全員合計10時間以上
          totalHours: Math.round(grandTotalHours * 10) / 10,
          meetsTenHours: grandTotalHours >= 10,
          // 1人1時間以上のチェック
          totalUsers: userChecks.length,
          qualifiedUsers: qualifiedUsers.length,
          disqualifiedUsers: userChecks.length - qualifiedUsers.length,
          // 詳細
          users: userChecks,
        },
      });
    }

    // ==========================================
    // カリキュラム一覧（助成金提出用）
    // ==========================================
    case "curriculum": {
      const trainings = await db.getTrainings();
      const result = await Promise.all(
        trainings.map(async (t) => {
          const categories = await db.getCategoriesByTraining(t.id);
          const categoriesWithCourses = await Promise.all(
            categories.map(async (c) => {
              const courses = await db.getCoursesByCategory(c.id);
              return {
                categoryName: c.name,
                courses: courses.map((cr) => ({
                  id: cr.id,
                  name: cr.name,
                  durationMinutes: Math.round(cr.durationSeconds / 60),
                })),
              };
            })
          );
          return { trainingName: t.name, categories: categoriesWithCourses };
        })
      );
      return NextResponse.json({ success: true, curriculum: result });
    }

    // ==========================================
    // 企業一覧（フィルタ用）
    // ==========================================
    case "companies": {
      const { data: users } = await supabase.from("users").select("company_name").eq("role", "student");
      const companies = [...new Set((users || []).map((u) => u.company_name).filter(Boolean))];
      return NextResponse.json({ success: true, companies });
    }

    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}
