import React from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Review {
  name: string;
  course: string;
  rating: number;
  text: string;
  avatarUrl?: string;
}

export default function SuccessStories() {
  const { t } = useTranslation();

  // Example reviews (replace with real data)
  const reviews: Review[] = [
    {
      name: "Алимхан",
      course: "SAT + IELTS",
      rating: 5,
      text: "Моей целью было получить 1400+ по SAT, чего я достиг с преподавателем Аршатом, получив 1450. По IELTS целью было 8, но получил 7.5, но все же я очень доволен результатами😊",
      avatarUrl: "/images/avatar.men1.jpg"
    },
    {
      name: "Дильназ",
      course: "SAT(Math)",
      rating: 5,
      text: "Благодарю Аршата за математику с 550 до 710(на практисах 740) это сильно🙏🏾",
      avatarUrl: "/images/sticker2.webp"
    },
    {
      name: "Нурай",
      course: "SAT",
      rating: 5,
      text: "Благодарна за труд преподавателя, все очень понятно и интересно объясняет, если сравнить с начальной точки то прогресс точно есть😌, поступила на фаунд в NU!",
      avatarUrl: "/images/sticker3.webp"
    },
    {
      name: "Алишер",
      course: "IELTS",
      rating: 5,
      text: "Спасибо Адине за проведенные уроки! Все было круто и смог получить заветные 7.5👏",
      avatarUrl: "/images/ava.men2.jpg"
    },
    {
      name: "Дарья",
      course: "General English + IELTS",
      rating: 5,
      text: "Мой изначальный уровень английского был не так высок, однако с преподавателями из YBM мы сперва повысили уровень до Intermediate и затем начали готовиться к IELTS, за 2 месяца подготовки я смогла получить 7.0!",
      avatarUrl: "/images/ava.girl2.jpg"
    },
    {
      name: "Димаш",
      course: "SAT + IELTS",
      rating: 5,
      text: "Хочу отметить интересные уроки, а также индивидуальный подход и много практисов😅, думаю именно поэтому и достиг таких результатов",
      avatarUrl: "/images/avatar.png"
    },
    {
      name: "Адильжан",
      course: "SAT",
      rating: 5,
      text: "Очень благодарен за уделенное время и труд преподавателю! С изначальных 1270 поднял свой балл до 1480!😁",
      avatarUrl: "/images/sticker1.webp"
    },
    {
      name: "Адия",
      course: "General English",
      rating: 5,
      text: "Спасибо Адине за урокиии подняла свой уровень до Upper-Intermediate, занятия были очень интересными и чувствовалась поддержка и отдача😇",
      avatarUrl: "/images/sticker4.webp"
    },
    {
      name: "Диана",
      course: "IELTS + SAT",
      rating: 5,
      text: "Благодаря стараниям Адины и Аршата смогла получить 7.0 и 1440, благодаря этому поступила в Nazarbayev University сразу на 1 курс👏🏻",
      avatarUrl: "/images/sticker.webp"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("successStories.title")}
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          navigation={{
            nextEl: ".success-next",
            prevEl: ".success-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatarUrl || "/images/default-avatar.png"}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-semibold">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.course}</p>
                    <div className="flex mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">{review.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Single container for arrows + pagination in one row */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {/* Previous Button */}
          <button className="success-prev w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
            {/* Left Arrow SVG */}
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* Pagination dots in the center */}
          <div
            className="swiper-pagination"
            style={{ position: "static" }}
          />

          {/* Next Button */}
          <button className="success-next w-10 h-10 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
            {/* Right Arrow SVG */}
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}