import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import CourseCard from "@/components/sections/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import Footer from "@/components/sections/footer";

export default function Courses() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"]
  });
  const { t } = useTranslation();

  const courseTypes = [
    { id: "all", label: t("courses.types.all") },
    { id: "ielts", label: t("courses.types.ielts") },
    { id: "sat", label: t("courses.types.sat") },
    { id: "general", label: t("courses.types.general") }
  ];

  return (
    <>
      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">{t("navigation.courses")}</h1>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            {courseTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {courseTypes.map((type) => (
            <TabsContent key={type.id} value={type.id}>
              {isLoading ? (
                <div className="grid gap-8 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-100 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-3">
                  {courses
                    ?.filter(
                      (course) => type.id === "all" || course.type === type.label
                    )
                    .map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </>
  );
}