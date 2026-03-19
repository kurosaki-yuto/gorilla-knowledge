"use client";

import { useState, useEffect, useCallback } from "react";
import type { Training, Category, Course } from "@/types";

async function api(type: string, params?: Record<string, string>) {
  const url = new URL("/api/admin", window.location.origin);
  url.searchParams.set("type", type);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function post(body: Record<string, unknown>) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function CourseManager() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [showForm, setShowForm] = useState<"training" | "category" | "course" | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const loadTrainings = useCallback(async () => {
    setTrainings(await api("trainings"));
  }, []);

  const loadCategories = useCallback(async (tid: string) => {
    setCategories(await api("categories", { trainingId: tid }));
  }, []);

  const loadCourses = useCallback(async (cid: string) => {
    setCourses(await api("courses", { categoryId: cid }));
  }, []);

  useEffect(() => { loadTrainings(); }, [loadTrainings]);
  useEffect(() => { if (selectedTraining) loadCategories(selectedTraining); }, [selectedTraining, loadCategories]);
  useEffect(() => { if (selectedCategory) loadCourses(selectedCategory); }, [selectedCategory, loadCourses]);

  const handleSubmit = async () => {
    if (showForm === "training") {
      await post({ action: "createTraining", name: formData.name, description: formData.description });
      loadTrainings();
    } else if (showForm === "category" && selectedTraining) {
      await post({ action: "createCategory", trainingId: selectedTraining, name: formData.name, description: formData.description, order: categories.length + 1 });
      loadCategories(selectedTraining);
    } else if (showForm === "course" && selectedCategory) {
      await post({ action: "createCourse", categoryId: selectedCategory, name: formData.name, description: formData.description, videoUrl: formData.videoUrl, durationSeconds: parseInt(formData.durationSeconds || "0") });
      loadCourses(selectedCategory);
    }
    setShowForm(null);
    setFormData({});
  };

  const handleDeleteTraining = async (id: string) => {
    if (!confirm("この研修を削除しますか？")) return;
    await post({ action: "deleteTraining", id });
    setSelectedTraining(null);
    loadTrainings();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("このカテゴリーを削除しますか？")) return;
    await post({ action: "deleteCategory", id });
    setSelectedCategory(null);
    if (selectedTraining) loadCategories(selectedTraining);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("この講座を削除しますか？")) return;
    await post({ action: "deleteCourse", id });
    if (selectedCategory) loadCourses(selectedCategory);
  };

  const handleSaveCourse = async () => {
    if (!editingCourse?.id) return;
    await post({ action: "updateCourse", ...editingCourse });
    setEditingCourse(null);
    if (selectedCategory) loadCourses(selectedCategory);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">講座管理</h1>

      {/* 研修一覧 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">研修</h2>
          <button onClick={() => { setShowForm("training"); setFormData({}); }} className="text-sm text-gray-500 hover:text-black cursor-pointer">＋ 追加</button>
        </div>
        <div className="space-y-1">
          {trainings.map((t) => (
            <div key={t.id} className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-colors ${selectedTraining === t.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <button onClick={() => { setSelectedTraining(t.id); setSelectedCategory(null); }} className="flex-1 text-left text-sm cursor-pointer">{t.name}</button>
              <button onClick={() => handleDeleteTraining(t.id)} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer ml-2">削除</button>
            </div>
          ))}
        </div>
      </div>

      {/* カテゴリー一覧 */}
      {selectedTraining && (
        <div className="mb-8 pl-6 border-l-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">カテゴリー</h2>
            <button onClick={() => { setShowForm("category"); setFormData({}); }} className="text-sm text-gray-500 hover:text-black cursor-pointer">＋ 追加</button>
          </div>
          <div className="space-y-1">
            {categories.map((c) => (
              <div key={c.id} className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-colors ${selectedCategory === c.id ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                <button onClick={() => setSelectedCategory(c.id)} className="flex-1 text-left text-sm cursor-pointer">{c.name}</button>
                <button onClick={() => handleDeleteCategory(c.id)} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer ml-2">削除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 講座一覧 */}
      {selectedCategory && (
        <div className="mb-8 pl-12 border-l-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">講座</h2>
            <button onClick={() => { setShowForm("course"); setFormData({}); }} className="text-sm text-gray-500 hover:text-black cursor-pointer">＋ 追加</button>
          </div>
          <div className="space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded p-4">
                {editingCourse?.id === course.id ? (
                  <div className="space-y-3">
                    <input value={editingCourse.name || ""} onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="講座名" />
                    <input value={editingCourse.description || ""} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="説明" />
                    <input value={editingCourse.videoUrl || ""} onChange={(e) => setEditingCourse({ ...editingCourse, videoUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="YouTube URL" />
                    <input type="number" value={editingCourse.durationSeconds || 0} onChange={(e) => setEditingCourse({ ...editingCourse, durationSeconds: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="動画時間（秒）" />
                    <div className="flex gap-2">
                      <button onClick={handleSaveCourse} className="px-4 py-1.5 bg-black text-white text-sm rounded cursor-pointer">保存</button>
                      <button onClick={() => setEditingCourse(null)} className="px-4 py-1.5 text-sm text-gray-500 cursor-pointer">キャンセル</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {course.videoUrl ? "YouTube設定済み" : "動画未設定"} ・ {Math.floor(course.durationSeconds / 60)}分
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCourse(course)} className="text-xs text-gray-500 hover:text-black cursor-pointer">編集</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">削除</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 追加フォーム */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => setShowForm(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-4">
              {showForm === "training" ? "研修を追加" : showForm === "category" ? "カテゴリーを追加" : "講座を追加"}
            </h3>
            <div className="space-y-3">
              <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder="名前" />
              <input value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder="説明" />
              {showForm === "course" && (
                <>
                  <input value={formData.videoUrl || ""} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder="YouTube URL" />
                  <input type="number" value={formData.durationSeconds || ""} onChange={(e) => setFormData({ ...formData, durationSeconds: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" placeholder="動画時間（秒）" />
                </>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white text-sm rounded cursor-pointer">追加</button>
                <button onClick={() => setShowForm(null)} className="px-4 py-2 text-sm text-gray-500 cursor-pointer">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
