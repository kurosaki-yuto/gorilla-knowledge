"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { VideoPlayer } from "@/components/video-player";
import { QuizForm } from "@/components/quiz-form";
import { CompletionStatus } from "@/components/completion-status";
import type { Course } from "@/types";

interface CategoryNode {
  id: string;
  name: string;
  courses: Course[];
}

interface TrainingNode {
  id: string;
  name: string;
  categories: CategoryNode[];
}

interface CourseBrowserProps {
  tree: TrainingNode[];
  userName: string;
  companyName: string;
}

/** ○ 未視聴 / ● 選択中 / ✓ 完了 のアイコン */
function CourseIcon({ isSelected, isCompleted }: { isSelected: boolean; isCompleted: boolean }) {
  if (isCompleted) {
    return (
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-black text-white text-[8px] leading-none">
        ✓
      </span>
    );
  }
  if (isSelected) {
    return <span className="inline-block w-3 h-3 rounded-full bg-black" />;
  }
  return <span className="inline-block w-3 h-3 rounded-full border-2 border-gray-300" />;
}

export function CourseBrowser({ tree, userName, companyName }: CourseBrowserProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [videoCompletedCourses, setVideoCompletedCourses] = useState<Set<string>>(new Set());
  const [quizPassedCourses, setQuizPassedCourses] = useState<Set<string>>(new Set());

  const toggleCategory = (catId: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // 動画視聴完了コールバック
  const handleCourseComplete = useCallback((courseId: string) => {
    setVideoCompletedCourses((prev) => new Set(prev).add(courseId));
  }, []);

  // テスト合格コールバック
  const handleQuizPass = useCallback((courseId: string) => {
    setQuizPassedCourses((prev) => new Set(prev).add(courseId));
    setCompletedCourses((prev) => new Set(prev).add(courseId));
  }, []);

  // 全講座フラットリスト（前へ/次へ用）
  const allCourses = tree.flatMap((t) => t.categories.flatMap((c) => c.courses));
  const currentIndex = selectedCourse
    ? allCourses.findIndex((c) => c.id === selectedCourse.id)
    : -1;
  const prevCourse = currentIndex > 0 ? allCourses[currentIndex - 1] : null;
  const nextCourse = currentIndex < allCourses.length - 1 ? allCourses[currentIndex + 1] : null;

  const handleBackToOverview = () => setSelectedCourse(null);

  // 進捗計算
  const totalCourseCount = allCourses.length;
  const completedCount = completedCourses.size;

  return (
    <>
      <Navbar userName={userName} companyName={companyName} onBackToOverview={handleBackToOverview} />

      {selectedCourse ? (
        <div className="flex h-[calc(100vh-56px)]">
          {/* サイドバー */}
          <aside
            className={`${sidebarOpen ? "w-[300px]" : "w-0"} shrink-0 border-r border-gray-200 bg-white overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <div className="w-[300px] h-full overflow-y-auto">
              <nav className="py-4">
                {tree.map((training) => (
                  <div key={training.id} className="mb-4">
                    <div className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {training.name}
                    </div>
                    {training.categories.map((cat) => (
                      <div key={cat.id} className="mb-2">
                        <div className="px-5 py-1.5 text-xs font-medium text-gray-500">
                          {cat.name}
                        </div>
                        {cat.courses.map((course) => {
                          const isSelected = selectedCourse?.id === course.id;
                          const isCompleted = completedCourses.has(course.id);
                          return (
                            <button
                              key={course.id}
                              onClick={() => setSelectedCourse(course)}
                              className={`w-full flex items-center gap-3 px-5 py-2 text-sm text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-gray-100 font-medium text-black"
                                  : isCompleted
                                    ? "text-gray-500"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                              }`}
                            >
                              <span className="shrink-0">
                                <CourseIcon isSelected={isSelected} isCompleted={isCompleted} />
                              </span>
                              <span className="truncate">{course.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* サイドバー開閉 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0 w-6 flex items-center justify-center border-r border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <span className="text-gray-400 group-hover:text-black transition-colors text-xs">
              {sidebarOpen ? "◀" : "▶"}
            </span>
          </button>

          {/* メインコンテンツ */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[900px] mx-auto px-8 py-10">
              <h1 className="text-2xl font-bold mb-2">{selectedCourse.name}</h1>
              <p className="text-gray-500 text-sm mb-6">
                所要時間目安：{Math.floor(selectedCourse.durationSeconds / 60)}分
              </p>

              {selectedCourse.description && (
                <div className="mb-8">
                  <h2 className="font-semibold mb-2">学習目標</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>
              )}

              <VideoPlayer
                key={selectedCourse.id}
                course={selectedCourse}
                onComplete={handleCourseComplete}
              />

              {/* 修了ステータス */}
              <div className="mt-6">
                <CompletionStatus
                  key={`status-${selectedCourse.id}-${videoCompletedCourses.has(selectedCourse.id)}-${quizPassedCourses.has(selectedCourse.id)}`}
                  courseId={selectedCourse.id}
                  videoCompleted={videoCompletedCourses.has(selectedCourse.id)}
                  quizPassed={quizPassedCourses.has(selectedCourse.id)}
                />
              </div>

              {/* 確認テスト */}
              <div className="mt-6">
                <QuizForm
                  key={`quiz-${selectedCourse.id}`}
                  courseId={selectedCourse.id}
                  videoCompleted={videoCompletedCourses.has(selectedCourse.id)}
                  onPass={() => handleQuizPass(selectedCourse.id)}
                />
              </div>

              {/* 前へ / 次へ */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
                {prevCourse ? (
                  <button
                    onClick={() => setSelectedCourse(prevCourse)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer group"
                  >
                    <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                    <span>{prevCourse.name}</span>
                  </button>
                ) : <div />}
                {nextCourse ? (
                  <button
                    onClick={() => setSelectedCourse(nextCourse)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer group"
                  >
                    <span>{nextCourse.name}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                ) : <div />}
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* コース概要 */
        <main className="h-[calc(100vh-56px)] overflow-y-auto">
          <div className="max-w-[700px] mx-auto px-8 py-12">
            {tree.map((training) => {
              const trainingCourses = training.categories.flatMap((c) => c.courses);
              const trainingTotal = trainingCourses.length;
              const trainingCompleted = trainingCourses.filter((c) => completedCourses.has(c.id)).length;
              const trainingPercent = trainingTotal > 0 ? Math.round((trainingCompleted / trainingTotal) * 100) : 0;

              return (
                <div key={training.id} className="mb-16">
                  <h1 className="text-3xl font-bold mb-6">{training.name}</h1>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-500"
                        style={{ width: `${trainingPercent}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      全{trainingTotal}レッスン中{trainingCompleted}レッスン完了（{trainingPercent}%）
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="font-bold text-lg mb-6">コース概要</h2>

                    {training.categories.map((cat) => {
                      const isCollapsed = collapsedCats.has(cat.id);
                      return (
                        <div key={cat.id} className="mb-4">
                          <button
                            onClick={() => toggleCategory(cat.id)}
                            className="flex items-center gap-2 py-2 mb-1 cursor-pointer hover:opacity-70 transition-opacity w-full text-left"
                          >
                            <span
                              className="text-gray-400 text-sm transition-transform duration-200"
                              style={{ display: "inline-block", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                            >
                              ▼
                            </span>
                            <span className="font-medium text-sm">{cat.name}</span>
                          </button>

                          <div
                            className="ml-5 space-y-1 overflow-hidden transition-all duration-200"
                            style={{ maxHeight: isCollapsed ? 0 : `${cat.courses.length * 44}px`, opacity: isCollapsed ? 0 : 1 }}
                          >
                            {cat.courses.map((course) => {
                              const isCompleted = completedCourses.has(course.id);
                              return (
                                <button
                                  key={course.id}
                                  onClick={() => setSelectedCourse(course)}
                                  className="w-full flex items-center gap-3 py-2 px-2 -mx-2 rounded text-left hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                  <span className="shrink-0">
                                    <CourseIcon isSelected={false} isCompleted={isCompleted} />
                                  </span>
                                  <span className={`text-sm transition-colors ${isCompleted ? "text-gray-500" : "text-gray-700 group-hover:text-black"}`}>
                                    {course.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}
    </>
  );
}
