import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-primary py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold md:text-6xl">
              Your Path to Academic Excellence
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Expert guidance for IELTS, SAT, and university applications. Start your journey to success with YBM.
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary">
                Explore Courses
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf"
              alt="Students studying"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
