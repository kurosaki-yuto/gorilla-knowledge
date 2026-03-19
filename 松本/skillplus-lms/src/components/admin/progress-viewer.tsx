"use client";

import { useState, useEffect, useCallback } from "react";
import type { ViewingHistory } from "@/types";

interface UserRow {
  id: string;
  name: string;
  companyName: string;
}

interface CompletionRow {
  userId: string;
  courseId: string;
  courseName: string;
  videoCompleted: boolean;
  quizPassed: boolean;
  completedAt: string;
  certificateIssued: boolean;
  userName: string;
  companyName: string;
  standardDurationMin: number;
}

export function ProgressViewer() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [history, setHistory] = useState<ViewingHistory[]>([]);
  const [completions, setCompletions] = useState<CompletionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"users" | "completions">("users");

  const load = useCallback(async () => {
    setLoading(true);
    const [usersData, historyData, completionsData] = await Promise.all([
      fetch("/api/admin?type=users").then((r) => r.json()),
      fetch("/api/admin?type=progress").then((r) => r.json()),
      fetch("/api/admin?type=completions").then((r) => r.json()),
    ]);
    setUsers(usersData);
    setHistory(historyData);
    setCompletions(completionsData);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">進捗確認</h1>
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  // ユーザーごとに視聴履歴をグループ化
  const userProgress = users
    .filter((u: UserRow & { role?: string }) => (u as UserRow & { role?: string }).role !== "admin")
    .map((user) => {
      const userHistory = history.filter((h) => h.userId === user.id);
      const completed = userHistory.filter((h) => h.isComplete);
      const uniqueCompleted = [...new Set(completed.map((h) => h.courseId))];
      const userCompletions = completions.filter((c) => c.userId === user.id);
      const fullyCompleted = userCompletions.filter((c) => c.completedAt);
      return {
        ...user,
        totalViews: userHistory.length,
        completedCourses: uniqueCompleted.length,
        fullyCompletedCourses: fullyCompleted.length,
        lastActivity: userHistory.length > 0 ? userHistory[userHistory.length - 1].date : "なし",
        history: userHistory,
        completions: userCompletions,
      };
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">進捗確認</h1>
        <div className="flex items-center gap-4">
          <div className="flex border border-gray-200 rounded overflow-hidden text-sm">
            <button
              onClick={() => setView("users")}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${view === "users" ? "bg-black text-white" : "hover:bg-gray-50"}`}
            >
              ユーザー別
            </button>
            <button
              onClick={() => setView("completions")}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${view === "completions" ? "bg-black text-white" : "hover:bg-gray-50"}`}
            >
              修了一覧
            </button>
          </div>
          <button onClick={load} className="text-sm text-gray-500 hover:text-black cursor-pointer">
            更新
          </button>
        </div>
      </div>

      {view === "users" ? (
        // ユーザー別ビュー
        userProgress.length === 0 ? (
          <p className="text-gray-500 text-sm">受講生がいません</p>
        ) : (
          <div className="space-y-4">
            {userProgress.map((user) => (
              <details key={user.id} className="border border-gray-200 rounded">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.companyName} ・ ID: {user.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      動画: {user.completedCourses}完了 ・ 修了: {user.fullyCompletedCourses}
                    </p>
                    <p className="text-xs text-gray-500">最終: {user.lastActivity}</p>
                  </div>
                </summary>
                <div className="border-t border-gray-200 p-4">
                  {/* 修了状況 */}
                  {user.completions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">修了状況</h4>
                      <div className="space-y-1">
                        {user.completions.map((c) => (
                          <div key={`${c.userId}-${c.courseId}`} className="flex items-center justify-between text-sm py-1">
                            <div className="flex items-center gap-2">
                              {c.completedAt ? (
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-600 text-white text-[8px]">✓</span>
                              ) : (
                                <span className="inline-block w-4 h-4 rounded-full border-2 border-yellow-400" />
                              )}
                              <span>{c.courseName}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                              <span>動画: {c.videoCompleted ? "済" : "未"}</span>
                              <span>テスト: {c.quizPassed ? "合格" : "未"}</span>
                              <span>{c.completedAt ? `修了: ${new Date(c.completedAt).toLocaleDateString("ja-JP")}` : "未修了"}</span>
                              {c.certificateIssued && <span className="text-green-600">証明書発行済</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 視聴履歴 */}
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">視聴履歴</h4>
                  {user.history.length === 0 ? (
                    <p className="text-sm text-gray-400">視聴履歴なし</p>
                  ) : (
                    <div className="space-y-1">
                      {user.history.map((h) => (
                        <div key={h.id} className="flex items-center justify-between text-sm py-1">
                          <div className="flex items-center gap-2">
                            {h.isComplete ? (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[8px]">✓</span>
                            ) : (
                              <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span>講座ID: {h.courseId}</span>
                          </div>
                          <div className="text-gray-500 text-xs">
                            {h.date} {h.startTime}〜{h.endTime} ・ {Math.floor(h.durationSeconds / 60)}分{h.durationSeconds % 60}秒 ・ {h.isComplete ? "完了" : "未完了"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        )
      ) : (
        // 修了一覧ビュー
        completions.length === 0 ? (
          <p className="text-gray-500 text-sm">修了記録がありません</p>
        ) : (
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">受講者</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">会社名</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">講座名</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">動画</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">テスト</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">修了</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">修了日</th>
                </tr>
              </thead>
              <tbody>
                {completions.map((c, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2">{c.userName}</td>
                    <td className="px-4 py-2 text-gray-500">{c.companyName}</td>
                    <td className="px-4 py-2">{c.courseName}</td>
                    <td className="px-4 py-2 text-center">{c.videoCompleted ? "✓" : "−"}</td>
                    <td className="px-4 py-2 text-center">{c.quizPassed ? "✓" : "−"}</td>
                    <td className="px-4 py-2 text-center">{c.completedAt ? "✓" : "−"}</td>
                    <td className="px-4 py-2 text-gray-500">
                      {c.completedAt ? new Date(c.completedAt).toLocaleDateString("ja-JP") : "−"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
