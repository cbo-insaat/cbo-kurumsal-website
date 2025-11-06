// File: app/haber-blog-detay/HaberBlogDetay.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
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

type Props = { postId: string };

export default function HaberBlogDetay({ postId }: Props) {
  const [post, setPost] = useState<PostDoc | null>(null);
  const [more, setMore] = useState<PostDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Okuma süresi (kelime / 220 ≈ dakika)
  const readMins = useMemo(() => {
    if (!post?.content) return 1;
    const words = post.content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  }, [post]);

  // Galeri (kapak + ek görseller)
  const gallery = useMemo(() => {
    if (!post) return [];
    if (post.images && post.images.length > 0) return post.images;
    if (post.coverUrl) return [post.coverUrl];
    return ["/placeholder.jpg"];
  }, [post]);

  const [active, setActive] = useState(0);
  const prev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActive((i) => (i + 1) % gallery.length);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);
      setPost(null);
      setMore(null);
      setActive(0);

      try {
        if (!postId) {
          setError("Geçersiz yazı.");
          return;
        }

        // 1) Yazı
        const pref = doc(db, "posts", postId);
        const psnap = await getDoc(pref);
        if (!psnap.exists()) {
          setError("İçerik bulunamadı.");
          return;
        }
        const x = psnap.data() as any;
        const p: PostDoc = {
          id: psnap.id,
          title: x.title,
          excerpt: x.excerpt,
          content: x.content,
          status: x.status,
          category: x.category,
          tags: x.tags || [],
          coverUrl: x.coverUrl,
          images: x.images || [],
          createdAt: x.createdAt ?? null,
        };
        if (cancelled) return;
        setPost(p);

        // 2) Aynı kategoriden diğer yazılar (6 adet)
        const q1 = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          ...(p.category ? [where("category", "==", p.category)] : []),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const r1 = await getDocs(q1);
        const others: PostDoc[] = r1.docs
          .filter((d) => d.id !== p.id)
          .map((d) => {
            const y = d.data() as any;
            return {
              id: d.id,
              title: y.title,
              excerpt: y.excerpt,
              content: y.content,
              status: y.status,
              category: y.category,
              tags: y.tags || [],
              coverUrl: y.coverUrl,
              images: y.images || [],
              createdAt: y.createdAt ?? null,
            };
          });

        if (!cancelled) setMore(others);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Veriler yüklenirken bir hata oluştu.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Üst bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {post?.category && (
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-medium">
              {post.category}
            </span>
          )}

          {post?.createdAt?.toDate && (
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600">
              {post.createdAt.toDate().toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}

          {post && (
            <span className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              ~{readMins} dk
            </span>
          )}
        </div>

        {/* Hata / Loading */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 text-center">
            {error}
          </div>
        )}
        {!post && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-80 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="space-y-4 animate-pulse">
              <div className="h-10 w-4/5 bg-gray-200 rounded" />
              <div className="h-5 w-full bg-gray-200 rounded" />
              <div className="h-5 w-11/12 bg-gray-200 rounded" />
              <div className="h-5 w-10/12 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {/* İçerik */}
        {post && (
          <>
            {/* Başlık + Galeri */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Sol: Galeri */}
              <div className="relative">
                <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border-2 border-slate-100 shadow-xl">
                  <Image
                    key={gallery[active]}
                    src={gallery[active]}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 hover:bg-white shadow-lg p-3 transition-all hover:scale-110"
                        aria-label="Önceki"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 hover:bg-white shadow-lg p-3 transition-all hover:scale-110"
                        aria-label="Sonraki"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail önizleme */}
                {gallery.length > 1 && (
                  <div className="mt-4 grid grid-cols-6 gap-2">
                    {gallery.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`relative h-16 rounded-lg overflow-hidden ring-2 transition-all ${
                          i === active
                            ? "ring-slate-600 shadow-md"
                            : "ring-slate-200 hover:ring-slate-400"
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`Önizleme ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sağ: İçerik */}
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
                    {post.title}
                  </span>
                </h1>

                {/* Etiketler */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* İçerik */}
                {post.content && (
                  <article className="mt-6 prose prose-slate max-w-none text-gray-700 space-y-5">
                    {post.content.split("\n").map((p, i) => {
                      const line = p.trim();
                      if (!line) return null;
                      return (
                        <p key={i} className="text-base leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </article>
                )}

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <Link
                    href="/haberler-blog"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Tüm Yazılar
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            {/* Diğer Yazılar */}
            {more && more.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Benzer Yazılar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {more.map((m) => {
                    const cover = m.coverUrl || m.images?.[0] || "/placeholder.jpg";
                    const dt = m.createdAt?.toDate ? m.createdAt.toDate() : null;
                    const dateStr = dt
                      ? dt.toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "";

                    return (
                      <Link
                        key={m.id}
                        href={{ pathname: "/haber-blog-detay", query: { id: m.id } }}
                        className="
                          group block focus:outline-none
                          rounded-2xl bg-white shadow-lg border border-slate-100
                          transition-all duration-300
                          hover:-translate-y-1 hover:shadow-2xl
                          overflow-hidden
                        "
                      >
                        <div className="relative h-48 w-full">
                          <Image
                            src={cover}
                            alt={m.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                          {m.category && (
                            <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full bg-white/95 text-slate-800 border border-slate-200 font-medium">
                              {m.category}
                            </span>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span>{dateStr}</span>
                            {m.tags && m.tags.length > 0 && (
                              <span className="truncate max-w-[60%]">
                                {m.tags.slice(0, 2).join(" · ")}
                                {m.tags.length > 2 ? " +" : ""}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-lg text-slate-800 line-clamp-2 group-hover:text-slate-900 transition">
                            {m.title}
                          </h3>

                          {m.excerpt && (
                            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                              {m.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="px-5 pb-5">
                          <span
                            className="
                              inline-flex items-center text-sm font-medium text-slate-600
                              opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-300
                            "
                          >
                            Okumaya Devam Et
                            <svg
                              className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5"
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
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}