import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const trainings = await db.getTrainings();
    return NextResponse.json({ success: true, trainings });
  } catch (error) {
    console.error("Failed to fetch trainings:", error);
    return NextResponse.json(
      { success: false, message: "研修データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
