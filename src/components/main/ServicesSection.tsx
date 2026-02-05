// File: app/components/ServicesSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

type ServiceDoc = {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  createdAt?: Timestamp | null;
};

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceDoc[] | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "services"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const snap = await getDocs(q);
        const list: ServiceDoc[] = snap.docs.map((d) => {
          const data = d.data() as Omit<ServiceDoc, "id">;
          return {
            id: d.id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            imageUrl: data.imageUrl,
            createdAt: (data as any).createdAt ?? null,
          };
        });
        setServices(list);
      } catch (e) {
        console.error(e);
        setServices([]);
      }
    })();
  }, []);

  if (services === null) return <div className="h-[70vh] flex items-center justify-center">Yükleniyor...</div>;
  if (services.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white py-24">
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
          Hizmetlerimiz
        </h2>
         <div className="mt-4 h-2 w-24 bg-orange-500" />
      </div>

      {/* Container: Negatif margin verilerek 45 derecelik açının 
          ekranın sol ve sağından dışarı taşması (whitespace) engellenir.
      */}
      <div className="flex w-[120%] -ml-[10%] h-[60vh] md:h-[75vh] items-stretch justify-center overflow-hidden">
        {services.map((s, index) => (
          <motion.div
            key={s.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{
              // Hover olduğunda açı düzelir (0deg), normalde 45deg (skewX -45)
              skewX: hoveredIndex === index ? 0 : -45,
              width: hoveredIndex === index ? "40%" : "15%",
              zIndex: hoveredIndex === index ? 10 : 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.23, 1, 0.32, 1] // Custom cubic-bezier for smooth motion
            }}
            className="relative h-full overflow-hidden border-l-4 border-white cursor-pointer group shadow-[0_0_30px_rgba(0,0,0,0.1)]"
          >
            {/* Inner Content: Dıştaki Skew etkisini sıfırlamak için 
                içeride ters yöne skew uyguluyoruz. 
                Açılıyken 45deg, hover iken 0deg.
            */}
            <motion.div
              className="relative w-full h-full"
              animate={{
                skewX: hoveredIndex === index ? 0 : 45,
                scale: hoveredIndex === index ? 1.1 : 1.6,
              }}
              transition={{ 
                duration: 0.8, // Uzaklaşma hissi için süreyi biraz artırdık
                ease: [0.23, 1, 0.32, 1] 
              }}
            >
              <Image
                src={s.imageUrl || "/placeholder.jpg"}
                alt={s.name}
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />

              {/* Overlay: Hover değilken daha koyu, hover iken açılır */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredIndex === index ? 'bg-black/40' : 'bg-black/60'}`} />

              {/* Yazı İçeriği */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white overflow-hidden">
                <motion.div
                  animate={{
                    rotate: hoveredIndex === index ? 0 : 0,
                    y: hoveredIndex === index ? 0 : 20
                  }}
                  className="flex flex-col items-center"
                >
                  <h3 className={`font-black uppercase tracking-tighter transition-all duration-500 ${hoveredIndex === index ? 'text-4xl md:text-6xl mb-6' : 'text-xl md:text-2xl opacity-70'}`}>
                    {s.name}
                  </h3>

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center mt-10"
                      >
                  
                        <Link
                          href={{ pathname: "/hizmet-detay", query: { id: s.id } }}
                          className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-slate-200 transition-colors inline-block"
                        >
                          Detaya Git
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link
          href="/tum-hizmetler"
          className="text-black group relative inline-flex items-center gap-3 text-lg font-bold uppercase tracking-tighter"
        >
          <span>Tüm Hizmetleri Keşfet</span>
          <div className="w-12 h-[2px] bg-slate-900 group-hover:w-20 transition-all duration-300"></div>
        </Link>
      </div>
    </section>
  );
}