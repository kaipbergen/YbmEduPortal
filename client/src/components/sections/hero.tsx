import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div
      className="
        relative 
        overflow-hidden 
        text-white 
        py-20 
        bg-cover 
        bg-center 
        bg-no-repeat
        bg-[url('/images/hero.png')]
        min-h-[510px]
        rounded-b-[80px]
      p
      "
    >
      {/* Опционально: если хотите слегка затемнить фон, раскомментируйте блок ниже */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

      <div className="container relative mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t("hero.subtitle")}
            </p>
            <div className="flex gap-4">
              {/* Кнопка, ведущая в WhatsApp */}
              <Button
                size="lg"
                variant="default"
                onClick={() => window.open("https://wa.me/77788819122", "_blank")}
              >
                {t("hero.exploreCourses")}
              </Button>

              {/* Кнопка Learn More */}
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
            {/* Вторую колонку пока оставляем пустой,
                если не нужно выводить отдельное изображение */}
          </div>
        </div>
      </div>
    </div>
  );
}