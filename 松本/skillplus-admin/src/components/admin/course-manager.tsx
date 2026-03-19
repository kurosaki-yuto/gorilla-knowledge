"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Training, Category, Course } from "@/types";

import { QuizManager } from "./quiz-manager";

// BlockNoteはCSRのみなのでdynamic import
const CourseEditor = dynamic(
  () => import("./course-editor").then((m) => m.CourseEditor),
  { ssr: false, loading: () => <div className="p-10 text-gray-700">エディタ読み込み中...</div> }
);

async function api(type: string, params?: Record<string, string>) {
  const url = new URL("/api/admin", window.location.origin);
  url.searchParams.set("type", type);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return (await fetch(url.toString())).json();
}

async function post(body: Record<string, unknown>) {
  return (await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
}

export function CourseManager() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  // エディタ状態
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  // テスト管理
  const [quizCourse, setQuizCourse] = useState<Course | null>(null);

  // 追加フォーム
  const [showForm, setShowForm] = useState<"training" | "category" | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const loadTrainings = useCallback(async () => { setTrainings(await api("trainings")); }, []);
  const loadCategories = useCallback(async (tid: string) => { setCategories(await api("categories", { trainingId: tid })); }, []);
  const loadCourses = useCallback(async (cid: string) => { setCourses(await api("courses", { categoryId: cid })); }, []);

  useEffect(() => { loadTrainings(); }, [loadTrainings]);
  useEffect(() => { if (selectedTraining) loadCategories(selectedTraining); }, [selectedTraining, loadCategories]);
  useEffect(() => { if (selectedCategory) loadCourses(selectedCategory); }, [selectedCategory, loadCourses]);

  const handleAddForm = async () => {
    if (showForm === "training") {
      await post({ action: "createTraining", name: formData.name, description: formData.description });
      loadTrainings();
    } else if (showForm === "category" && selectedTraining) {
      await post({ action: "createCategory", trainingId: selectedTraining, name: formData.name, description: formData.description, order: categories.length + 1 });
      loadCategories(selectedTraining);
    }
    setShowForm(null);
    setFormData({});
  };

  // 講座エディタで保存
  const handleSaveCourse = async (data: { name: string; description: string; videoUrl: string; durationSeconds: number }) => {
    if (editingCourse?.id) {
      await post({ action: "updateCourse", id: editingCourse.id, ...data });
    } else if (selectedCategory) {
      await post({ action: "createCourse", categoryId: selectedCategory, ...data, isPublished: true });
    }
    setEditorOpen(false);
    setEditingCourse(null);
    if (selectedCategory) loadCourses(selectedCategory);
  };

  // テスト管理が開いている場合
  if (quizCourse) {
    return (
      <QuizManager
        courseId={quizCourse.id}
        courseName={quizCourse.name}
        onClose={() => setQuizCourse(null)}
      />
    );
  }

  // エディタが開いている場合
  if (editorOpen) {
    return (
      <CourseEditor
        course={editingCourse || undefined}
        categoryId={selectedCategory || ""}
        onSave={handleSaveCourse}
        onClose={() => { setEditorOpen(false); setEditingCourse(null); }}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-8">講座管理</h1>

      {/* 研修 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-black">研修</h2>
          <button onClick={() => { setShowForm("training"); setFormData({}); }} className="text-sm text-gray-700 hover:text-black cursor-pointer">＋ 追加</button>
        </div>
        <div className="space-y-1">
          {trainings.map((t) => (
            <div key={t.id} className={`flex items-center justify-between py-2.5 px-3 rounded cursor-pointer transition-colors ${selectedTraining === t.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <button onClick={() => { setSelectedTraining(t.id); setSelectedCategory(null); }} className="flex-1 text-left text-sm text-black cursor-pointer">{t.name}</button>
              <button onClick={async () => { if (confirm("削除しますか？")) { await post({ action: "deleteTraining", id: t.id }); setSelectedTraining(null); loadTrainings(); } }} className="text-xs text-gray-600 hover:text-red-600 cursor-pointer ml-2">削除</button>
            </div>
          ))}
        </div>
      </div>

      {/* カテゴリー */}
      {selectedTraining && (
        <div className="mb-8 pl-6 border-l-2 border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-black text-sm">カテゴリー</h2>
            <button onClick={() => { setShowForm("category"); setFormData({}); }} className="text-sm text-gray-700 hover:text-black cursor-pointer">＋ 追加</button>
          </div>
          <div className="space-y-1">
            {categories.map((c) => (
              <div key={c.id} className={`flex items-center justify-between py-2.5 px-3 rounded cursor-pointer transition-colors ${selectedCategory === c.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                <button onClick={() => setSelectedCategory(c.id)} className="flex-1 text-left text-sm text-black cursor-pointer">{c.name}</button>
                <button onClick={async () => { if (confirm("削除しますか？")) { await post({ action: "deleteCategory", id: c.id }); setSelectedCategory(null); if (selectedTraining) loadCategories(selectedTraining); } }} className="text-xs text-gray-600 hover:text-red-600 cursor-pointer ml-2">削除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 講座 */}
      {selectedCategory && (
        <div className="mb-8 pl-12 border-l-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-black text-sm">講座</h2>
            <button
              onClick={() => { setEditingCourse(null); setEditorOpen(true); }}
              className="text-sm text-gray-700 hover:text-black cursor-pointer"
            >
              ＋ 新しい講座
            </button>
          </div>
          <div className="space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-black">{course.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {course.videoUrl ? "YouTube設定済み" : "動画未設定"} ・ {Math.floor(course.durationSeconds / 60)}分
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setQuizCourse(course)}
                    className="text-xs text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    テスト
                  </button>
                  <button
                    onClick={() => { setEditingCourse(course); setEditorOpen(true); }}
                    className="text-xs text-gray-700 hover:text-black cursor-pointer"
                  >
                    編集
                  </button>
                  <button
                    onClick={async () => { if (confirm("削除しますか？")) { await post({ action: "deleteCourse", id: course.id }); if (selectedCategory) loadCourses(selectedCategory); } }}
                    className="text-xs text-gray-600 hover:text-red-600 cursor-pointer"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 研修/カテゴリー追加モーダル */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-black mb-4">
              {showForm === "training" ? "研修を追加" : "カテゴリーを追加"}
            </h3>
            <div className="space-y-3">
              <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black" placeholder="名前" />
              <input value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black" placeholder="説明" />
              <div className="flex gap-2 pt-2">
                <button onClick={handleAddForm} className="px-4 py-2 bg-black text-white text-sm rounded cursor-pointer">追加</button>
                <button onClick={() => setShowForm(null)} className="px-4 py-2 text-sm text-gray-700 cursor-pointer">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
