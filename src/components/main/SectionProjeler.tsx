"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

type Project = {
  id: string;
  name?: string;
  images?: string[];
  coverUrl?: string;
};

function pickCover(p: Project) {
  return (p.images && p.images[0]) || p.coverUrl || "/placeholder.jpg";
}

export default function SectionProjeler() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
        setProjects(list);
      } catch (e) {
        console.error(e);
        setProjects([]);
      }
    })();
  }, []);

  if (!projects) return <div className="py-20 text-center font-bold uppercase">Yükleniyor...</div>;

  return (
    <section className="bg-white py-24">
      <div className="w-full">
        {/* Başlık - Sağ Tarafta */}
        <div className="max-w-[1400px] mx-auto px-6 mb-16">
          <div className="flex justify-end">
            <div className="text-right">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
                Projeler
              </h2>
              <div className="mt-4 h-2 w-24 bg-orange-500 ml-auto" />
            </div>
          </div>
        </div>


        {/* Asimetrik Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 auto-rows-[300px] md:auto-rows-[420px]">
          {projects.map((project, index) => {
            // Grid Mantığı: 
            // 0. Proje: Sol Geniş (8 sütun)
            // 1. Proje: Sağ Dar (4 sütun)
            // 2. Proje: Sol Dar (4 sütun)
            // 3. Proje: Sağ Geniş (8 sütun)
            const gridClasses = [
              "md:col-span-8", // 1. Proje
              "md:col-span-4", // 2. Proje
              "md:col-span-4", // 3. Proje
              "md:col-span-8", // 4. Proje
            ];

            return (
              <ProjectCard
                key={project.id}
                project={project}
                className={gridClasses[index % 4]}
              />
            );
          })}
        </div>

        {/* Alt Link */}
        <div className="mt-20 text-center">
          <Link
            href="/tum-projeler"
            className="text-black group relative inline-flex items-center gap-3 text-lg font-bold uppercase tracking-tighter"
          >
            <span>Tüm Projeleri Keşfet</span>
            <div className="w-12 h-[2px] bg-slate-900 group-hover:w-20 transition-all duration-300"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, className }: { project: Project; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group overflow-hidden bg-slate-100 cursor-pointer ${className}`}
    >
      <Link href={{ pathname: "/proje-detay", query: { id: project.id } }}>
        {/* Görsel Katmanı */}
        <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
          <Image
            src={pickCover(project)}
            alt={project.name || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Overlay (Hover'da kararma) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />
        </div>

        {/* Hover'da Çıkan İçerik */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center px-4">
            <h4 className="text-white text-2xl font-bold uppercase tracking-tight mb-4">
              {project.name}
            </h4>
            <span className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-slate-200 transition-colors inline-block">
              Detaylı Gör
            </span>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}