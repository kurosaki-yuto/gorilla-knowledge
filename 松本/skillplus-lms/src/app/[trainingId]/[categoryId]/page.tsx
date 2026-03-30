
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { CourseCard } from "@/components/course-card";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { CourseWithProgress } from "@/types";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ trainingId: string; categoryId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { trainingId, categoryId } = await params;

  const [trainings, categories, courses] = await Promise.all([
    db.getTrainings(),
    db.getCategoriesByTraining(trainingId),
    db.getCoursesByCategory(categoryId),
  ]);

  const training = trainings.find((t) => t.id === trainingId);
  const category = categories.find((c) => c.id === categoryId);
  if (!training || !category) redirect("/");

  // 講座に進捗情報を付与（仮: 全部未視聴）
  const coursesWithProgress: CourseWithProgress[] = courses.map((c) => ({
    ...c,
    progress: 0,
    isComplete: false,
  }));

  const completedCount = coursesWithProgress.filter((c) => c.isComplete).length;
  const progressPercent =
    courses.length > 0
      ? Math.round((completedCount / courses.length) * 100)
      : 0;

  return (
    <>
      <Navbar userName={session.name} companyName={session.companyName} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>研修一覧</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/${trainingId}`} />}>{training.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 mb-4">{category.description}</p>
          )}

          {/* 進捗バー */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>進捗</span>
              <span>
                {progressPercent}%（{completedCount}/{courses.length}講座完了）
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* 講座グリッド */}
        {coursesWithProgress.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesWithProgress.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                trainingId={trainingId}
                categoryId={categoryId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            講座がまだ登録されていません
          </div>
        )}
      </main>
    </>
  );
}
