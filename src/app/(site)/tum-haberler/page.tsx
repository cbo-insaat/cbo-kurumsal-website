// File: app/haberler-blog/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

type Post = {
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

function toMillis(ts?: Timestamp | null): number {
  try {
    if (!ts) return 0;
    // @ts-ignore
    if (typeof ts.toMillis === "function") return ts.toMillis();
    return 0;
  } catch {
    return 0;
  }
}
function excerpt(text?: string, n = 120) {
  const t = (text || "").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

export default function HaberlerBlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        // Tercih edilen sorgu (index varsa):
        const q1 = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(60)
        );
        const s1 = await getDocs(q1);
        const list1: Post[] = s1.docs.map((d) => {
          const x = d.data() as Omit<Post, "id">;
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
        // Fallback: orderBy olmadan çek, client-side sırala
        try {
          const q2 = query(
            collection(db, "posts"),
            where("status", "==", "published"),
            limit(120)
          );
          const s2 = await getDocs(q2);
          const list2: Post[] = s2.docs.map((d) => {
            const x = d.data() as Omit<Post, "id">;
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
          setPosts(
            list2.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)).slice(0, 60)
          );
        } catch (e2) {
          console.error(e2);
          setPosts([]);
        }
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (posts || []).forEach((p) => p.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (posts || []).filter((p) => {
      const inCat = cat === "all" || p.category === cat;
      if (!q) return inCat;
      const hay =
        (p.title || "") +
        " " +
        (p.excerpt || "") +
        " " +
        (p.content || "") +
        " " +
        (p.tags || []).join(" ");
      return inCat && hay.toLowerCase().includes(q);
    });
  }, [posts, search, cat]);

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Başlık */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Tüm Haber &amp; Bloglar
            </span>
          </h1>
          <p className="mt-2 text-gray-600">
            İnşaat ve mimari dünyasından güncel içerikler.
          </p>
        </header>

        {/* Arama + Kategori filtre */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-8">
          <input
            placeholder="Ara: başlık, etiket, içerik…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
          />
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm border transition whitespace-nowrap ${
                  cat === c
                    ? "bg-[#155dfc] text-white border-[#155dfc]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c === "all" ? "Tümü" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {posts === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 animate-pulse shadow-md border border-gray-100">
                <div className="h-44 w-full rounded-xl bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 bg-gray-200 rounded" />
                <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {posts?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Henüz yayınlanmış içerik yok.
          </div>
        )}

        {/* Grid */}
        {posts && posts.length > 0 && (
          <>
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                Filtrenize uygun sonuç bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => {
                  const cover = p.coverUrl || p.images?.[0] || "/placeholder.jpg";
                  const dt = p.createdAt?.toDate ? p.createdAt.toDate() : null;
                  const dateStr = dt
                    ? dt.toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <Link
                      key={p.id}
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
                            inline-flex items-center text-sm font-medium text-[#155dfc]
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
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
