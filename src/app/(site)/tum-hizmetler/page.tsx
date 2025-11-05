"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
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

function excerpt(text: string, n = 140) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

export default function AllServicesPage() {
  const [services, setServices] = useState<ServiceDoc[] | null>(null);
  const [qText, setQText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const qy = query(collection(db, "services"), orderBy("createdAt", "desc"));
        const snap = await getDocs(qy);
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

  const filtered = useMemo(() => {
    if (!services) return null;
    const q = qText.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
    );
  }, [services, qText]);

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Tüm Hizmetler
            </span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
            Mimari tasarımdan anahtar teslim uygulamaya kadar; modern, güvenli ve uzun ömürlü çözümler.
            Aşağıdan tüm hizmetlerimizi inceleyebilir, detay sayfalarında ilgili projeleri görebilirsiniz.
          </p>
        </div>

        {/* Arama / Sayaç */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          <div className="relative w-full md:max-w-md">
            <input
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Hizmetlerde ara…"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {filtered && (
            <span className="text-sm text-gray-500">
              Toplam: <b>{filtered.length}</b> hizmet
            </span>
          )}
        </div>

        {/* Loading */}
        {services === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 animate-pulse shadow-md border border-gray-100">
                <div className="h-48 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {services && filtered && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Sonuca uygun hizmet bulunamadı.
          </div>
        )}

        {/* Grid */}
        {filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <Link
                key={s.id}
                href={{ pathname: "/hizmet-detay", query: { id: s.id } }}
                className="
                  group block focus:outline-none
                  rounded-2xl bg-white shadow-lg border border-gray-100
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                "
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={s.imageUrl || "/placeholder.jpg"}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-semibold text-lg">{s.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{excerpt(s.description)}</p>
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
            ))}
          </div>
        )}

     
      </div>
    </main>
  );
}
