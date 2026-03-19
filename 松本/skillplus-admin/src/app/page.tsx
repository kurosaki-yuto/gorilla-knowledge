import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.getUserById(session.id);
  if (!user || user.role !== "admin") redirect("/login");

  return <AdminDashboard userName={session.name} />;
}
