import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import CourseCard from "@/components/sections/course-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Courses() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"]
  });

  const courseTypes = ["All", "IELTS", "SAT", "General English"];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Our Courses</h1>

      <Tabs defaultValue="All" className="mb-8">
        <TabsList>
          {courseTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        {courseTypes.map((type) => (
          <TabsContent key={type} value={type}>
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-3">
                {courses
                  ?.filter((course) => type === "All" || course.type === type)
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
