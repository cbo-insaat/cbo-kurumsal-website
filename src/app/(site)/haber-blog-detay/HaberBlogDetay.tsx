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
  content?: string;       // düz metin; satır sonlarına göre <p>’lere böleceğiz
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

  // İçerikten kaba bir "okuma süresi" (dakika) tahmini
  const readMins = useMemo(() => {
    if (!post?.content) return 1;
    const words = post.content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  }, [post]);

  // Görsel galerisi
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

        // 2) Diğer yazılar (aynı kategoriden yayınlanmış olanlardan 6 adet)
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
        {/* Üst bar: geri, kategori, tarih, okuma süresi */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
 
          {post?.category && (
            <span className="text-xs px-2 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-700">
              {post.category}
            </span>
          )}

          {post?.createdAt?.toDate && (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
              {post.createdAt.toDate().toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}

          {post && (
            <span className="text-xs px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
              ~{readMins} dk okuma
            </span>
          )}
        </div>

        {/* Hata / Loading */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
        {!post && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative h-72 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded" />
              <div className="mt-3 h-4 w-96 bg-gray-200 rounded" />
              <div className="mt-2 h-4 w-80 bg-gray-200 rounded" />
              <div className="mt-2 h-4 w-72 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {/* İçerik */}
        {post && (
          <>
            {/* Başlık + Kapak/Galeri */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sol: Galeri */}
              <div className="relative">
                <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-gray-100 shadow">
                  <Image
                    key={gallery[active]}
                    src={gallery[active]}
                    alt={post.title || "Blog kapak görseli"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow p-2"
                        aria-label="Önceki görsel"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow p-2"
                        aria-label="Sonraki görsel"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Küçük önizlemeler */}
                {gallery.length > 1 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {gallery.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`relative h-16 rounded-lg overflow-hidden ring-1 ${
                          i === active ? "ring-blue-400" : "ring-gray-200"
                        }`}
                        aria-label={`Önizleme ${i + 1}`}
                      >
                        <Image
                          src={src}
                          alt={`Önizleme görseli ${i + 1}` || "CBO İnşaat"}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sağ: Başlık ve meta + içerik */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
                    {post.title}
                  </span>
                </h1>

                {/* Etiketler */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* İçerik (paragraflara böl) */}
                {post.content && (
                  <div className="mt-5 text-gray-700 leading-relaxed space-y-3">
                    {post.content.split("\n").map((p, i) => {
                      const line = p.trim();
                      if (!line) return null;
                      return (
                        <p key={i} className="text-[15px] md:text-base">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                )}

                {/* Aksiyonlar */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/tum-haberler"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Tüm yazılar
                  </Link>
                </div>
              </div>
            </section>

            {/* Daha fazlası */}
            {more && more.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Diğer Yazılar
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
                        className="rounded-2xl bg-white border border-gray-100 shadow hover:shadow-md transition block overflow-hidden"
                      >
                        <div className="relative h-40 w-full">
                          <Image
                            src={cover}
                            alt={m.title || "Blog görseli"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                          {m.category && (
                            <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full border bg-white/90 text-gray-800 border-gray-200">
                              {m.category}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{dateStr}</span>
                            {m.tags && m.tags.length > 0 && (
                              <span className="truncate max-w-[60%]">
                                {m.tags.slice(0, 2).join(" · ")}
                                {m.tags.length > 2 ? " +" : ""}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 font-semibold text-gray-900 line-clamp-2">
                            {m.title}
                          </h3>
                          {m.excerpt && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {m.excerpt}
                            </p>
                          )}
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
