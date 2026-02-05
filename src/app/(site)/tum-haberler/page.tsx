"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, getDocs, limit, orderBy, query, where, Timestamp } from "firebase/firestore";

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

export default function HaberlerBlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(40)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(list);
      } catch (e) {
        console.error(e);
        setPosts([]);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts?.forEach(p => p.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts?.filter(p => {
      const inCat = activeCat === "all" || p.category === activeCat;
      const inSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || 
                       p.excerpt?.toLowerCase().includes(search.toLowerCase());
      return inCat && inSearch;
    });
  }, [posts, activeCat, search]);

  const featuredPost = filtered?.[0];
  const otherPosts = filtered?.slice(1);

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* TOP SECTION: Title & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12vw] md:text-[140px] font-black leading-[0.8] uppercase tracking-tighter text-slate-900 italic"
            >
              CBO <br /> <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a]">Haberler</span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-6 md:w-96">
            <div className="relative group">
               <input 
                type="text" 
                placeholder="İçeriklerde ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-black w-full bg-transparent border-b-2 border-slate-200 py-3 outline-none focus:border-orange-500 transition-colors font-bold uppercase tracking-widest text-xs"
               />
            </div>
         
          </div>
        </div>

        {/* LOADING STATE */}
        {!posts && (
          <div className="h-96 w-full bg-slate-50 animate-pulse rounded-[3rem]" />
        )}

        {/* FEATURED POST (EN YENİ HABER) */}
        {featuredPost && !search && activeCat === "all" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mb-32 group"
          >
            <Link href={{ pathname: "/haber-blog-detay", query: { id: featuredPost.id } }} className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-[3rem] shadow-2xl">
                <Image 
                  src={featuredPost.coverUrl || "/placeholder.jpg"} 
                  alt={featuredPost.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-8 left-8 bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Öne Çıkan
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">
                  {featuredPost.category} — {featuredPost.createdAt?.toDate().toLocaleDateString('tr-TR')}
                </span>
                <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-slate-900 group-hover:text-orange-500 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
                  {featuredPost.excerpt || featuredPost.title}
                </p>
                <div className="flex items-center gap-4 group-hover:gap-6 transition-all">
                   <div className="h-[2px] w-20 bg-slate-900" />
                   <span className="font-black uppercase text-black tracking-widest text-xs">Okumaya Başla</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* POSTS LIST (DİĞERLERİ) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          <AnimatePresence>
            {(search || activeCat !== "all" ? filtered : otherPosts)?.map((p, idx) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link href={{ pathname: "/haber-blog-detay", query: { id: p.id } }}>
                  <div className="relative h-[450px] overflow-hidden rounded-[2.5rem] mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <Image 
                      src={p.coverUrl || p.images?.[0] || "/placeholder.jpg"} 
                      alt={p.title} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                       <span className="text-white font-black uppercase tracking-widest text-[10px]">Habere Git</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-orange-500 font-bold uppercase tracking-widest text-[10px]">{p.category}</span>
                      <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none group-hover:text-orange-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                      {p.excerpt || p.title}
                    </p>
                    <span className="text-slate-300 font-mono text-[10px] uppercase">{p.createdAt?.toDate().toLocaleDateString('tr-TR')}</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {filtered?.length === 0 && (
          <div className="py-40 text-center border-t border-slate-100">
             <h3 className="text-4xl font-black uppercase italic text-slate-200">İçerik Bulunamadı</h3>
          </div>
        )}

      </div>
    </main>
  );
}