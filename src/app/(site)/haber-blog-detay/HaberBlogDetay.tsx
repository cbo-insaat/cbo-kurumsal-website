"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// ✅ Quill HTML içeriği düzgün görünsün diye
import "react-quill-new/dist/quill.snow.css";

interface PostData {
  id: string;
  title?: string;
  category?: string;
  content?: string; // HTML
  excerpt?: string;
  coverUrl?: string;
  images?: string[];
  tags?: string[];
  status?: string;
  createdAt?: any;
}

export default function HaberBlogDetay({ postId }: { postId: string }) {
  const [post, setPost] = useState<any | null>(null);
  const [more, setMore] = useState<any[] | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Okuma İlerleme Çubuğu
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    async function fetchData() {
      const pref = doc(db, "posts", postId);
      const psnap = await getDoc(pref);

      if (psnap.exists()) {
        const p = { id: psnap.id, ...psnap.data() } as PostData;
        setPost(p);

        const q1 = query(
          collection(db, "posts"),
          where("status", "==", "published"),
          where("category", "==", p.category || "Genel"),
          limit(4)
        );
        const r1 = await getDocs(q1);
        setMore(
          r1.docs
            .filter((d) => d.id !== postId)
            .map((d) => ({ id: d.id, ...d.data() } as PostData))
        );
      }
    }
    fetchData();
  }, [postId]);

  const gallery = useMemo(() => {
    if (!post) return [];
    return post.images?.length > 0 ? post.images : [post.coverUrl || "/placeholder.jpg"];
  }, [post]);

  if (!post)
    return (
      <div className="h-screen flex items-center justify-center animate-pulse font-black text-slate-200">
        İÇERİK YÜKLENİYOR...
      </div>
    );

  return (
    <main className="min-h-screen bg-white pb-32">
      <style dangerouslySetInnerHTML={{ __html: `
        .ql-editor { 
          padding: 0 !important; 
          height: auto !important; 
          overflow-y: visible !important; 
        }
        .ql-editor p { 
          margin-bottom: 1.5rem !important; 
          line-height: 1.8 !important; 
          font-size: 1.125rem !important;
          color: #475569 !important;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 { 
          color: #0f172a !important; 
          font-weight: 900 !important; 
          text-transform: uppercase !important; 
          font-style: italic !important; 
          margin-top: 2.5rem !important; 
          margin-bottom: 1rem !important;
          letter-spacing: -0.025em !important;
        }
        .ql-editor h1 { font-size: 2.5rem !important; }
        .ql-editor h2 { font-size: 2rem !important; }
        .ql-editor h3 { font-size: 1.5rem !important; }
        .ql-editor ul, .ql-editor ol { 
          margin-bottom: 1.5rem !important; 
          padding-left: 1.5rem !important; 
        }
        .ql-editor li { 
          margin-bottom: 0.5rem !important; 
          color: #475569 !important;
          list-style: disc !important;
        }
        .ql-editor strong { color: #0f172a !important; font-weight: 800 !important; }
        .ql-editor em { font-style: italic !important; color: #f97316 !important; }
      `}} />

      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-[100] origin-left" style={{ scaleX }} />

      {/* HERO SECTION - Büyük Tipografi ve Kapak */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {post.category || "Mimari Güncel"}
              </span>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Clock size={12} /> {Math.ceil((post.content?.length || 0) / 1000)} DK OKUMA
              </span>
            </div>

            <h1 className="text-[8vw] md:text-[80px] font-black leading-[0.9] tracking-tighter uppercase italic text-slate-900 mb-12">
              {post.title}
            </h1>

            <div className="flex items-center gap-8 border-t border-slate-200 pt-8">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Yayınlanma</span>
                <span className="text-slate-900 font-bold text-sm">
                  {post.createdAt?.toDate().toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-slate-200" />
              <div className="flex gap-2">
                {post.tags?.slice(0, 3).map((t: string, i: number) => (
                  <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Arka Plan Büyük Yazı */}
        <div className="absolute -right-20 top-40 opacity-[0.03] select-none pointer-events-none">
          <span className="text-[25vw] font-black italic uppercase leading-none text-slate-900">ARTICLE</span>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-6 mt-20">
        <div className="grid lg:grid-cols-12 gap-16">
   

          {/* CENTER: Main Content */}
          <div className="lg:col-span-7">
            {/* Görsel Galeri (Editorial Style) */}
            <div className="relative mb-16 group">
              <div className="relative h-[500px] md:h-[700px] overflow-hidden rounded-[3rem] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <Image src={gallery[activeIdx]} alt="Cover" fill className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>

              {gallery.length > 1 && (
                <div className="absolute -bottom-6 right-10 flex gap-2">
                  <button
                    onClick={() => setActiveIdx((p) => (p - 1 + gallery.length) % gallery.length)}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-orange-500 hover:text-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setActiveIdx((p) => (p + 1) % gallery.length)}
                    className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-orange-500 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Article Text */}
            <div className="prose prose-slate max-w-none">
              <p className="text-2xl md:text-4xl text-slate-900 font-black italic tracking-tighter leading-[1.1] mb-16 border-l-4 border-orange-500 pl-8">
                {post.excerpt ||
                  "Bu makalede CBO Yapı'nın modern mimari vizyonu ve güncel mühendislik yaklaşımları detaylandırılmaktadır."}
              </p>

              {/* ✅ Quill HTML içeriğini düzgün göster */}
              <div className="text-lg text-slate-600 font-medium leading-relaxed">
                <div
                  className="ql-snow"
                  style={{ background: "transparent", border: "none" }}
                >
                  <div
                    className="ql-editor p-0"
                    dangerouslySetInnerHTML={{ __html: post.content || "" }}
                  />
                </div>
              </div>
            </div>

            {/* Tags & Footer */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-4">
              {post.tags?.map((t: string, i: number) => (
                <span
                  key={i}
                  className="px-6 py-2 bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Related Content */}
          <div className="lg:col-span-4 lg:pl-10">
            <div className="sticky top-32 space-y-12">
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 border-b-2 border-orange-500 pb-4 inline-block">
                Sıradaki Yazılar
              </h4>
              <div className="space-y-10">
                {more?.map((m) => (
                  <Link
                    key={m.id}
                    href={{ pathname: "/haber-blog-detay", query: { id: m.id } }}
                    className="group block"
                  >
                    <div className="relative h-40 overflow-hidden rounded-[2rem] mb-4">
                      <Image
                        src={m.coverUrl || m.images?.[0] || "/placeholder.jpg"}
                        alt={m.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
                      />
                    </div>
                    <h5 className="text-lg font-black uppercase italic tracking-tight text-slate-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {m.title}
                    </h5>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-[1px] w-6 bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OKUMAYA BAŞLA</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] group-hover:scale-150 transition-transform duration-1000" />
                <h4 className="text-xl font-black italic tracking-tighter mb-4">ÜCRETSİZ TEKLİF</h4>
                <p className="text-slate-400 text-sm font-medium mb-8">
                  Hayalinizdeki projeyi bizimle hayata geçirmek ister misiniz?
                </p>
                <Link
                  href="/teklif-al"
                  className="inline-flex items-center gap-4 text-orange-500 font-black uppercase tracking-widest text-[10px] group"
                >
                  HEMEN BAŞLAYIN <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}