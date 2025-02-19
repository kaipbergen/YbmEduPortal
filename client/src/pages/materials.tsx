import { useQuery } from "@tanstack/react-query";
import type { Material } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Materials() {
  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials/1"] // Getting materials for first course as example
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex gap-8">
        <aside className="w-64 hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                <ul className="space-y-2">
                  <li className="text-sm cursor-pointer text-primary font-medium">IELTS Reading</li>
                  <li className="text-sm cursor-pointer hover:text-primary">IELTS Writing</li>
                  <li className="text-sm cursor-pointer hover:text-primary">SAT Math</li>
                  <li className="text-sm cursor-pointer hover:text-primary">SAT Verbal</li>
                  <li className="text-sm cursor-pointer hover:text-primary">Grammar</li>
                  <li className="text-sm cursor-pointer hover:text-primary">Vocabulary</li>
                </ul>
              </div>
            </ScrollArea>
          </Card>
        </aside>

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Study Materials</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {materials?.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <CardTitle>{material.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
