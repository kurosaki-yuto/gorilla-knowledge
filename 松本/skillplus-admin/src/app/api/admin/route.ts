import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.getUserById(session.id);
  if (!user || user.role !== "admin") return null;
  return session;
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");

  switch (type) {
    case "trainings":
      return NextResponse.json(await db.getTrainings());
    case "categories": {
      const tid = request.nextUrl.searchParams.get("trainingId") || "";
      return NextResponse.json(await db.getCategoriesByTraining(tid));
    }
    case "courses": {
      const cid = request.nextUrl.searchParams.get("categoryId") || "";
      return NextResponse.json(await db.getCoursesByCategory(cid));
    }
    case "users":
      return NextResponse.json(
        (await db.getAllUsers()).map((u) => ({ ...u, passwordHash: undefined }))
      );
    case "progress":
      return NextResponse.json(await db.getAllViewingHistory());
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action, ...data } = body;

  try {
    switch (action) {
      case "createTraining": {
        const id = await db.createTraining({ id: "", name: data.name, description: data.description || "" });
        return NextResponse.json({ success: true, id });
      }
      case "updateTraining": {
        await db.updateTraining(data.id, { name: data.name, description: data.description });
        return NextResponse.json({ success: true });
      }
      case "deleteTraining": {
        await db.deleteTraining(data.id);
        return NextResponse.json({ success: true });
      }
      case "createCategory": {
        const id = await db.createCategory({ id: "", trainingId: data.trainingId, name: data.name, description: data.description || "", order: data.order || 0 });
        return NextResponse.json({ success: true, id });
      }
      case "updateCategory": {
        await db.updateCategory(data.id, { name: data.name, description: data.description, order: data.order });
        return NextResponse.json({ success: true });
      }
      case "deleteCategory": {
        await db.deleteCategory(data.id);
        return NextResponse.json({ success: true });
      }
      case "createCourse": {
        const id = await db.createCourse({
          id: "", categoryId: data.categoryId, name: data.name, description: data.description || "",
          videoUrl: data.videoUrl || "", isPublished: data.isPublished ?? true,
          durationSeconds: data.durationSeconds || 0, thumbnailUrl: data.thumbnailUrl || "",
        });
        return NextResponse.json({ success: true, id });
      }
      case "updateCourse": {
        await db.updateCourse(data.id, data);
        return NextResponse.json({ success: true });
      }
      case "deleteCourse": {
        await db.deleteCourse(data.id);
        return NextResponse.json({ success: true });
      }
      case "createUser": {
        const hash = await bcrypt.hash(data.password, 10);
        await db.createUser({ id: data.id, passwordHash: hash, name: data.name, companyName: data.companyName || "", role: data.role || "student", createdAt: new Date().toISOString() });
        return NextResponse.json({ success: true });
      }
      case "updateUser": {
        const update: Record<string, unknown> = { name: data.name, companyName: data.companyName, role: data.role };
        if (data.password) update.passwordHash = await bcrypt.hash(data.password, 10);
        await db.updateUser(data.id, update);
        return NextResponse.json({ success: true });
      }
      case "deleteUser": {
        await db.deleteUser(data.id);
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (e) {
    console.error("Admin API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
