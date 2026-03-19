import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { VideoPlayer } from "@/components/video-player";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ trainingId: string; categoryId: string; courseId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { trainingId, categoryId, courseId } = await params;

  const [trainings, categories, course, allCourses] = await Promise.all([
    db.getTrainings(),
    db.getCategoriesByTraining(trainingId),
    db.getCourseById(courseId),
    db.getCoursesByCategory(categoryId),
  ]);

  const training = trainings.find((t) => t.id === trainingId);
  const category = categories.find((c) => c.id === categoryId);
  if (!training || !category || !course) redirect("/");

  // 全カテゴリー+講座を取得（サイドバー用）
  const allCategories = await Promise.all(
    categories.map(async (cat) => {
      const courses = await db.getCoursesByCategory(cat.id);
      return { ...cat, courses };
    })
  );

  function formatDuration(s: number) {
    return `${Math.floor(s / 60)}分`;
  }

  return (
    <>
      <Navbar userName={session.name} companyName={session.companyName} />

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* 左サイドバー — Anthropicアカデミー風 */}
        <aside className="w-[280px] shrink-0 border-r border-gray-200 bg-white overflow-y-auto hidden lg:block">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-bold text-base">{training.name}</h2>
            <Link
              href={`/${trainingId}`}
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              コース概要
            </Link>
          </div>

          <nav className="py-2">
            {allCategories.map((cat) => (
              <div key={cat.id} className="mb-1">
                {/* カテゴリー名 */}
                <div className="px-5 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {cat.name}
                </div>

                {/* 講座リスト */}
                {cat.courses.map((c) => {
                  const isCurrent = c.id === courseId;
                  return (
                    <Link
                      key={c.id}
                      href={`/${trainingId}/${cat.id}/${c.id}`}
                      className={`flex items-center gap-3 px-5 py-2 text-sm transition-colors ${
                        isCurrent
                          ? "bg-gray-100 font-medium text-black"
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <span className="shrink-0">
                        {isCurrent ? (
                          <span className="inline-block w-3.5 h-3.5 rounded-full bg-black" />
                        ) : (
                          <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                        )}
                      </span>
                      <span className="truncate">{c.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[800px] mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-4">{course.name}</h1>

            <p className="text-gray-500 text-sm mb-6">
              所要時間目安：{formatDuration(course.durationSeconds)}
            </p>

            {/* 学習目標 */}
            {course.description && (
              <div className="mb-8">
                <h2 className="font-semibold mb-3">学習目標</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {course.description}
                </p>
              </div>
            )}

            {/* 動画プレーヤー */}
            <div className="mb-8">
              <VideoPlayer course={course} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
