"use client";
import { useEffect, useState } from "react";
import type { SliderItem } from "@/types/slider";

export default function HeroSlider({ items }: { items: SliderItem[] }) {
  const slides = items.filter(s => s.active).sort((a, b) => a.order - b.order);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const int = setInterval(() => setIdx(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(int);
  }, [slides.length]);

  if (!slides.length) {
    return <section className="h-screen bg-slate-200" />;
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((s, i) => {
        const words = s.title?.split(" ") || [];
        const firstWord = words[0] || "";
        const rest = words.slice(1).join(" ");
        return (
          <div
            key={s.id || i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${s.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-left">
              {/* Başlıklar ve açıklama */}
              <div
                className={`transition-all duration-1000 ${
                  i === idx ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <h1 className="text-white text-5xl md:text-6xl font-extrabold drop-shadow mb-6">
                  <span className="text-slate-500">{firstWord}</span>{" "}
                  {rest}
                </h1>
                <h2 className="text-white/90 text-2xl md:text-3xl font-semibold mb-6">
                  {s.subtitle}
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mb-10">
                  {s.description}
                </p>

                {/* Projeler butonu */}
                <a
                  href="/tum-projeler"
                  className={`inline-block bg-slate-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg 
                  hover:bg-slate-700 hover:shadow-slate-500/50 transform hover:scale-105 transition-all duration-500 ${
                    i === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                >
                  Projeler
                </a>
              </div>
            </div>
          </div>
        );
      })}

      {/* Alt geçiş efektleri için küçük gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </section>
  );
}