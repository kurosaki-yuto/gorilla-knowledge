










































import { NextRequest, NextResponse } from "next/server";
import { login, logout, getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// ログイン
export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { success: false, message: "IDとパスワードを入力してください" },
        { status: 400 }
      );
    }

    const result = await login(userId, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // ログイン記録を保存
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const ua = request.headers.get("user-agent") || "unknown";
    await db.saveLoginLog({
      userId,
      loginAt: new Date().toISOString(),
      logoutAt: "",
      ipAddress: ip,
      userAgent: ua,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "ログイン処理でエラーが発生しました" },
      { status: 500 }
    );
  }
}

// セッション確認
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, user: session });
}

// ログアウト
export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
