"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, query, where, getCountFromServer } from "firebase/firestore";

export default function SectionHeroIntro() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "projects"),
          where("status", "==", "finished")
        );
        const snapshot = await getCountFromServer(q);
        setProjectCount(snapshot.data().count || 0);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center pt-20">
      {/* Background grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg stroke='%23000' stroke-width='1'%3E%3Cpath d='M30 0 v60M0 30 h60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          {/* SOL */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-12 bg-orange-500" />
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                  Mimari & Mühendislik
                </span>
              </div>

              {/* BAŞLIK */}
              <h1 className="text-[12vw] lg:text-[100px] font-black leading-[0.85] tracking-tighter uppercase italic">
                <span className="text-slate-900">Sınırları</span>
                <br />
                <span
                  className="
                    ml-[5vw] lg:ml-24
                    text-white
                    drop-shadow-[4px_4px_0_#0f172a]
                    [-webkit-text-stroke:2px_#0f172a]
                  "
                >
                  Zorluyoruz
                </span>
              </h1>

              <div className="mt-12 grid md:grid-cols-2 gap-12 items-start">
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  CBO İnşaat, 25 yıllık mirasını modern teknolojiyle
                  birleştirerek şehrin silüetini yeniden tanımlıyor. Biz sadece
                  bina değil, yaşayan heykeller inşa ediyoruz.
                </p>

                <div className="flex flex-col gap-2">
                  <div className="text-7xl font-black text-slate-900 italic leading-none">
                    {projectCount}+
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-orange-500">
                    Tamamlanan Proje
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* SAĞ */}
          <div className="lg:col-span-4 pb-4">
            <div className="flex flex-col gap-4">
              {/* PORTFÖY */}
              <Link
                href="/tum-projeler"
                className="group relative h-20 flex items-center justify-center bg-slate-900 overflow-hidden rounded-full"
              >
                <span className="relative z-10 text-white font-bold uppercase tracking-widest transition-transform group-hover:scale-110">
                  Portfolyoyu Keşfet
                </span>
                <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              {/* BİZE ULAŞIN – OKUNURLUK FIX */}
              <Link
                href="/iletisim"
                className="
                  h-20 flex items-center justify-center
                  rounded-full font-bold uppercase tracking-widest
                  bg-white text-slate-900
                  border-2 border-slate-900
                  hover:bg-slate-900 hover:text-white
                  transition-all duration-300
                "
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>

        {/* ALT GÖRSELLER */}
        <div className="mt-20 grid grid-cols-12 gap-4 h-[400px] md:h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="col-span-12 md:col-span-7 relative overflow-hidden rounded-t-[4rem] md:rounded-tr-none md:rounded-l-[4rem]"
          >
            <Image
              src="/intro/intro.jpg"
              alt="CBO Project"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block md:col-span-5 relative overflow-hidden rounded-r-[4rem] bg-slate-900"
          >
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <span className="text-6xl font-black text-white italic opacity-20 leading-none">
                ESTETİK
              </span>
              <span className="text-6xl font-black text-white italic opacity-40 leading-none">
                GÜVEN
              </span>
              <span className="text-6xl font-black text-white italic leading-none">
                GELECEK
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DÖNEN ROZET */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -right-16 top-1/2 -translate-y-1/2 hidden xl:flex w-48 h-48 items-center justify-center border border-slate-200 rounded-full"
      >
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[5px] text-center">
          CBO INSAAT • 2024 • PREMIUM SOLUTIONS •
        </div>
      </motion.div>
    </section>
  );
}
