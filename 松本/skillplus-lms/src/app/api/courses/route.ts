import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get("categoryId");
    const courseId = request.nextUrl.searchParams.get("courseId");

    if (courseId) {
      const course = await db.getCourseById(courseId);
      if (!course) {
        return NextResponse.json(
          { success: false, message: "講座が見つかりません" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, course });
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "categoryIdが必要です" },
        { status: 400 }
      );
    }

    const courses = await db.getCoursesByCategory(categoryId);
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { success: false, message: "講座の取得に失敗しました" },
      { status: 500 }
    );
  }
}
