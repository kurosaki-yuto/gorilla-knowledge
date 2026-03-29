// ==========================================
// スキルプラス forBiz - 型定義
// ==========================================

/** 研修 */
export interface Training {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** カテゴリー */
export interface Category {
  id: string;
  trainingId: string;
  name: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** 講座 */
export interface Course {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  videoUrl: string;
  isPublished: boolean;
  durationSeconds: number; // 動画時間（秒）- 完了判定に使用
  thumbnailUrl: string;
  contentJson?: unknown;
  createdAt: string;
  updatedAt: string;
}

/** ユーザー */
export interface User {
  id: string;
  passwordHash: string;
  name: string;
  companyName: string;
  role: "admin" | "student";
  createdAt: string;
}

/** 視聴履歴 */
export interface ViewingHistory {
  id: string;
  userId: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  progress: number; // 0 or 100
  isComplete: boolean;
}

/** 講座 + 視聴状態（UI用） */
export interface CourseWithProgress extends Course {
  progress: number;
  isComplete: boolean;
  trainingId?: string;
  categoryName?: string;
}

/** カテゴリー + 進捗（UI用） */
export interface CategoryWithProgress extends Category {
  courseCount: number;
  completedCount: number;
  progressPercent: number;
}

/** 研修 + 進捗（UI用） */
export interface TrainingWithProgress extends Training {
  categoryCount: number;
  completedCategoryCount: number;
  progressPercent: number;
}

/** ログイン情報 */
export interface LoginCredentials {
  userId: string;
  password: string;
}

/** 視聴セッションデータ（フロントから送信） */
export interface ViewingSessionData {
  courseId: string;
  startTimestamp: number;
  endTimestamp: number;
  actualViewingSeconds: number;
  videoDurationSeconds: number;
}

/** 完了判定の結果 */
export interface CompletionResult {
  isComplete: boolean;
  requiredSeconds: number;
  actualSeconds: number;
  message: string;
}

/** テスト問題 */
export interface Quiz {
  id: string;
  courseId: string;
  question: string;
  choices: string[];
  correctAnswer: number; // choices のインデックス
  order: number;
}

/** テスト結果 */
export interface QuizResult {
  id: string;
  userId: string;
  courseId: string;
  score: number; // 正答率（0〜100）
  passed: boolean;
  takenAt: string;
  answers: number[]; // 選択したインデックス
}

/** 修了記録 */
export interface Completion {
  id: string;
  userId: string;
  courseId: string;
  videoCompleted: boolean;
  quizPassed: boolean;
  completedAt: string;
  certificateIssued: boolean;
}

/** ログイン記録 */
export interface LoginLog {
  id: string;
  userId: string;
  loginAt: string;
  logoutAt: string;
  ipAddress: string;
  userAgent: string;
}

/** 修了ステータス（UI用） */
export interface CompletionStatus {
  videoCompleted: boolean;
  quizPassed: boolean;
  isCompleted: boolean; // 両方true
  quizScore?: number;
  completedAt?: string;
}
