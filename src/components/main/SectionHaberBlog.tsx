// File: app/components/SectionHaberBlog.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

type PostDoc = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: "draft" | "published";
  category?: string;
  tags?: string[];
  coverUrl?: string;
  images?: string[];
  createdAt?: Timestamp | null;
};

function excerpt(text: string | undefined, n = 110) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

function toMillis(ts?: Timestamp | null): number {
  try {
    if (!ts) return 0;
    // Firestore Timestamp
    // @ts-ignore
    if (typeof ts.toMillis === "function") return ts.toMillis();
    // String date fallback
    // @ts-ignore
    if (typeof ts === "string") return new Date(ts as any).getTime() || 0;
    return 0;
  } catch {
    return 0;
  }
}

export default function SectionHaberBlog() {
  const [posts, setPosts] = useState<PostDoc[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1) published + createdAt desc
        const q1 = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const snap1 = await getDocs(q1);
        const list1: PostDoc[] = snap1.docs.map((d) => {
          const x = d.data() as Omit<PostDoc, "id">;
          return {
            id: d.id,
            title: x.title,
            excerpt: x.excerpt,
            content: x.content,
            status: x.status,
            category: x.category,
            tags: x.tags || [],
            coverUrl: x.coverUrl,
            images: x.images || [],
            createdAt: (x as any).createdAt ?? null,
          };
        });
        setPosts(list1);
      } catch (e) {
        console.warn("Index olabilir, fallback’e geçiliyor…", e);
        try {
          // 2) Fallback: orderBy olmadan çek -> client-side sort
          const q2 = query(
            collection(db, "posts"),
            where("status", "==", "published"),
            limit(12)
          );
          const snap2 = await getDocs(q2);
          let list2: PostDoc[] = snap2.docs.map((d) => {
            const x = d.data() as Omit<PostDoc, "id">;
            return {
              id: d.id,
              title: x.title,
              excerpt: x.excerpt,
              content: x.content,
              status: x.status,
              category: x.category,
              tags: x.tags || [],
              coverUrl: x.coverUrl,
              images: x.images || [],
              createdAt: (x as any).createdAt ?? null,
            };
          });

          list2 = list2
            .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
            .slice(0, 6);

          setPosts(list2);
        } catch (e2) {
          console.error(e2);
          setPosts([]);
        }
      }
    })();
  }, []);

  // ---- Animasyon varyantları ----
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };
  // --------------------------------

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
              Haber &amp; Blog
            </span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            İnşaat dünyasından güncel haberler, ipuçları ve uzman içerikler.
          </p>
        </div>

        {/* Loading skeleton */}
        {posts === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 animate-pulse shadow-md border border-gray-100">
                <div className="h-44 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {posts?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Henüz yayınlanmış içerik yok.
          </div>
        )}

        {/* Grid + Animasyon */}
        {posts && posts.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((p) => {
              const cover = p.coverUrl || p.images?.[0] || "/placeholder.jpg";
              const dt = p.createdAt?.toDate ? p.createdAt.toDate() : null;
              const dateStr = dt
                ? dt.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
                : "";

              return (
                <motion.div key={p.id} variants={item}>
                  <Link
                    href={{ pathname: "/haber-blog-detay", query: { id: p.id } }}
                    className="
                      group block focus:outline-none
                      rounded-2xl bg-white shadow-lg border border-gray-100
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                      overflow-hidden
                    "
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={cover}
                        alt={p.title || "Blog kapak görseli"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      {p.category && (
                        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full border bg-white/90 text-gray-800 border-gray-200">
                          {p.category}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-gray-900 font-semibold text-lg line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {excerpt(p.excerpt || p.content)}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>{dateStr}</span>
                        {p.tags && p.tags.length > 0 && (
                          <span className="truncate max-w-[60%]">
                            {p.tags.slice(0, 2).join(" · ")}
                            {p.tags.length > 2 ? " +" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <span
                        className="
                          inline-flex items-center text-sm font-medium text-slate-600
                          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-300
                        "
                      >
                        Devamını Oku
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
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Alt kısım: Tümünü Gör butonu */}
        <div className="mt-10 text-center">
          <Link
            href="/tum-haberler"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold
              bg-slate-600 text-white hover:bg-slate-700 active:scale-[0.98]
              transition transform hover:scale-105 shadow-md hover:shadow-lg
            "
          >
            Tüm Yazılar
          </Link>
        </div>
      </div>
    </section>
  );
}
