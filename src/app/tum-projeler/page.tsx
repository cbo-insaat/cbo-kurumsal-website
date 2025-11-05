// File: app/tum-projeler/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
        const list: Project[] = snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            name: x.name,
            description: x.description,
            status: x.status,
            images: x.images || [],
            coverUrl: x.coverUrl,
            location: x.location,
            createdAt: x.createdAt ?? null,
          };
        });
        setProjects(list);
      } catch (e) {
        console.error(e);
        setProjects([]);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Tüm Projeler
            </span>
          </h1>
          <p className="mt-2 text-gray-600">Tüm proje portföyümüzden seçimler.</p>
        </header>

        {/* Loading */}
        {projects === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                <div className="h-40 w-full rounded-lg bg-gray-200" />
                <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {projects && projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Proje bulunmuyor.
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const cover = (p.images && p.images[0]) || p.coverUrl || "/placeholder.jpg";
              return (
                <Link
                  key={p.id}
                  href={{ pathname: "/proje-detay", query: { id: p.id } }}
                  className="rounded-2xl bg-white border border-gray-100 shadow hover:shadow-md transition block"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={cover}
                      alt={p.name || "Proje görseli"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      {p.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            p.status === "ongoing"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {p.status === "ongoing" ? "Devam Eden" : "Bitmiş"}
                        </span>
                      )}
                    </div>
                    {p.location && (
                      <p className="mt-1 text-xs text-gray-500">{p.location}</p>
                    )}
                    {p.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{p.description}</p>
                    )}
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
