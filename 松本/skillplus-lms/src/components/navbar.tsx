"use client";

import { useRouter } from "next/navigation";

interface NavbarProps {
  userName?: string;
  companyName?: string;
  onBackToOverview?: () => void;
}

export function Navbar({ userName, onBackToOverview }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto flex h-14 items-center justify-between px-6">
        <button
          onClick={onBackToOverview}
          className="font-bold text-lg tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
        >
          AI寺子屋
        </button>
        <div className="flex items-center gap-6 text-sm">
          <button
            onClick={onBackToOverview}
            className="text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            講座
          </button>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">{userName}</span>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              {userName?.charAt(0) || "U"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
