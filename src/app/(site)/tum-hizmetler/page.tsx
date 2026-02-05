"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

type ServiceDoc = {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  createdAt?: Timestamp | null;
};

export default function AllServicesPage() {
  const [services, setServices] = useState<ServiceDoc[] | null>(null);
  const [qText, setQText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const qy = query(collection(db, "services"), orderBy("createdAt", "desc"));
        const snap = await getDocs(qy);
        const list: ServiceDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ServiceDoc, "id">),
        }));
        setServices(list);
      } catch (e) {
        console.error(e);
        setServices([]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!services) return null;
    const q = qText.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [services, qText]);

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER: Dev Tipografi ve Arama */}
        <div className="relative mb-24">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[12vw] md:text-[120px] font-black leading-none uppercase tracking-tighter text-slate-900 italic"
          >
            UZMANLIK <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a] opacity-40">ALANLARI</span>
          </motion.h1>

          <div className="mt-12 flex flex-col md:flex-row items-end justify-between gap-8">
            <p className="max-w-xl text-slate-500 text-lg font-medium leading-relaxed">
              CBO Yapı olarak, geleneksel yöntemleri modern mühendislik vizyonuyla harmanlıyoruz. 
              İşte geleceği inşa ettiğimiz temel disiplinlerimiz.
            </p>
            
            {/* Minimalist Arama Barı */}
            <div className="relative w-full md:w-80 group">
              <input
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Hizmetlerde ara..."
                className="text-black w-full bg-transparent border-b-2 border-slate-200 py-4 outline-none focus:border-orange-500 transition-colors font-bold uppercase tracking-widest text-xs"
              />
              <div className="absolute right-0 bottom-4 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICES GRID: Listeleme */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered?.map((s, idx) => (
              <ServiceRow key={s.id} service={s} index={idx} />
            ))}
          </AnimatePresence>

          {/* Boş Sonuç */}
          {filtered && filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]"
            >
              <span className="text-4xl font-black text-slate-200 uppercase italic">Sonuç Bulunamadı</span>
            </motion.div>
          )}

          {/* Loading State */}
          {!services && (
             <div className="space-y-4">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="h-40 w-full bg-slate-50 animate-pulse rounded-3xl" />
               ))}
             </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ServiceRow({ service, index }: { service: ServiceDoc; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link 
        href={{ pathname: "/hizmet-detay", query: { id: service.id } }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 bg-slate-50 hover:bg-slate-900 transition-colors duration-500 rounded-[2rem] md:rounded-[4rem] overflow-hidden"
      >


        {/* Görsel Alanı */}
        <div className="relative w-full md:w-72 h-48 md:h-48 overflow-hidden rounded-[2rem] shrink-0">
          <Image
            src={service.imageUrl || "/placeholder.jpg"}
            alt={service.name}
            fill
            className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110 grayscale-0' : 'scale-100 grayscale'}`}
          />
          <div className="absolute inset-0 bg-orange-500/10 group-hover:bg-transparent transition-colors" />
        </div>

        {/* Metin İçeriği */}
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-[2px] bg-orange-500 transition-all duration-500 ${isHovered ? 'w-12' : 'w-0'}`} />
            <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs">
              Premium Service
            </span>
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-white transition-colors mb-4">
            {service.name}
          </h3>
          
          <p className="text-slate-500 group-hover:text-slate-400 transition-colors max-w-2xl line-clamp-2 font-medium">
            {service.description}
          </p>
        </div>

        {/* Ok Butonu */}
        <div className={`hidden lg:flex w-20 h-20 items-center justify-center rounded-full border-2 transition-all duration-500 
          ${isHovered ? 'bg-orange-500 border-orange-500 rotate-45' : 'border-slate-200'}`}>
          <svg 
            className={`w-8 h-8 transition-colors ${isHovered ? 'text-white' : 'text-slate-300'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}