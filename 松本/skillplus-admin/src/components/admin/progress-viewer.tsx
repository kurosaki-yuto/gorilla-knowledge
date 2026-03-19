"use client";

import { useState, useEffect, useCallback } from "react";
import type { ViewingHistory } from "@/types";

interface UserRow {
  id: string;
  name: string;
  companyName: string;
}

export function ProgressViewer() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [history, setHistory] = useState<ViewingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [usersData, historyData] = await Promise.all([
      fetch("/api/admin?type=users").then((r) => r.json()),
      fetch("/api/admin?type=progress").then((r) => r.json()),
    ]);
    setUsers(usersData);
    setHistory(historyData);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">進捗確認</h1>
        <p className="text-gray-700 text-sm">読み込み中...</p>
      </div>
    );
  }

  // ユーザーごとに視聴履歴をグループ化
  const userProgress = users
    .filter((u) => u.id !== "admin")
    .map((user) => {
      const userHistory = history.filter((h) => h.userId === user.id);
      const completed = userHistory.filter((h) => h.isComplete);
      const uniqueCompleted = [...new Set(completed.map((h) => h.courseId))];
      return {
        ...user,
        totalViews: userHistory.length,
        completedCourses: uniqueCompleted.length,
        lastActivity: userHistory.length > 0 ? userHistory[userHistory.length - 1].date : "なし",
        history: userHistory,
      };
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">進捗確認</h1>
        <button onClick={load} className="text-sm text-gray-700 hover:text-black cursor-pointer">
          更新
        </button>
      </div>

      {userProgress.length === 0 ? (
        <p className="text-gray-700 text-sm">受講生がいません</p>
      ) : (
        <div className="space-y-4">
          {userProgress.map((user) => (
            <details key={user.id} className="border border-gray-200 rounded">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-700">{user.companyName} ・ ID: {user.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.completedCourses}講座完了</p>
                  <p className="text-xs text-gray-700">最終: {user.lastActivity}</p>
                </div>
              </summary>
              <div className="border-t border-gray-200 p-4">
                {user.history.length === 0 ? (
                  <p className="text-sm text-gray-600">視聴履歴なし</p>
                ) : (
                  <div className="space-y-2">
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
                        <div className="text-gray-700 text-xs">
                          {h.date} ・ {Math.floor(h.durationSeconds / 60)}分{h.durationSeconds % 60}秒 ・ {h.isComplete ? "完了" : "未完了"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
