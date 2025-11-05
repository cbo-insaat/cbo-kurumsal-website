"use client";
import { useEffect, useState } from "react";
import type { SliderItem } from "@/types/slider";

export default function HeroSlider({ items }: { items: SliderItem[] }) {
  const slides = items.filter(s => s.active).sort((a,b) => a.order - b.order);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const int = setInterval(() => setIdx(p => (p + 1) % slides.length), 3000);
    return () => clearInterval(int);
  }, [slides.length]);

  if (!slides.length) {
    return <section className="h-screen bg-slate-200" />;
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={s.id || i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${s.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <h1 className="text-white text-5xl md:text-6xl font-extrabold drop-shadow mb-3">
              {s.title}
            </h1>
            <h2 className="text-white/90 text-2xl md:text-3xl font-semibold mb-4">
              {s.subtitle}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl">{s.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
