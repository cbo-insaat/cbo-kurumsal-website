"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { MapPin, Calendar, ArrowRight, ChevronUp, Layers, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";
import { ChevronDown } from "lucide-react";

// Video kontrol fonksiyonu
function isVideoUrl(url: string) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

// 1. Veri Tipleri
interface ProjectData {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  status?: "ongoing" | "completed";
  serviceId?: string;
  coverUrl?: string;
  images?: string[];
  startedAt?: any;
  content?: string;
}

export default function ProjeDetay({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [service, setService] = useState<any | null>(null);
  const [related, setRelated] = useState<ProjectData[] | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [thumbsOpen, setThumbsOpen] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  // Alt galeri sayfalama
  const [galleryPage, setGalleryPage] = useState(0);
  const GALLERY_PAGE_SIZE = 4;

  // Üst thumbnail bar ref
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const toggleThumbs = () => {
    setThumbsOpen((v) => {
      const next = !v;

      // KAPANIYORSA: içeriğe kay
      if (!next) {
        requestAnimationFrame(() => {
          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } else {
        // AÇILIYORSA: hero'ya kay
        requestAnimationFrame(() => {
          heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

      return next;
    });
  };

  useEffect(() => {
    async function fetchData() {
      const pref = doc(db, "projects", projectId);
      const psnap = await getDoc(pref);

      if (psnap.exists()) {
        const p = { id: psnap.id, ...psnap.data() } as ProjectData;
        setProject(p);

        if (p.serviceId) {
          const sref = doc(db, "services", p.serviceId);
          const ssnap = await getDoc(sref);
          if (ssnap.exists()) setService({ id: ssnap.id, ...ssnap.data() });

          const rq = query(collection(db, "projects"), where("serviceId", "==", p.serviceId), limit(4));
          const rs = await getDocs(rq);
          setRelated(
            rs.docs
              .filter((d) => d.id !== projectId)
              .map((d) => ({ id: d.id, ...d.data() } as ProjectData))
          );
        }
      }
    }
    fetchData();
  }, [projectId]);

  const images = useMemo(() => {
    if (!project) return [];
    return project.images && project.images.length > 0 ? project.images : [project.coverUrl || "/placeholder.jpg"];
  }, [project]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);

      // sadece 2+ görsel varsa sağ/sol çalışsın
      if (images.length > 1) {
        if (e.key === "ArrowLeft") prevLightbox();
        if (e.key === "ArrowRight") nextLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length]);

  const prevLightbox = () => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextLightbox = () => {
    setLightboxIndex((i) => (i + 1) % images.length);
  };

  useEffect(() => {
    setActiveImg(0);
    setGalleryPage(0);
    if (thumbsRef.current) thumbsRef.current.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
  }, [projectId, images.length]);

  const htmlContent = useMemo(() => {
    if (!project) return "";
    return (project.content || project.description || "").toString();
  }, [project]);

  const totalGalleryPages = useMemo(() => {
    return Math.max(1, Math.ceil(images.length / GALLERY_PAGE_SIZE));
  }, [images.length]);

  const pagedImages = useMemo(() => {
    const start = galleryPage * GALLERY_PAGE_SIZE;
    return images.slice(start, start + GALLERY_PAGE_SIZE);
  }, [images, galleryPage]);

  // Thumbnail kaydırma fonksiyonu
  const scrollThumbs = (dir: "left" | "right") => {
    const el = thumbsRef.current;
    if (!el) return;
    const amount = 300; // Daha geniş kaydırma
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const onThumbsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = thumbsRef.current;
    if (!el) return;
    if (!e.shiftKey) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  if (!project)
    return (
      <div className="h-screen flex items-center justify-center animate-pulse font-black uppercase tracking-widest text-slate-300">
        Proje Detayları Yükleniyor...
      </div>
    );

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* HTML Content Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .project-content .ql-editor { padding: 0 !important; height: auto !important; overflow-y: visible !important; }
            .project-content p { margin-bottom: 1.5rem !important; line-height: 1.8 !important; font-size: 1.125rem !important; color: #64748b !important; }
            .project-content h1, .project-content h2, .project-content h3 { color: #0f172a !important; font-weight: 900 !important; text-transform: uppercase !important; font-style: italic !important; margin-top: 2.5rem !important; margin-bottom: 1.25rem !important; letter-spacing: -0.025em !important; }
            .project-content h1 { font-size: 2.5rem !important; }
            .project-content h2 { font-size: 2rem !important; }
            .project-content h3 { font-size: 1.5rem !important; }
            .project-content ul, .project-content ol { margin-bottom: 2rem !important; padding-left: 1.5rem !important; list-style-position: outside !important; }
            .project-content li { margin-bottom: 0.75rem !important; color: #64748b !important; list-style: disc !important; padding-left: 0.5rem !important; }
            .project-content strong { color: #0f172a !important; font-weight: 800 !important; }
            .project-content em { font-style: italic !important; color: #f97316 !important; }
          `,
        }}
      />

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-[100vh] w-full overflow-hidden bg-slate-900">

        {/* Ana Arkaplan Görseli veya Videosu */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {isVideoUrl(images[activeImg]) ? (
              <video
                src={images[activeImg]}
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={images[activeImg]}
                alt={project.name || "Proje"}
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

        {/* Sol Alttaki Başlık Alanı */}
        <div className="absolute bottom-40 lg:bottom-48 left-0 w-full z-10 pointer-events-none">
          <div className="max-w-[1400px] mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
                {service?.name || "Özel Proje"}
              </span>
              <h1 className="text-[10vw] lg:text-[100px] font-black leading-[0.85] tracking-tighter uppercase italic text-white drop-shadow-lg">
                {project.name}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* --- YENİLENMİŞ THUMBNAIL BAR --- */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-0 w-full z-20">
            <div className="max-w-[1400px] mx-auto px-6 relative flex justify-center">

              {/* OK / HANDLE (HER ZAMAN GÖRÜNÜR) */}
              <button
                type="button"
                onClick={toggleThumbs}
                aria-label={thumbsOpen ? "Aşağı indir" : "Yukarı çıkar"}
                className="absolute -top-14 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/55 transition-all shadow-xl"
              >
                {thumbsOpen ? <ChevronDown size={26} /> : <ChevronUp size={26} />}
              </button>

              {/* BAR (SADECE BU KISIM AŞAĞI İNİP KAYBOLACAK) */}
              <motion.div
                animate={thumbsOpen ? { y: 0, opacity: 1 } : { y: 140, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`relative w-full lg:min-w-[560px] max-w-[920px] ${thumbsOpen ? "pointer-events-auto" : "pointer-events-none"
                  }`}
              >
                <div className="relative w-full flex items-center gap-4 bg-black/30 backdrop-blur-md p-4 rounded-full border border-white/10">
                  {/* Sol Ok */}
                  <button
                    type="button"
                    onClick={() => scrollThumbs("left")}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0"
                    aria-label="Sola Kaydır"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Scroll Alanı */}
                  <div
                    ref={thumbsRef}
                    onWheel={onThumbsWheel}
                    className="flex gap-4 overflow-x-auto scroll-smooth py-2 px-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x items-center flex-1"
                  >
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-2 transition-all overflow-hidden relative group ${activeImg === i
                            ? "border-orange-500 scale-100 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                            : "border-white/10 opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                      >
                        {isVideoUrl(img) ? (
                          <video src={img} className="object-cover w-full h-full" muted playsInline />
                        ) : (
                          <Image src={img} alt={`thumb-${i}`} fill className="object-cover" sizes="100px" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Sağ Ok */}
                  <button
                    type="button"
                    onClick={() => scrollThumbs("right")}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0"
                    aria-label="Sağa Kaydır"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        )}

      </section>

      {/* --- CONTENT SECTION --- */}
      <section ref={contentRef} className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-12">
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-orange-500" /> Proje Künyesi
                </h3>
                <div className="space-y-6">
                  <DetailItem icon={MapPin} label="Konum" value={project.location || "Belirtilmemiş"} />
                  <DetailItem
                    icon={Layers}
                    label="Durum"
                    value={project.status === "ongoing" ? "Devam Ediyor" : "Tamamlandı"}
                    color={project.status === "ongoing" ? "text-orange-500" : "text-emerald-500"}
                  />
                  {project.startedAt && (
                    <DetailItem icon={Calendar} label="Başlangıç" value={project.startedAt.toDate().toLocaleDateString("tr-TR")} />
                  )}
                </div>
              </div>

              <Link
                href="/iletisim"
                className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-orange-500 transition-all group"
              >
                Benzer Proje Talebi <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-20">
            <div className="prose prose-slate max-w-none project-content">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-8">Mimari Yaklaşım</h2>
              <div className="ql-snow">
                <div className="ql-editor p-0" dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
              {!htmlContent && (
                <p className="text-xl text-slate-500 font-medium leading-loose">
                  Proje kapsamında modern çizgiler ve dayanıklı mühendislik çözümleri bir araya getirilmiştir.
                </p>
              )}
            </div>

            {/* Alt Galeri */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {pagedImages.map((img, i) => {
                  const absoluteIndex = galleryPage * GALLERY_PAGE_SIZE + i;
                  const isVideo = isVideoUrl(img);
                  return (
                    <motion.div
                      key={`${img}-${absoluteIndex}`}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 40 }}
                      viewport={{ once: true }}
                      className={`relative overflow-hidden rounded-[2.5rem] shadow-xl cursor-zoom-in ${absoluteIndex % 3 === 0 ? "col-span-2 h-[500px]" : "col-span-1 h-[350px]"
                        }`}
                      onClick={() => {
                        setLightboxIndex(absoluteIndex);
                        setLightboxOpen(true);
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={img}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="object-cover w-full h-full hover:scale-110 transition-transform duration-1000 pointer-events-none"
                        />
                      ) : (
                        <Image
                          src={img}
                          alt="Detail"
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-1000"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {images.length > GALLERY_PAGE_SIZE && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setGalleryPage((p) => Math.max(0, p - 1))}
                    disabled={galleryPage === 0}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] disabled:opacity-40 hover:border-orange-500 transition-all"
                  >
                    <ChevronLeft size={14} /> Önceki
                  </button>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {galleryPage + 1} / {totalGalleryPages}
                  </div>
                  <button
                    onClick={() => setGalleryPage((p) => Math.min(totalGalleryPages - 1, p + 1))}
                    disabled={galleryPage >= totalGalleryPages - 1}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] disabled:opacity-40 hover:border-orange-500 transition-all"
                  >
                    Sonraki <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* İlgili İşler */}
      {related && related.length > 0 && (
        <section className="bg-slate-50 py-24 mt-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <h2 className="text-[6vw] font-black uppercase italic tracking-tighter text-slate-200 mb-12">İlgili İşler</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((p) => {
                const cover = p.coverUrl || p.images?.[0] || "/placeholder.jpg";
                const isVideo = isVideoUrl(cover);
                return (
                  <Link key={p.id} href={{ pathname: "/proje-detay", query: { id: p.id } }} className="group">
                    <div className="relative h-72 overflow-hidden rounded-[2rem] mb-4">
                      {isVideo ? (
                        <video
                          src={cover}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="object-cover w-full h-full group-hover:scale-110 transition-all duration-700 pointer-events-none"
                        />
                      ) : (
                        <Image
                          src={cover}
                          alt={p.name || "İlgili Proje"}
                          fill
                          className="object-cover group-hover:scale-110 transition-all duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <h4 className="text-slate-900 font-black uppercase italic tracking-tight">{p.name}</h4>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{p.location}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden bg-black shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Kapat */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Kapat"
                className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all"
              >
                ✕
              </button>

              {/* Sol Ok (2+ görsel varsa) */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevLightbox();
                  }}
                  aria-label="Önceki görsel"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all"
                >
                  <ChevronLeft size={26} />
                </button>
              )}

              {/* Sağ Ok (2+ görsel varsa) */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextLightbox();
                  }}
                  aria-label="Sonraki görsel"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all"
                >
                  <ChevronRight size={26} />
                </button>
              )}

              {/* Büyük Görsel veya Video */}
              {isVideoUrl(images[lightboxIndex]) ? (
                <video
                  src={images[lightboxIndex]}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls // Kullanıcı isterse videoyu büyütebilir/sesini açabilir diye kontrolleri ekledim
                  className="object-contain w-full h-full"
                />
              ) : (
                <Image
                  src={images[lightboxIndex]}
                  alt="Büyük görsel"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// 4. Detail Item Component
interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color?: string;
}

function DetailItem({ icon: Icon, label, value, color = "text-slate-900" }: DetailItemProps) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`font-black uppercase italic tracking-tight ${color}`}>{value}</p>
      </div>
    </div>
  );
}