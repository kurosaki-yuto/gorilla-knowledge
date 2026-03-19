"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseManager } from "./course-manager";
import { UserManager } from "./user-manager";
import { ProgressViewer } from "./progress-viewer";
import { ReportExporter } from "./report-exporter";

interface AdminDashboardProps {
  userName: string;
}

const TABS = [
  { id: "courses", label: "講座管理" },
  { id: "users", label: "ユーザー管理" },
  { id: "progress", label: "進捗確認" },
  { id: "reports", label: "レポート" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard({ userName }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("courses");
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto flex h-14 items-center justify-between px-6">
          <span className="font-bold text-lg tracking-tight">AI寺子屋 管理</span>
          <div className="flex items-center gap-6 text-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "text-black font-medium"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{userName}</span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="max-w-[1000px] mx-auto px-6 py-10">
        {activeTab === "courses" && <CourseManager />}
        {activeTab === "users" && <UserManager />}
        {activeTab === "progress" && <ProgressViewer />}
        {activeTab === "reports" && <ReportExporter />}
      </main>
    </div>
  );
}
