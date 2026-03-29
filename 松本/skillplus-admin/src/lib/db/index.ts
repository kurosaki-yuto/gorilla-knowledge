// ==========================================
// DB抽象化層
// Google Sheets → Supabase に切り替え可能
// ==========================================

import type {
  Training,
  Category,
  Course,
  User,
  ViewingHistory,
  Quiz,
  QuizResult,
  Completion,
  LoginLog,
} from "@/types";

/**
 * データアクセスインターフェース
 */
export interface DatabaseAdapter {
  // === 読み取り ===
  getTrainings(): Promise<Training[]>;
  getCategoriesByTraining(trainingId: string): Promise<Category[]>;
  getCoursesByCategory(categoryId: string): Promise<Course[]>;
  getCourseById(courseId: string): Promise<Course | null>;
  getUserById(userId: string): Promise<User | null>;
  getViewingHistory(userId: string): Promise<ViewingHistory[]>;
  getViewingHistoryByCourse(userId: string, courseId: string): Promise<ViewingHistory[]>;
  saveViewingHistory(history: Omit<ViewingHistory, "id">): Promise<string>;

  // === 管理者用 CRUD ===
  // 研修
  createTraining(training: Omit<Training, "createdAt" | "updatedAt">): Promise<string>;
  updateTraining(id: string, data: Partial<Training>): Promise<void>;
  deleteTraining(id: string): Promise<void>;

  // カテゴリー
  createCategory(category: Omit<Category, "createdAt" | "updatedAt">): Promise<string>;
  updateCategory(id: string, data: Partial<Category>): Promise<void>;
  deleteCategory(id: string): Promise<void>;

  // 講座
  createCourse(course: Omit<Course, "createdAt" | "updatedAt">): Promise<string>;
  updateCourse(id: string, data: Partial<Course>): Promise<void>;
  deleteCourse(id: string): Promise<void>;

  // ユーザー
  getAllUsers(): Promise<User[]>;
  createUser(user: User): Promise<string>;
  updateUser(id: string, data: Partial<User>): Promise<void>;
  deleteUser(id: string): Promise<void>;

  // 視聴履歴（全体）
  getAllViewingHistory(): Promise<ViewingHistory[]>;

  // === テスト ===
  getQuizzesByCourse(courseId: string): Promise<Quiz[]>;
  getQuizResultsByCourse(userId: string, courseId: string): Promise<QuizResult[]>;
  saveQuizResult(result: Omit<QuizResult, "id">): Promise<string>;

  // === 修了管理 ===
  getCompletion(userId: string, courseId: string): Promise<Completion | null>;
  getCompletionsByUser(userId: string): Promise<Completion[]>;
  saveCompletion(completion: Omit<Completion, "id">): Promise<string>;
  updateCompletion(id: string, data: Partial<Completion>): Promise<void>;

  // === ログイン記録 ===
  saveLoginLog(log: Omit<LoginLog, "id">): Promise<string>;
  updateLoginLog(id: string, data: Partial<LoginLog>): Promise<void>;
  getLoginLogsByUser(userId: string): Promise<LoginLog[]>;
  getAllLoginLogs(): Promise<LoginLog[]>;

  // === アクセス制御 ===
  getUserAccess(userId: string): Promise<{ trainingIds: string[]; categoryIds: string[] }>;
  setUserAccess(userId: string, trainingIds: string[], categoryIds: string[]): Promise<void>;
}

export { SupabaseAdapter as db } from "./supabase";
