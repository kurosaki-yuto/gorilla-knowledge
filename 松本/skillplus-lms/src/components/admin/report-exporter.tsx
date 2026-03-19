"use client";

import { useState, useEffect, useCallback } from "react";

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

interface UserRow {
  id: string;
  name: string;
  companyName: string;
}

export function ReportExporter() {
  const [completions, setCompletions] = useState<CompletionRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    const [completionsData, usersData] = await Promise.all([
      fetch("/api/admin?type=completions").then((r) => r.json()),
      fetch("/api/admin?type=users").then((r) => r.json()),
    ]);
    setCompletions(completionsData);
    setUsers(usersData);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // 会社名一覧（重複排除）
  const companies = [...new Set(users.filter((u: UserRow & { role?: string }) => (u as UserRow & { role?: string }).role !== "admin").map((u) => u.companyName))];

  const handleDownloadCSV = () => {
    const url = selectedCompany
      ? `/api/admin?type=csv&company=${encodeURIComponent(selectedCompany)}`
      : "/api/admin?type=csv";
    window.open(url, "_blank");
  };

  const handleDownloadCertificate = (userId: string, courseId: string) => {
    // 管理者が特定ユーザーの修了証を取得する場合、別のエンドポイントが必要
    // 現在はユーザー自身のみなので、URLを開く
    window.open(`/api/certificate?courseId=${courseId}&userId=${userId}`, "_blank");
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">レポート</h1>
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  const filteredCompletions = selectedCompany
    ? completions.filter((c) => c.companyName === selectedCompany)
    : completions;

  const fullyCompleted = filteredCompletions.filter((c) => c.completedAt);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">レポート</h1>

      {/* フィルター */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="text-xs text-gray-500 block mb-1">企業フィルター</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
          >
            <option value="">全企業</option>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">総受講者数</p>
          <p className="text-2xl font-bold">
            {selectedCompany
              ? users.filter((u: UserRow & { role?: string }) => u.companyName === selectedCompany && (u as UserRow & { role?: string }).role !== "admin").length
              : users.filter((u: UserRow & { role?: string }) => (u as UserRow & { role?: string }).role !== "admin").length
            }
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">修了済み講座数</p>
          <p className="text-2xl font-bold">{fullyCompleted.length}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">学習中</p>
          <p className="text-2xl font-bold">{filteredCompletions.length - fullyCompleted.length}</p>
        </div>
      </div>

      {/* ダウンロードボタン */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors cursor-pointer"
        >
          受講履歴CSVダウンロード
        </button>
      </div>

      {/* 修了者一覧 + 修了証ダウンロード */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4">修了者一覧</h2>
        {fullyCompleted.length === 0 ? (
          <p className="text-gray-500 text-sm">修了者がいません</p>
        ) : (
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">受講者</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">会社名</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">講座名</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">標準学習時間</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">修了日</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">修了証</th>
                </tr>
              </thead>
              <tbody>
                {fullyCompleted.map((c, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2">{c.userName}</td>
                    <td className="px-4 py-2 text-gray-500">{c.companyName}</td>
                    <td className="px-4 py-2">{c.courseName}</td>
                    <td className="px-4 py-2 text-gray-500">{c.standardDurationMin}分</td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(c.completedAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDownloadCertificate(c.userId, c.courseId)}
                        className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer underline"
                      >
                        ダウンロード
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
