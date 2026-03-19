import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CourseBrowser } from "@/components/course-browser";
import type { Course } from "@/types";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const trainings = await db.getTrainings();

  const tree = await Promise.all(
    trainings.map(async (training) => {
      const categories = await db.getCategoriesByTraining(training.id);
      const categoriesWithCourses = await Promise.all(
        categories.map(async (cat) => {
          const courses = await db.getCoursesByCategory(cat.id);
          return {
            id: cat.id,
            name: cat.name,
            courses: courses as Course[],
          };
        })
      );
      return {
        id: training.id,
        name: training.name,
        categories: categoriesWithCourses,
      };
    })
  );

  return (
    <CourseBrowser
      tree={tree}
      userName={session.name}
      companyName={session.companyName}
    />
  );
}
