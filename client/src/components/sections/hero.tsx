import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
<<<<<<< HEAD
    <div className="relative overflow-hidden bg-primary py-20 text-white">
      <div className="container mx-auto px-4">
=======
    <div
      className="
        relative 
        overflow-hidden 
        text-white 
        py-20 
        bg-cover 
        bg-center 
        bg-no-repeat
        bg-[url('/images/d.png')]
        min-h-[510px]
        rounded-b-[80px]
      p
      "
    >
      {/* Опционально: если хотите слегка затемнить фон, раскомментируйте блок ниже */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

      <div className="container relative mx-auto px-4">
>>>>>>> 96e18c4 (Initial commit with latest updates)
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t("hero.subtitle")}
            </p>
            <div className="flex gap-4">
<<<<<<< HEAD
              <Button size="lg" variant="secondary">
                {t("hero.exploreCourses")}
              </Button>
=======
              {/* Кнопка, ведущая в WhatsApp */}
              <Button
                size="lg"
                variant="default"
                onClick={() => window.open("https://wa.me/77788819122", "_blank")}
              >
                {t("hero.exploreCourses")}
              </Button>

              {/* Кнопка Learn More */}
>>>>>>> 96e18c4 (Initial commit with latest updates)
              <Button 
                size="lg" 
                variant="outline"
                className="opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                {t("hero.learnMore")}
              </Button>
            </div>
          </div>
          <div className="relative">
<<<<<<< HEAD
            <img
              src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf"
              alt="Students studying"
              className="rounded-lg shadow-xl"
            />
=======
            {/* Вторую колонку пока оставляем пустой,
                если не нужно выводить отдельное изображение */}
>>>>>>> 96e18c4 (Initial commit with latest updates)
          </div>
        </div>
      </div>
    </div>
  );
}