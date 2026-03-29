"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Training, Category, Course } from "@/types";


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
  const handleSaveCourse = async (data: { name: string; description: string; videoUrl: string; durationSeconds: number; contentJson: unknown }) => {
    if (editingCourse?.id) {
      await post({ action: "updateCourse", id: editingCourse.id, ...data });
    } else if (selectedCategory) {
      await post({ action: "createCourse", categoryId: selectedCategory, ...data, isPublished: true });
    }
    setEditorOpen(false);
    setEditingCourse(null);
    if (selectedCategory) loadCourses(selectedCategory);
  };

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

  const selectedTrainingName = trainings.find((t) => t.id === selectedTraining)?.name;
  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">講座管理</h1>

      {/* Finderスタイル カラムビュー */}
      <div className="flex gap-0">

        {/* 第1カラム: 研修 */}
        <div className="min-w-0" style={{ width: selectedTraining ? "200px" : "100%" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500">研修</h2>
            <button
              onClick={() => { setShowForm("training"); setFormData({}); }}
              className="text-sm text-gray-400 hover:text-black cursor-pointer"
            >
              ＋
            </button>
          </div>
          <div>
            {trainings.map((t) => (
              <div
                key={t.id}
                onClick={() => { setSelectedTraining(t.id); setSelectedCategory(null); setCourses([]); }}
                className={`group flex items-center justify-between py-2 px-2 -mx-2 rounded cursor-pointer transition-colors ${
                  selectedTraining === t.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-sm text-black truncate flex-1">{t.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("この研修を削除しますか？")) {
                        post({ action: "deleteTraining", id: t.id }).then(() => {
                          if (selectedTraining === t.id) { setSelectedTraining(null); setCategories([]); setCourses([]); }
                          loadTrainings();
                        });
                      }
                    }}
                    className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer"
                  >
                    削除
                  </button>
                  {selectedTraining === t.id && <span className="text-gray-300 text-xs">›</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 第2カラム: カテゴリー */}
        {selectedTraining && (
          <>
            <div className="w-px bg-gray-200 mx-6 self-stretch shrink-0" />
            <div className="min-w-0" style={{ width: selectedCategory ? "200px" : "300px" }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-500 truncate">{selectedTrainingName}</h2>
                <button
                  onClick={() => { setShowForm("category"); setFormData({}); }}
                  className="text-sm text-gray-400 hover:text-black cursor-pointer shrink-0"
                >
                  ＋
                </button>
              </div>
              <div>
                {categories.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">カテゴリーなし</p>
                ) : (
                  categories.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`group flex items-center justify-between py-2 px-2 -mx-2 rounded cursor-pointer transition-colors ${
                        selectedCategory === c.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm text-black truncate flex-1">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("このカテゴリーを削除しますか？")) {
                              post({ action: "deleteCategory", id: c.id }).then(() => {
                                if (selectedCategory === c.id) { setSelectedCategory(null); setCourses([]); }
                                if (selectedTraining) loadCategories(selectedTraining);
                              });
                            }
                          }}
                          className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 cursor-pointer"
                        >
                          削除
                        </button>
                        {selectedCategory === c.id && <span className="text-gray-300 text-xs">›</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* 第3カラム: 講座 */}
        {selectedCategory && (
          <>
            <div className="w-px bg-gray-200 mx-6 self-stretch shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-500 truncate">{selectedCategoryName}</h2>
                <button
                  onClick={() => { setEditingCourse(null); setEditorOpen(true); }}
                  className="text-sm text-gray-400 hover:text-black cursor-pointer shrink-0"
                >
                  ＋ 新しい講座
                </button>
              </div>
              <div>
                {courses.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">講座なし</p>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="group flex items-center justify-between py-2 px-2 -mx-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-black">{course.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {course.videoUrl ? "YouTube設定済み" : "動画未設定"} ・ {Math.floor(course.durationSeconds / 60)}分
                        </p>
                      </div>
                      <div className="flex gap-3 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => { setEditingCourse(course); setEditorOpen(true); }} className="text-xs text-gray-500 hover:text-black cursor-pointer">編集</button>
                        <button
                          onClick={() => { if (confirm("この講座を削除しますか？")) { post({ action: "deleteCourse", id: course.id }).then(() => { if (selectedCategory) loadCourses(selectedCategory); }); } }}
                          className="text-xs text-gray-300 hover:text-red-500 cursor-pointer"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

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
