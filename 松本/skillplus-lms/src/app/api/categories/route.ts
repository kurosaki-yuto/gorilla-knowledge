import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const trainingId = request.nextUrl.searchParams.get("trainingId");
    if (!trainingId) {
      return NextResponse.json(
        { success: false, message: "trainingIdが必要です" },
        { status: 400 }
      );
    }
    const categories = await db.getCategoriesByTraining(trainingId);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { success: false, message: "カテゴリーの取得に失敗しました" },
      { status: 500 }
    );
  }
}
