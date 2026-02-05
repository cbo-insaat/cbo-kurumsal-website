"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, getDocs, limit, orderBy, query, where, Timestamp } from "firebase/firestore";

type PostDoc = {
  id: string;
  title: string;
  category?: string;
  coverUrl?: string;
  createdAt?: Timestamp | null;
};

export default function SectionHaberBlog() {
  const [posts, setPosts] = useState<PostDoc[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PostDoc));
        setPosts(list);
      } catch (e) {
        console.error(e);
        setPosts([]);
      }
    })();
  }, []);

  if (!posts) return null;

  return (
    <section className="bg-white py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Başlık Bölümü: Dikey ve Dev Tipografi */}
        <div className="relative flex flex-col md:flex-row items-start justify-between mb-24">
          <h2 className="text-[15vw] md:text-[120px] font-black leading-none uppercase tracking-tighter text-slate-900 italic">
            <span className="block">Gündem</span>
            <span className="block ml-[10vw] text-transparent [-webkit-text-stroke:1.5px_#0f172a]">Analiz</span>
          </h2>

          <div className="mt-10 md:mt-0 md:max-w-xs text-right">
            <p className="text-slate-500 font-medium leading-relaxed mb-6">
              Mimari trendler, mühendislik çözümleri ve sektörel vizyon üzerine en yeni içerikler.
            </p>
            <Link href="/tum-haberler" className="inline-block px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-colors">
              Tümünü Keşfet
            </Link>
          </div>
        </div>

        {/* Blog Kartları: Overlay Tipografi ve Asimetrik Dizilim */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className={`relative group cursor-pointer overflow-hidden h-[600px] ${idx === 1 ? "md:-mt-12" : "" // Ortadaki kartı yukarı kaydırarak asimetri sağladık
                }`}
            >
              <Link href={{ pathname: "/haber-blog-detay", query: { id: post.id } }}>
                {/* Image Layer */}
                <Image
                  src={post.coverUrl || "/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />

                {/* Renkli Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-orange-500/20 transition-colors duration-500" />

                {/* İçerik Layer */}
                <div className="absolute inset-0 p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-white text-xs font-black uppercase tracking-[0.3em] border-l-4 border-orange-500 pl-3">
                      {post.category || "Haber"}
                    </span>
                    <span className="text-white/40 font-mono text-4xl italic font-black">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="text-white text-3xl font-black uppercase leading-[0.9] tracking-tighter mb-6 group-hover:translate-x-4 transition-transform duration-500">
                      {post.title}
                    </h3>
                    <div className="h-1 w-0 group-hover:w-full bg-white transition-all duration-700" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Kayan Yazı (Marquee) Efekti - Alt Bölüm */}
      <div className="mt-32 border-y border-slate-100 py-10 overflow-hidden whitespace-nowrap flex select-none relative">
        <motion.div
          animate={{ x: ["0%", "-50%"] }} // %50 kaydırarak tam eşleşme sağlıyoruz
          transition={{
            duration: 100, // Hızı buradan ayarlayabilirsin
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex gap-20 items-center min-w-max" // min-w-max içeriğin sıkışmasını engeller
        >
          {/* İçeriği 2 kez render ediyoruz ki sonsuz döngüde boşluk kalmasın */}
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-8xl font-black text-slate-100 uppercase italic flex items-center gap-20">
              CBO YAPI • MİMARİ • MÜHENDİSLİK • GELECEK •
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}