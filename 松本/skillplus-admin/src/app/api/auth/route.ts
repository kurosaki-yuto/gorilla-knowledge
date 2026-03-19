import { NextRequest, NextResponse } from "next/server";
import { login, logout, getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();
    if (!userId || !password) {
      return NextResponse.json({ success: false, message: "IDとパスワードを入力してください" }, { status: 400 });
    }

    // 管理者チェック
    const user = await db.getUserById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "管理者権限がありません" }, { status: 403 });
    }

    const result = await login(userId, password);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, message: "エラーが発生しました" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user: session });
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
