// File: app/bitmis-projeler/BitmisProjelerClient.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

type Project = {
  id: string;
  title: string;
  description?: string;
  status?: "ongoing" | "finished";
  images?: string[];
  coverImageUrl?: string;
  location?: string;
  createdAt?: Timestamp | null;
};

export default function BitmisProjelerClient() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q1 = query(
          collection(db, "projects"),
          where("status", "==", "finished"),
          orderBy("createdAt", "desc")
        );
        const snap1 = await getDocs(q1);
        const list1: Project[] = snap1.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            title: x.title,
            description: x.description,
            status: x.status,
            images: x.images || [],
            coverImageUrl: x.coverImageUrl,
            location: x.location,
            createdAt: x.createdAt ?? null,
          };
        });
        setProjects(list1);
      } catch (e) {
        try {
          const q2 = query(collection(db, "projects"), where("status", "==", "finished"));
          const snap2 = await getDocs(q2);
          const list2: Project[] = snap2.docs
            .map((d) => {
              const x = d.data() as any;
              return {
                id: d.id,
                title: x.title,
                description: x.description,
                status: x.status,
                images: x.images || [],
                coverImageUrl: x.coverImageUrl,
                location: x.location,
                createdAt: x.createdAt ?? null,
              };
            })
            .sort((a, b) => {
              const ta = a.createdAt?.toMillis?.() ?? 0;
              const tb = b.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            });
          setProjects(list2);
        } catch {
          setProjects([]);
        }
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Başlık */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
              Bitmiş Projeler
            </span>
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Kalite, güven ve zamanında teslim anlayışıyla tamamladığımız projelerimiz.
          </p>
        </header>

        {/* Loading */}
        {projects === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white shadow-md border border-slate-100 p-5 animate-pulse"
              >
                <div className="h-52 w-full rounded-xl bg-slate-200" />
                <div className="mt-4 h-6 w-4/5 bg-slate-200 rounded" />
                <div className="mt-3 h-4 w-full bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Boş Durum */}
        {projects && projects.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-14 text-center bg-slate-50">
            <svg
              className="w-20 h-20 mx-auto text-slate-400 mb-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium text-slate-700">Tamamlanmış proje henüz yok.</p>
            <p className="mt-2 text-slate-500">İlk biten proje burada gururla yerini alacak!</p>
          </div>
        )}

        {/* Projeler */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((p) => {
              const cover = (p.images && p.images[0]) || p.coverImageUrl || "/placeholder.jpg";

              return (
                <Link
                  key={p.id}
                  href={{ pathname: "/proje-detay", query: { id: p.id } }}
                  className="
                    group block focus:outline-none
                    rounded-2xl bg-white shadow-lg border border-slate-100
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-2xl
                    overflow-hidden
                  "
                >
                  {/* Görsel */}
                  <div className="relative h-56 w-full">
                    <Image
                      src={cover}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span
                      className="
                        absolute bottom-3 left-3 text-xs px-3 py-1.5
                        rounded-full bg-emerald-100 text-emerald-800
                        border border-emerald-300 font-bold
                      "
                    >
                      Tamamlandı
                    </span>
                  </div>

                  {/* İçerik */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition">
                      {p.title}
                    </h3>

                    {p.location && (
                      <p className="mt-2 text-sm text-slate-600 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {p.location}
                      </p>
                    )}

                    {p.description && (
                      <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6">
                    <span
                      className="
                        inline-flex items-center text-sm font-semibold text-slate-600
                        opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                        transition-all duration-300
                      "
                    >
                      Projeyi İncele
                      <svg
                        className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}