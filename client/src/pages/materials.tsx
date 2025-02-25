import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Material } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/sections/footer";

// List all categories you want to show on the sidebar
const CATEGORIES = [
  "IELTS Reading",
  "IELTS Writing",
  "SAT Math",
  "SAT Verbal",
  "Grammar",
  "Vocabulary",
];

export default function Materials() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch materials from /api/materials
  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ["/api/materials"],
    queryFn: async () => {
      const res = await fetch("/api/materials");
      if (!res.ok) {
        throw new Error("Failed to fetch materials");
      }
      return res.json() as Promise<Material[]>;
    },
  });

  // Filter materials by the selected category
  const filteredMaterials = selectedCategory
    ? materials?.filter((m) => m.type === selectedCategory)
    : [];

  console.log("Fetched materials:", materials);
  console.log("Selected category:", selectedCategory);
  console.log("Filtered materials:", filteredMaterials);

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="flex gap-8">
          {/* Sidebar with categories */}
          <aside className="w-64 hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[400px]">
                <div className="p-4">
                  <ul className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <li
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={
                          "text-sm cursor-pointer " +
                          (selectedCategory === cat
                            ? "text-primary font-medium"
                            : "hover:text-primary")
                        }
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </Card>
          </aside>

          {/* Main content area */}
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
                {!selectedCategory && (
                  <p className="text-gray-500">
                    Please select a category on the left.
                  </p>
                )}

                {selectedCategory && filteredMaterials?.length === 0 && (
                  <p className="text-gray-500">
                    No materials found for {selectedCategory}.
                  </p>
                )}

                {selectedCategory &&
                  filteredMaterials?.map((material) => (
                    <Card key={material.id}>
                      <CardHeader>
                        <CardTitle>{material.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {material.description}
                        </p>
                        {/* Link to PDF */}
                        <a
                          href={`/files/${material.title}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View / Download PDF
                        </a>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer appears at the bottom */}
      <Footer />
    </>
  );
}
