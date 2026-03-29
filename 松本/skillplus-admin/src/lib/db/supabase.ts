// ==========================================
// Supabaseアダプター（本番用）
// ==========================================

import { createClient } from "@supabase/supabase-js";
import type {
  Training, Category, Course, User, ViewingHistory,
  Quiz, QuizResult, Completion, LoginLog,
} from "@/types";
import type { DatabaseAdapter } from "./index";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ==========================================
// snake_case → camelCase 変換ヘルパー
// ==========================================

function toTraining(r: Record<string, unknown>): Training {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) || "",
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function toCategory(r: Record<string, unknown>): Category {
  return {
    id: r.id as string,
    trainingId: r.training_id as string,
    name: r.name as string,
    description: (r.description as string) || "",
    order: (r.sort_order as number) || 0,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function toCourse(r: Record<string, unknown>): Course {
  return {
    id: r.id as string,
    categoryId: r.category_id as string,
    name: r.name as string,
    description: (r.description as string) || "",
    videoUrl: (r.video_url as string) || "",
    isPublished: r.is_published as boolean,
    durationSeconds: (r.duration_seconds as number) || 0,
    thumbnailUrl: (r.thumbnail_url as string) || "",
    contentJson: r.content_json || null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function toUser(r: Record<string, unknown>): User {
  return {
    id: r.id as string,
    passwordHash: r.password_hash as string,
    name: r.name as string,
    companyName: (r.company_name as string) || "",
    role: r.role as "admin" | "student",
    createdAt: r.created_at as string,
  };
}

function toViewingHistory(r: Record<string, unknown>): ViewingHistory {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    courseId: r.course_id as string,
    date: r.created_at ? new Date(r.created_at as string).toLocaleDateString("ja-JP") : "",
    startTime: r.started_at as string,
    endTime: (r.completed_at as string) || "",
    durationSeconds: (r.duration_seconds as number) || 0,
    progress: (r.progress as number) || 0,
    isComplete: r.is_completed as boolean,
  };
}

function toQuiz(r: Record<string, unknown>): Quiz {
  return {
    id: r.id as string,
    courseId: r.course_id as string,
    question: r.question as string,
    choices: r.choices as string[],
    correctAnswer: r.correct_answer as number,
    order: (r.sort_order as number) || 0,
  };
}

function toQuizResult(r: Record<string, unknown>): QuizResult {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    courseId: r.course_id as string,
    score: r.score as number,
    passed: r.passed as boolean,
    takenAt: r.taken_at as string,
    answers: r.answers as number[],
  };
}

function toCompletion(r: Record<string, unknown>): Completion {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    courseId: r.course_id as string,
    videoCompleted: r.video_completed as boolean,
    quizPassed: r.quiz_passed as boolean,
    completedAt: (r.completed_at as string) || "",
    certificateIssued: r.certificate_issued as boolean,
  };
}

// ==========================================
// アダプター実装
// ==========================================

export const SupabaseAdapter: DatabaseAdapter = {
  // === 研修 ===
  async getTrainings() {
    const { data } = await supabase.from("trainings").select("*").order("created_at");
    return (data || []).map(toTraining);
  },

  async createTraining(t) {
    const { data } = await supabase.from("trainings").insert({ name: t.name, description: t.description }).select("id").single();
    return data?.id || "";
  },

  async updateTraining(id, d) {
    await supabase.from("trainings").update({ name: d.name, description: d.description }).eq("id", id);
  },

  async deleteTraining(id) {
    await supabase.from("trainings").delete().eq("id", id);
  },

  // === カテゴリー ===
  async getCategoriesByTraining(trainingId) {
    const { data } = await supabase.from("categories").select("*").eq("training_id", trainingId).order("sort_order");
    return (data || []).map(toCategory);
  },

  async createCategory(c) {
    const { data } = await supabase.from("categories").insert({ training_id: c.trainingId, name: c.name, description: c.description, sort_order: c.order }).select("id").single();
    return data?.id || "";
  },

  async updateCategory(id, d) {
    const update: Record<string, unknown> = {};
    if (d.name !== undefined) update.name = d.name;
    if (d.description !== undefined) update.description = d.description;
    if (d.order !== undefined) update.sort_order = d.order;
    await supabase.from("categories").update(update).eq("id", id);
  },

  async deleteCategory(id) {
    await supabase.from("categories").delete().eq("id", id);
  },

  // === 講座 ===
  async getCoursesByCategory(categoryId) {
    const { data } = await supabase.from("courses").select("*").eq("category_id", categoryId).eq("is_published", true).order("sort_order");
    return (data || []).map(toCourse);
  },

  async getCourseById(courseId) {
    const { data } = await supabase.from("courses").select("*").eq("id", courseId).single();
    return data ? toCourse(data) : null;
  },

  async createCourse(c) {
    const { data } = await supabase.from("courses").insert({
      category_id: c.categoryId, name: c.name, description: c.description,
      video_url: c.videoUrl, is_published: c.isPublished,
      duration_seconds: c.durationSeconds, thumbnail_url: c.thumbnailUrl,
      content_json: c.contentJson || null,
    }).select("id").single();
    return data?.id || "";
  },

  async updateCourse(id, d) {
    const update: Record<string, unknown> = {};
    if (d.name !== undefined) update.name = d.name;
    if (d.description !== undefined) update.description = d.description;
    if (d.videoUrl !== undefined) update.video_url = d.videoUrl;
    if (d.isPublished !== undefined) update.is_published = d.isPublished;
    if (d.durationSeconds !== undefined) update.duration_seconds = d.durationSeconds;
    if (d.thumbnailUrl !== undefined) update.thumbnail_url = d.thumbnailUrl;
    if (d.contentJson !== undefined) update.content_json = d.contentJson;
    await supabase.from("courses").update(update).eq("id", id);
  },

  async deleteCourse(id) {
    await supabase.from("courses").delete().eq("id", id);
  },

  // === ユーザー ===
  async getUserById(userId) {
    const { data } = await supabase.from("users").select("*").eq("id", userId).single();
    return data ? toUser(data) : null;
  },

  async getAllUsers() {
    const { data } = await supabase.from("users").select("*").order("created_at");
    return (data || []).map(toUser);
  },

  async createUser(u) {
    await supabase.from("users").insert({
      id: u.id, password_hash: u.passwordHash, name: u.name,
      company_name: u.companyName, role: u.role,
    });
    return u.id;
  },

  async updateUser(id, d) {
    const update: Record<string, unknown> = {};
    if (d.name !== undefined) update.name = d.name;
    if (d.companyName !== undefined) update.company_name = d.companyName;
    if (d.role !== undefined) update.role = d.role;
    if (d.passwordHash !== undefined) update.password_hash = d.passwordHash;
    await supabase.from("users").update(update).eq("id", id);
  },

  async deleteUser(id) {
    await supabase.from("users").delete().eq("id", id);
  },

  // === 視聴履歴 ===
  async getViewingHistory(userId) {
    const { data } = await supabase.from("watch_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    return (data || []).map(toViewingHistory);
  },

  async getViewingHistoryByCourse(userId, courseId) {
    const { data } = await supabase.from("watch_logs").select("*").eq("user_id", userId).eq("course_id", courseId).order("created_at", { ascending: false });
    return (data || []).map(toViewingHistory);
  },

  async saveViewingHistory(h) {
    const { data } = await supabase.from("watch_logs").insert({
      user_id: h.userId, course_id: h.courseId,
      started_at: h.startTime, completed_at: h.endTime || null,
      duration_seconds: h.durationSeconds, progress: h.progress,
      is_completed: h.isComplete,
    }).select("id").single();
    return data?.id || "";
  },

  async getAllViewingHistory() {
    const { data } = await supabase.from("watch_logs").select("*").order("created_at", { ascending: false });
    return (data || []).map(toViewingHistory);
  },

  // === テスト ===
  async getQuizzesByCourse(courseId) {
    const { data } = await supabase.from("quizzes").select("*").eq("course_id", courseId).order("sort_order");
    return (data || []).map(toQuiz);
  },

  async getQuizResultsByCourse(userId, courseId) {
    const { data } = await supabase.from("quiz_results").select("*").eq("user_id", userId).eq("course_id", courseId).order("taken_at", { ascending: false });
    return (data || []).map(toQuizResult);
  },

  async saveQuizResult(r) {
    const { data } = await supabase.from("quiz_results").insert({
      user_id: r.userId, course_id: r.courseId,
      score: r.score, passed: r.passed,
      answers: r.answers, taken_at: r.takenAt,
    }).select("id").single();
    return data?.id || "";
  },

  // === 修了管理 ===
  async getCompletion(userId, courseId) {
    const { data } = await supabase.from("completions").select("*").eq("user_id", userId).eq("course_id", courseId).single();
    return data ? toCompletion(data) : null;
  },

  async getCompletionsByUser(userId) {
    const { data } = await supabase.from("completions").select("*").eq("user_id", userId);
    return (data || []).map(toCompletion);
  },

  async saveCompletion(c) {
    const { data } = await supabase.from("completions").insert({
      user_id: c.userId, course_id: c.courseId,
      video_completed: c.videoCompleted, quiz_passed: c.quizPassed,
      completed_at: c.completedAt || null, certificate_issued: c.certificateIssued,
    }).select("id").single();
    return data?.id || "";
  },

  async updateCompletion(id, d) {
    const update: Record<string, unknown> = {};
    if (d.videoCompleted !== undefined) update.video_completed = d.videoCompleted;
    if (d.quizPassed !== undefined) update.quiz_passed = d.quizPassed;
    if (d.completedAt !== undefined) update.completed_at = d.completedAt || null;
    if (d.certificateIssued !== undefined) update.certificate_issued = d.certificateIssued;
    await supabase.from("completions").update(update).eq("id", id);
  },

  // === ログイン記録 ===
  async saveLoginLog(log) {
    const { data } = await supabase.from("login_logs").insert({
      user_id: log.userId, login_at: log.loginAt,
      logout_at: log.logoutAt || null,
      ip_address: log.ipAddress, user_agent: log.userAgent,
    }).select("id").single();
    return data?.id || "";
  },

  async updateLoginLog(id, d) {
    const update: Record<string, unknown> = {};
    if (d.logoutAt !== undefined) update.logout_at = d.logoutAt;
    await supabase.from("login_logs").update(update).eq("id", id);
  },

  async getLoginLogsByUser(userId) {
    const { data } = await supabase.from("login_logs").select("*").eq("user_id", userId).order("login_at", { ascending: false });
    return (data || []).map((r: Record<string, unknown>): LoginLog => ({
      id: r.id as string,
      userId: r.user_id as string,
      loginAt: r.login_at as string,
      logoutAt: (r.logout_at as string) || "",
      ipAddress: (r.ip_address as string) || "",
      userAgent: (r.user_agent as string) || "",
    }));
  },

  async getAllLoginLogs() {
    const { data } = await supabase.from("login_logs").select("*").order("login_at", { ascending: false });
    return (data || []).map((r: Record<string, unknown>): LoginLog => ({
      id: r.id as string,
      userId: r.user_id as string,
      loginAt: r.login_at as string,
      logoutAt: (r.logout_at as string) || "",
      ipAddress: (r.ip_address as string) || "",
      userAgent: (r.user_agent as string) || "",
    }));
  },

  // === アクセス制御 ===
  async getUserAccess(userId: string) {
    const { data: trainingRows } = await supabase
      .from("user_training_access").select("training_id").eq("user_id", userId);
    const { data: categoryRows } = await supabase
      .from("user_category_access").select("category_id").eq("user_id", userId);
    return {
      trainingIds: (trainingRows || []).map((r: Record<string, unknown>) => r.training_id as string),
      categoryIds: (categoryRows || []).map((r: Record<string, unknown>) => r.category_id as string),
    };
  },

  async setUserAccess(userId: string, trainingIds: string[], categoryIds: string[]) {
    // 既存のアクセス設定を削除
    await supabase.from("user_training_access").delete().eq("user_id", userId);
    await supabase.from("user_category_access").delete().eq("user_id", userId);

    // 新しいアクセス設定を挿入
    if (trainingIds.length > 0) {
      await supabase.from("user_training_access").insert(
        trainingIds.map((tid) => ({ user_id: userId, training_id: tid }))
      );
    }
    if (categoryIds.length > 0) {
      await supabase.from("user_category_access").insert(
        categoryIds.map((cid) => ({ user_id: userId, category_id: cid }))
      );
    }
  },
};
