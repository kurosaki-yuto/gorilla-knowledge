"use client";

import { useState, useEffect, useCallback } from "react";

interface CsvRow {
  受講者名: string;
  会社名: string;
  コンテンツID: string;
  コンテンツ名: string;
  "標準学習時間（分）": number;
  視聴開始日時: string;
  視聴完了日時: string;
  "実視聴時間（秒）": number;
  テスト合否: string;
  修了ステータス: string;
  修了日: string;
}

interface SubsidyCheck {
  totalHours: number;
  meetsTenHours: boolean;
  totalUsers: number;
  qualifiedUsers: number;
  disqualifiedUsers: number;
  users: {
    userId: string;
    name: string;
    companyName: string;
    totalSeconds: number;
    totalHours: number;
    meetsOneHour: boolean;
  }[];
}

interface CurriculumData {
  trainingName: string;
  categories: {
    categoryName: string;
    courses: { id: string; name: string; durationMinutes: number }[];
  }[];
}

export function ReportExporter() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [subsidyCheck, setSubsidyCheck] = useState<SubsidyCheck | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"csv" | "subsidy" | "curriculum">("csv");

  // 企業一覧取得
  useEffect(() => {
    fetch("/api/report?type=companies")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCompanies(d.companies); });
  }, []);

  const loadCsv = useCallback(async () => {
    setLoading(true);
    const url = `/api/report?type=csv${selectedCompany ? `&company=${encodeURIComponent(selectedCompany)}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) setCsvRows(data.rows);
    setLoading(false);
  }, [selectedCompany]);

  const loadSubsidyCheck = useCallback(async () => {
    setLoading(true);
    const url = `/api/report?type=subsidy-check${selectedCompany ? `&company=${encodeURIComponent(selectedCompany)}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) setSubsidyCheck(data.check);
    setLoading(false);
  }, [selectedCompany]);

  const loadCurriculum = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/report?type=curriculum");
    const data = await res.json();
    if (data.success) setCurriculum(data.curriculum);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "csv") loadCsv();
    else if (activeTab === "subsidy") loadSubsidyCheck();
    else if (activeTab === "curriculum") loadCurriculum();
  }, [activeTab, loadCsv, loadSubsidyCheck, loadCurriculum]);

  // CSVダウンロード
  const downloadCsv = () => {
    if (csvRows.length === 0) return;
    const headers = Object.keys(csvRows[0]);
    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) =>
        headers.map((h) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const val = String((row as any)[h] || "");
          return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",")
      ),
    ].join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `受講履歴_${selectedCompany || "全企業"}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">レポート</h1>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm text-black"
        >
          <option value="">全企業</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: "csv" as const, label: "受講履歴CSV" },
          { id: "subsidy" as const, label: "助成金チェック" },
          { id: "curriculum" as const, label: "カリキュラム一覧" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm cursor-pointer border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-black text-black font-medium"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-600 text-sm">読み込み中...</p>}

      {/* ==================== 受講履歴CSV ==================== */}
      {activeTab === "csv" && !loading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{csvRows.length}件の視聴記録</p>
            <button
              onClick={downloadCsv}
              disabled={csvRows.length === 0}
              className="px-4 py-2 bg-black text-white text-sm rounded disabled:opacity-50 cursor-pointer"
            >
              CSVダウンロード
            </button>
          </div>

          {csvRows.length > 0 && (
            <div className="border border-gray-200 rounded overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">受講者</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">コンテンツ名</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-700">標準時間</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">視聴開始</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">視聴完了</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-700">実視聴</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">テスト</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-700">修了</th>
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(0, 50).map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-3 py-2 text-black">{row.受講者名}</td>
                      <td className="px-3 py-2 text-black">{row.コンテンツ名}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{row["標準学習時間（分）"]}分</td>
                      <td className="px-3 py-2 text-gray-600">{row.視聴開始日時 ? new Date(row.視聴開始日時).toLocaleString("ja-JP") : "−"}</td>
                      <td className="px-3 py-2 text-gray-600">{row.視聴完了日時 ? new Date(row.視聴完了日時).toLocaleString("ja-JP") : "−"}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{row["実視聴時間（秒）"]}秒</td>
                      <td className="px-3 py-2 text-center">{row.テスト合否}</td>
                      <td className="px-3 py-2 text-center">{row.修了ステータス === "修了" ? "✓" : "−"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvRows.length > 50 && (
                <div className="px-3 py-2 text-xs text-gray-600 bg-gray-50">
                  表示: 50件 / 全{csvRows.length}件（CSVダウンロードで全件取得可能）
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== 助成金チェック ==================== */}
      {activeTab === "subsidy" && !loading && subsidyCheck && (
        <div className="space-y-6">
          {/* 全体サマリー */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-lg border ${subsidyCheck.meetsTenHours ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
              <p className="text-sm font-medium text-black mb-1">全員合計受講時間</p>
              <p className="text-2xl font-bold text-black">{subsidyCheck.totalHours}時間</p>
              <p className={`text-sm mt-1 ${subsidyCheck.meetsTenHours ? "text-green-700" : "text-red-700"}`}>
                {subsidyCheck.meetsTenHours ? "✓ 10時間以上の要件を満たしています" : "✗ 10時間以上が必要です"}
              </p>
            </div>
            <div className={`p-5 rounded-lg border ${subsidyCheck.disqualifiedUsers === 0 ? "border-green-300 bg-green-50" : "border-yellow-300 bg-yellow-50"}`}>
              <p className="text-sm font-medium text-black mb-1">1人1時間以上チェック</p>
              <p className="text-2xl font-bold text-black">{subsidyCheck.qualifiedUsers}/{subsidyCheck.totalUsers}人</p>
              <p className={`text-sm mt-1 ${subsidyCheck.disqualifiedUsers === 0 ? "text-green-700" : "text-yellow-700"}`}>
                {subsidyCheck.disqualifiedUsers === 0
                  ? "✓ 全員が1時間以上受講しています"
                  : `✗ ${subsidyCheck.disqualifiedUsers}人が1時間未満（助成対象外）`}
              </p>
            </div>
          </div>

          {/* ユーザー別詳細 */}
          <div>
            <h3 className="font-semibold text-black text-sm mb-3">受講者別の受講時間</h3>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">受講者</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">会社名</th>
                    <th className="text-right px-4 py-2 font-medium text-gray-700">合計時間</th>
                    <th className="text-center px-4 py-2 font-medium text-gray-700">1時間以上</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidyCheck.users.map((u) => (
                    <tr key={u.userId} className={`border-t border-gray-100 ${!u.meetsOneHour ? "bg-red-50" : ""}`}>
                      <td className="px-4 py-2 text-black">{u.name}</td>
                      <td className="px-4 py-2 text-gray-600">{u.companyName}</td>
                      <td className="px-4 py-2 text-right text-black">{u.totalHours}時間</td>
                      <td className="px-4 py-2 text-center">{u.meetsOneHour ? "✓" : <span className="text-red-600 font-medium">✗ 不足</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== カリキュラム一覧 ==================== */}
      {activeTab === "curriculum" && !loading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">助成金提出用カリキュラム一覧</p>
          </div>

          {curriculum.map((training) => (
            <div key={training.trainingName} className="mb-8">
              <h3 className="font-bold text-black mb-3">{training.trainingName}</h3>
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">カテゴリー</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">コンテンツ名</th>
                      <th className="text-right px-4 py-2 font-medium text-gray-700">標準学習時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {training.categories.flatMap((cat) =>
                      cat.courses.map((course, i) => (
                        <tr key={course.id} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-600">{i === 0 ? cat.categoryName : ""}</td>
                          <td className="px-4 py-2 text-black">{course.name}</td>
                          <td className="px-4 py-2 text-right text-black">{course.durationMinutes}分</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-right">
                合計: {training.categories.reduce((sum, c) => sum + c.courses.reduce((s, cr) => s + cr.durationMinutes, 0), 0)}分
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
