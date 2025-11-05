// File: app/components/ServicesSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

function excerpt(text: string, n = 110) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceDoc[] | null>(null);

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

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık + alt açıklama */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Hizmetlerimiz
            </span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            İhtiyacınıza özel, modern ve uzun ömürlü çözümler. Mimari
            tasarımdan uygulamaya tüm süreçleri tek çatı altında yönetiyor,
            konfor ve estetiği bir araya getiriyoruz.
          </p>
        </div>

        {/* Loading */}
        {services === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-4 animate-pulse shadow-md"
              >
                <div className="h-44 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {services?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Henüz hizmet eklenmemiş.
          </div>
        )}

        {/* Grid */}
        {services && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
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
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-gray-900 font-semibold text-lg">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {excerpt(s.description)}
                  </p>
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

        {/* Alt kısım: Tümünü Gör butonu */}
        <div className="mt-10 text-center">
          <Link
            href="/tum-hizmetler"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold
              bg-[#155dfc] text-white hover:brightness-110 active:scale-[0.98]
              transition transform
              shadow-md hover:shadow-lg
            "
          >
            Tüm Hizmetler
          </Link>
        </div>
      </div>
    </section>
  );
}
