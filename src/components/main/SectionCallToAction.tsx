"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SectionCallToAction() {
  return (
    <section className="relative bg-slate-900 py-32 overflow-hidden">
      {/* Arka Plan Dekoratif Elementleri */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[1px] bg-white rotate-45" />
        <div className="absolute bottom-[20%] right-[-5%] w-[50%] h-[1px] bg-orange-500 -rotate-12" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* SOL: Dev Metin */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-orange-500 font-bold uppercase tracking-[0.5em] text-sm mb-6 block">
                Bir Sonraki Adım
              </span>
              <h2 className="text-[10vw] lg:text-[100px] font-black leading-[0.85] tracking-tighter uppercase italic text-white">
                Hayallerinizi <br />
                <span className="text-transparent [-webkit-text-stroke:1px_#fff] opacity-50">
                  İnşa Edelim
                </span>
              </h2>
            </motion.div>
          </div>

          {/* SAĞ: Aksiyon Kartı */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[2rem] flex flex-col gap-8 shadow-2xl"
            >
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                Uzman ekibimizle birlikte hayalinizdeki yapıyı gerçeğe dönüştürün. Ücretsiz keşif ve teklif için hemen başlayın.
              </p>

              <div className="flex flex-col gap-4">
                <Link
                  href="/teklif-al"
                  className="group relative h-16 flex items-center justify-center bg-orange-500 overflow-hidden rounded-full"
                >
                  <span className="relative z-10 text-white font-bold uppercase tracking-widest transition-transform group-hover:scale-105">
                    Ücretsiz Teklif Al
                  </span>
                  <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>

                <Link
                  href="/iletisim"
                  className="h-16 flex items-center justify-center rounded-full font-bold uppercase tracking-widest border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  İletişime Geç
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

 
      </div>
    </section>
  );
}