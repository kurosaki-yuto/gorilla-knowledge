// ==========================================
// モックデータアダプター（開発用）
// ==========================================

import type {
  Training,
  Category,
  Course,
  User,
  ViewingHistory,
} from "@/types";
import type { DatabaseAdapter } from "./index";
import bcrypt from "bcryptjs";

// ミュータブルな仮データ
const trainings: Training[] = [
  { id: "t001", name: "新入社員研修 2025", description: "新入社員向けの基礎研修プログラム", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "t002", name: "マネジメント研修", description: "管理職向けのリーダーシップ・マネジメント研修", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "t003", name: "IT基礎スキル研修", description: "Excel・Word・PowerPointの基本操作と業務活用", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "t004", name: "AI基礎研修", description: "AIの基礎知識からプロンプト活用、導入実践までを体系的に学ぶ研修プログラム", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
];

const categories: Category[] = [
  { id: "c001", trainingId: "t001", name: "ビジネスマナー", description: "基本的なビジネスマナーと社会人としての心構え", order: 1, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c002", trainingId: "t001", name: "コミュニケーション基礎", description: "報連相、メール作法、電話対応", order: 2, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c003", trainingId: "t001", name: "情報セキュリティ", description: "情報セキュリティの基礎知識と対策", order: 3, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c004", trainingId: "t002", name: "リーダーシップ", description: "チームを率いるリーダーシップの基本", order: 1, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c005", trainingId: "t002", name: "1on1ミーティング", description: "効果的な1on1ミーティングの進め方", order: 2, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c006", trainingId: "t003", name: "Excel基礎", description: "表計算、関数、グラフ作成の基本", order: 1, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c007", trainingId: "t003", name: "PowerPoint基礎", description: "プレゼン資料作成の基本テクニック", order: 2, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // AI基礎研修カテゴリー
  { id: "c008", trainingId: "t004", name: "AI基礎知識", description: "AIの概念・歴史から生成AIの仕組み、主要ツール比較まで", order: 1, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c009", trainingId: "t004", name: "プロンプトエンジニアリング", description: "AIへの効果的な指示の出し方と実践テクニック", order: 2, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c010", trainingId: "t004", name: "AIリテラシー・法務", description: "AI時代の情報リテラシー、著作権・個人情報、社内ガイドライン", order: 3, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "c011", trainingId: "t004", name: "AI活用・導入", description: "AIが変える仕事の未来、業務別活用法、導入の第一歩", order: 4, createdAt: "2025-01-01", updatedAt: "2025-01-01" },
];

const courses: Course[] = [
  { id: "cr001", categoryId: "c001", name: "挨拶と第一印象", description: "ビジネスシーンにおける適切な挨拶の仕方と第一印象の重要性", videoUrl: "", isPublished: true, durationSeconds: 300, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr002", categoryId: "c001", name: "名刺交換のマナー", description: "正しい名刺の渡し方・受け取り方", videoUrl: "", isPublished: true, durationSeconds: 240, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr003", categoryId: "c001", name: "敬語の使い方", description: "尊敬語・謙譲語・丁寧語の正しい使い分け", videoUrl: "", isPublished: true, durationSeconds: 420, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr004", categoryId: "c002", name: "報連相の基本", description: "報告・連絡・相談の適切なタイミングと方法", videoUrl: "", isPublished: true, durationSeconds: 360, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr005", categoryId: "c002", name: "ビジネスメールの書き方", description: "件名・宛名・本文・締めの基本ルール", videoUrl: "", isPublished: true, durationSeconds: 480, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr006", categoryId: "c003", name: "パスワード管理", description: "安全なパスワードの作り方と管理方法", videoUrl: "", isPublished: true, durationSeconds: 300, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr007", categoryId: "c003", name: "フィッシング詐欺対策", description: "フィッシングメールの見分け方と対処法", videoUrl: "", isPublished: true, durationSeconds: 360, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr008", categoryId: "c004", name: "リーダーの役割とは", description: "マネージャーとリーダーの違い、チームビルディング", videoUrl: "", isPublished: true, durationSeconds: 600, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr009", categoryId: "c005", name: "1on1の進め方", description: "効果的な1on1ミーティングのフレームワーク", videoUrl: "", isPublished: true, durationSeconds: 480, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr010", categoryId: "c006", name: "Excel入門 - 基本操作", description: "セル操作、数式の入力、書式設定", videoUrl: "", isPublished: true, durationSeconds: 540, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr011", categoryId: "c006", name: "Excel入門 - 関数", description: "SUM, AVERAGE, IF, VLOOKUPなど基本関数", videoUrl: "", isPublished: true, durationSeconds: 720, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr012", categoryId: "c007", name: "PowerPoint基本操作", description: "スライド作成、テンプレート活用、アニメーション", videoUrl: "", isPublished: true, durationSeconds: 600, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // AI基礎研修 - AI基礎知識（c008）
  { id: "cr101", categoryId: "c008", name: "A-101 AIとは何か", description: "AIの歴史から最新トレンドまでを体系的に解説", videoUrl: "", isPublished: true, durationSeconds: 1273, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr102", categoryId: "c008", name: "A-102 生成AIの仕組み", description: "なぜAIが文章を書けるのか、生成AIの技術的な仕組みを解説", videoUrl: "", isPublished: true, durationSeconds: 1083, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr103", categoryId: "c008", name: "A-103 主要AIツール徹底比較", description: "ChatGPT・Claude・Geminiなど主要AIツールの特徴と使い分け", videoUrl: "", isPublished: true, durationSeconds: 1276, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr104", categoryId: "c008", name: "A-104 AIにできること・できないこと", description: "AIの得意分野と限界を正しく理解する", videoUrl: "", isPublished: true, durationSeconds: 1173, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // AI基礎研修 - プロンプトエンジニアリング（c009）
  { id: "cr105", categoryId: "c009", name: "A-105 プロンプトの基本", description: "AIへの指示の出し方の基本を学ぶ", videoUrl: "", isPublished: true, durationSeconds: 822, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr106", categoryId: "c009", name: "A-106 プロンプト実践テクニック", description: "業務で使える実践的なプロンプトテクニック", videoUrl: "", isPublished: true, durationSeconds: 833, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // AI基礎研修 - AIリテラシー・法務（c010）
  { id: "cr107", categoryId: "c010", name: "A-107 AI時代の情報リテラシー", description: "AI時代に必要な情報の見極め方と付き合い方", videoUrl: "", isPublished: true, durationSeconds: 741, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr108", categoryId: "c010", name: "A-108 AIと著作権・個人情報", description: "AI利用における著作権と個人情報保護の基礎知識", videoUrl: "", isPublished: true, durationSeconds: 755, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr109", categoryId: "c010", name: "A-109 社内AI利用ガイドライン", description: "社内でAIを安全に活用するためのガイドラインの考え方", videoUrl: "", isPublished: true, durationSeconds: 744, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  // AI基礎研修 - AI活用・導入（c011）
  { id: "cr110", categoryId: "c011", name: "A-110 AIで変わる仕事の未来", description: "AIが仕事や働き方にもたらす変化を展望する", videoUrl: "", isPublished: true, durationSeconds: 1200, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr111", categoryId: "c011", name: "A-111 業務別AI活用マップ", description: "営業・事務・企画など業務別のAI活用パターン", videoUrl: "", isPublished: true, durationSeconds: 600, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "cr112", categoryId: "c011", name: "A-112 AI導入の第一歩", description: "明日からできるAI導入のステップを解説", videoUrl: "", isPublished: true, durationSeconds: 1200, thumbnailUrl: "", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
];

const users: User[] = [
  { id: "user001", passwordHash: bcrypt.hashSync("test1234", 10), name: "田中 太郎", companyName: "株式会社テスト", role: "student", createdAt: "2025-01-01" },
  { id: "user002", passwordHash: bcrypt.hashSync("test1234", 10), name: "佐藤 花子", companyName: "株式会社テスト", role: "student", createdAt: "2025-01-01" },
  { id: "admin", passwordHash: bcrypt.hashSync("admin1234", 10), name: "管理者", companyName: "AI寺子屋", role: "admin", createdAt: "2025-01-01" },
];

const viewingHistories: ViewingHistory[] = [];

function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function now() {
  return new Date().toISOString();
}

export const MockAdapter: DatabaseAdapter = {
  // === 読み取り ===
  async getTrainings() { return trainings; },
  async getCategoriesByTraining(tid) { return categories.filter((c) => c.trainingId === tid).sort((a, b) => a.order - b.order); },
  async getCoursesByCategory(cid) { return courses.filter((c) => c.categoryId === cid && c.isPublished); },
  async getCourseById(id) { return courses.find((c) => c.id === id) || null; },
  async getUserById(id) { return users.find((u) => u.id === id) || null; },
  async getViewingHistory(uid) { return viewingHistories.filter((h) => h.userId === uid); },
  async getViewingHistoryByCourse(uid, cid) { return viewingHistories.filter((h) => h.userId === uid && h.courseId === cid); },
  async saveViewingHistory(h) { const id = `vh_${genId()}`; viewingHistories.push({ ...h, id }); return id; },

  // === 研修 CRUD ===
  async createTraining(t) { const id = `t_${genId()}`; trainings.push({ ...t, id, createdAt: now(), updatedAt: now() }); return id; },
  async updateTraining(id, data) { const i = trainings.findIndex((t) => t.id === id); if (i >= 0) trainings[i] = { ...trainings[i], ...data, updatedAt: now() }; },
  async deleteTraining(id) { const i = trainings.findIndex((t) => t.id === id); if (i >= 0) trainings.splice(i, 1); },

  // === カテゴリー CRUD ===
  async createCategory(c) { const id = `c_${genId()}`; categories.push({ ...c, id, createdAt: now(), updatedAt: now() }); return id; },
  async updateCategory(id, data) { const i = categories.findIndex((c) => c.id === id); if (i >= 0) categories[i] = { ...categories[i], ...data, updatedAt: now() }; },
  async deleteCategory(id) { const i = categories.findIndex((c) => c.id === id); if (i >= 0) categories.splice(i, 1); },

  // === 講座 CRUD ===
  async createCourse(c) { const id = `cr_${genId()}`; courses.push({ ...c, id, createdAt: now(), updatedAt: now() }); return id; },
  async updateCourse(id, data) { const i = courses.findIndex((c) => c.id === id); if (i >= 0) courses[i] = { ...courses[i], ...data, updatedAt: now() }; },
  async deleteCourse(id) { const i = courses.findIndex((c) => c.id === id); if (i >= 0) courses.splice(i, 1); },

  // === ユーザー CRUD ===
  async getAllUsers() { return users; },
  async createUser(u) { users.push(u); return u.id; },
  async updateUser(id, data) { const i = users.findIndex((u) => u.id === id); if (i >= 0) users[i] = { ...users[i], ...data }; },
  async deleteUser(id) { const i = users.findIndex((u) => u.id === id); if (i >= 0) users.splice(i, 1); },

  // === 視聴履歴（全体） ===
  async getAllViewingHistory() { return viewingHistories; },
};
