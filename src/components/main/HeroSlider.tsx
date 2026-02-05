"use client";
import { useEffect, useState } from "react";
import type { SliderItem } from "@/types/slider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HeroSlider({ items }: { items: SliderItem[] }) {
  const slides = items.filter(s => s.active).sort((a, b) => a.order - b.order);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const int = setInterval(() => setIdx(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(int);
  }, [slides.length]);

  if (!slides.length) return <section className="h-screen bg-slate-900" />;

  const currentSlide = slides[idx];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id || idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Görsel Katmanı + Zoom Efekti */}
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
          />

          {/* Overlay: Modern bir doku için hafif grid veya gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />

          <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center">
            <div className="max-w-4xl">
              {/* Üst Küçük Başlık */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="h-[2px] w-12 bg-orange-500" />
                <span className="text-white font-bold uppercase tracking-[0.4em] text-xs">
                  {currentSlide.subtitle || "CBO Premium Architecture"}
                </span>
              </motion.div>

              {/* Dev Ana Başlık */}
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-[10vw] lg:text-[110px] font-black leading-[0.85] tracking-tighter uppercase italic text-white mb-8"
              >
                {currentSlide.title?.split(" ").map((word, i) => (
                  <span key={i} className={i === 0 ? "text-transparent [-webkit-text-stroke:1px_#fff]" : "block ml-[5vw] lg:ml-20"}>
                    {word}{" "}
                  </span>
                ))}
              </motion.h1>

              {/* Açıklama */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-slate-300 text-lg md:text-xl max-w-xl leading-relaxed mb-12 font-medium"
              >
                {currentSlide.description}
              </motion.p>

              {/* Aksiyon Butonları */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex flex-wrap gap-6"
              >
                <Link
                  href="/tum-projeler"
                  className="group relative px-10 py-5 bg-orange-500 overflow-hidden rounded-full transition-transform active:scale-95"
                >
                  <span className="relative z-10 text-white group-hover:text-slate-900 font-bold uppercase tracking-widest text-sm transition-colors duration-300">
                    Projeyi Keşfet
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <style jsx>{`.group:hover span { color: #0f172a; transition: color 0.3s; }`}</style>
                </Link>

                <Link
                  href="/iletisim"
                  className="px-10 py-5 border-2 border-white/30 text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white hover:text-slate-900 transition-all"
                >
                  Bize Ulaşın
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Navigasyon (Noktalar) */}
      <div className="absolute bottom-12 right-12 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`transition-all duration-500 rounded-full ${idx === i ? "w-12 bg-orange-500" : "w-3 bg-white/30"
              } h-3`}
          />
        ))}
      </div>


    </section>
  );
}