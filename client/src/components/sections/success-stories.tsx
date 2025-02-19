import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const stories = [
  {
    image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff",
    name: "Sarah Chen",
    achievement: "IELTS Band 8.5",
    text: "YBM's structured approach helped me achieve my target score in just 3 months!"
  },
  {
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
    name: "Michael Park",
    achievement: "SAT 1550",
    text: "The personalized attention and practice materials made all the difference."
  },
  {
    image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70",
    name: "Emma Wilson",
    achievement: "Cambridge University Offer",
    text: "YBM's university application guidance was instrumental in my success."
  }
];

export default function SuccessStories() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('successStories.title')}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-1">{story.name}</h3>
                <p className="text-primary font-medium mb-2">{story.achievement}</p>
                <p className="text-muted-foreground">{story.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}