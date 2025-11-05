// File: app/components/SectionProjeler.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

type Project = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  status?: "ongoing" | "completed";
  images?: string[];
  coverUrl?: string;
  location?: string;
};

function excerpt(text: string, n = 110) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

export default function SectionProjeler() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list: Project[] = snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            name: x.name || x.title,
            title: x.title,
            description: x.description,
            status: x.status,
            images: x.images || [],
            coverUrl: x.coverUrl,
            location: x.location,
          };
        });

        // Rastgele 4 proje seç
        const shuffled = list.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProjects(shuffled);
      } catch (e) {
        console.error(e);
        setProjects([]);
      }
    })();
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık + alt açıklama (ServicesSection stili) */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Projelerimiz
            </span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Son çalışmalarımızdan seçtiklerimiz. Tasarımdan uygulamaya, kalite ve estetiği bir araya getirdiğimiz projeler.
          </p>
        </div>

        {/* Loading skeleton */}
        {projects === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-4 animate-pulse shadow-md border border-gray-100"
              >
                <div className="h-48 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {projects?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Henüz proje eklenmemiş.
          </div>
        )}

        {/* Grid (ServicesSection kart stili) */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p) => {
              const title = p.name || p.title || "Proje";
              const cover = (p.images && p.images[0]) || p.coverUrl || "/placeholder.jpg";

              return (
                <Link
                  key={p.id}
                  href={{ pathname: "/proje-detay", query: { id: p.id } }}
                  className="
                    group block focus:outline-none
                    rounded-2xl bg-white shadow-lg border border-gray-100
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                  "
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={cover}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-gray-900 font-semibold text-lg line-clamp-1">
                      {title}
                    </h3>

                    <div className="mt-1 flex items-center justify-between">
                      {p.location ? (
                        <p className="text-xs text-gray-500 line-clamp-1">{p.location}</p>
                      ) : <span />}
                      {p.status && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border ${
                            p.status === "ongoing"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {p.status === "ongoing" ? "Devam Eden" : "Bitmiş"}
                        </span>
                      )}
                    </div>

                    {p.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {excerpt(p.description)}
                      </p>
                    )}
                  </div>

                  <div className="px-4 pb-4">
                    <span
                      className="
                        inline-flex items-center text-sm font-medium text-[#155dfc]
                        opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300
                      "
                    >
                      Detaya Git
                      <svg
                        className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Alt kısım: Tümünü Gör butonu (ServicesSection ile uyumlu) */}
        <div className="mt-10 text-center">
          <Link
            href="/tum-projeler"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold
              bg-[#155dfc] text-white hover:brightness-110 active:scale-[0.98]
              transition transform
              shadow-md hover:shadow-lg
            "
          >
            Tüm Projeler
          </Link>
        </div>
      </div>
    </section>
  );
}
