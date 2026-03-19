import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { trainingId } = await params;
  const [trainings, categories] = await Promise.all([
    db.getTrainings(),
    db.getCategoriesByTraining(trainingId),
  ]);

  const training = trainings.find((t) => t.id === trainingId);
  if (!training) redirect("/");

  // 各カテゴリーの講座を取得
  const categoriesWithCourses = await Promise.all(
    categories.map(async (cat) => {
      const courses = await db.getCoursesByCategory(cat.id);
      return { ...cat, courses };
    })
  );

  return (
    <>
      <Navbar userName={session.name} companyName={session.companyName} />
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black transition-colors mb-6 inline-flex items-center gap-1"
        >
          ← コース概要
        </Link>

        <h1 className="text-2xl font-bold mt-4 mb-2">{training.name}</h1>
        {training.description && (
          <p className="text-gray-500 mb-8">{training.description}</p>
        )}

        <div className="space-y-6">
          {categoriesWithCourses.map((category) => (
            <div key={category.id}>
              {/* カテゴリーヘッダー */}
              <div className="flex items-center gap-2 py-2 border-b border-gray-200 mb-1">
                <span className="text-gray-400 text-sm">▼</span>
                <span className="font-medium text-sm">{category.name}</span>
              </div>

              {/* 講座リスト */}
              <div className="ml-4">
                {category.courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/${trainingId}/${category.id}/${course.id}`}
                    className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded hover:bg-gray-50 transition-colors group"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 group-hover:border-black transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                      {course.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
