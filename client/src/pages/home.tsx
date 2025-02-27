import Hero from "@/components/sections/hero";
import CourseCard from "@/components/sections/course-card";
import SuccessStories from "@/components/sections/success-stories";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import { useTranslation } from "react-i18next";
import Footer from "@/components/sections/footer";

export default function Home() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"]
  });
  const { t } = useTranslation();

  return (
    <div>
      <Hero />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('courses.featured')}</h2>
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
      <SuccessStories />
      
      <Footer />
    </div>
  );
}