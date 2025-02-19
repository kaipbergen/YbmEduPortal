import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentButton } from "@/components/ui/payment-button";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{course.description}</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Level:</span>
              <span className="text-sm">{course.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Price:</span>
              <span className="text-sm font-bold">${course.price}</span>
            </div>
          </div>
          <PaymentButton courseId={course.id} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}