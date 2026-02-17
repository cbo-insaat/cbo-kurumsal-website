"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

type Project = {
  id: string;
  name: string;
  description?: string;
  status?: "ongoing" | "completed";
  images?: string[];
  coverUrl?: string;
  location?: string;
  createdAt?: Timestamp | null;
};

export default function TumProjelerPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list: Project[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setProjects(list);
      } catch (e) {
        console.error(e);
        setProjects([]);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-3xl">
      
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[10vw] md:text-[100px] font-black text-black leading-[0.85] tracking-tighter uppercase italic"
            >
              İMZA <br /> 
              <span className="text-transparent [-webkit-text-stroke:1px_#0f172a]">PROJELER</span>
            </motion.h1>
          </div>
          
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-slate-500 font-medium text-right max-w-xs leading-relaxed"
          >
            Estetik, dayanıklılık ve modern mimarinin buluştuğu yaşam alanları.
          </motion.p>
        </div>

        {/* PROJECTS ASYMMETRIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <AnimatePresence>
            {projects?.map((p, idx) => {
              // Asimetrik dizilim mantığı: 
              // 0, 3, 4, 7... nolu kartlar geniş (col-span-8)
              // 1, 2, 5, 6... nolu kartlar dar (col-span-4)
              const isWide = [0, 3, 4, 7, 8, 11].includes(idx);
              
              return (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  index={idx} 
                  isWide={isWide} 
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* LOADING STATE */}
        {projects === null && (
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8 h-[500px] bg-slate-50 animate-pulse rounded-[3rem]" />
            <div className="col-span-4 h-[500px] bg-slate-50 animate-pulse rounded-[3rem]" />
          </div>
        )}
      </div>
    </main>
  );
}

function ProjectCard({ project, index, isWide }: { project: Project; index: number; isWide: boolean }) {
  const cover = (project.images && project.images[0]) || project.coverUrl || "/placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
      className={`${isWide ? "md:col-span-8" : "md:col-span-4"} group relative`}
    >
      <Link href={{ pathname: "/proje-detay", query: { id: project.id } }}>
        <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden  bg-slate-100">
          
          {/* Status Badge */}
          <div className="absolute top-6 left-6 z-20">
            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
              project.status === "ongoing" 
                ? "bg-orange-500/80 text-white border-orange-400" 
                : "bg-white/80 text-slate-900 border-white"
            }`}>
              {project.status === "ongoing" ? "İnşaat Devam Ediyor" : "Tamamlandı"}
            </span>
          </div>

          {/* Image */}
          <Image
            src={cover}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-1000 scale-105 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Content Over Image */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <div className="overflow-hidden">
               <motion.span className="text-orange-500 font-bold uppercase tracking-widest text-[10px] block mb-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                 {project.location || "Türkiye"}
               </motion.span>
               <h3 className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                 {project.name}
               </h3>
               <div className="h-1 w-0 group-hover:w-full bg-white transition-all duration-700" />
            </div>
          </div>

          {/* Hover View Button - Center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                <span className="text-slate-900 font-black text-[10px] uppercase tracking-tighter text-center leading-none">
                  Projeyi <br /> İncele
                </span>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}