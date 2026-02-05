"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { MapPin, Calendar, ArrowRight, Layers, LucideIcon } from "lucide-react";

// 1. Proje Veri Tipini Tanımlayalım
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
}

export default function ProjeDetay({ projectId }: { projectId: string }) {
    // 2. State'leri tiplendirelim
    const [project, setProject] = useState<ProjectData | null>(null);
    const [service, setService] = useState<any | null>(null);
    const [related, setRelated] = useState<ProjectData[] | null>(null);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const pref = doc(db, "projects", projectId);
            const psnap = await getDoc(pref);
            
            if (psnap.exists()) {
                // 3. 'as ProjectData' diyerek hatayı çözüyoruz
                const p = { id: psnap.id, ...psnap.data() } as ProjectData;
                setProject(p);

                if (p.serviceId) {
                    const sref = doc(db, "services", p.serviceId);
                    const ssnap = await getDoc(sref);
                    if (ssnap.exists()) setService({ id: ssnap.id, ...ssnap.data() });

                    const rq = query(
                        collection(db, "projects"), 
                        where("serviceId", "==", p.serviceId), 
                        limit(4)
                    );
                    const rs = await getDocs(rq);
                    setRelated(rs.docs
                        .filter(d => d.id !== projectId)
                        .map(d => ({ id: d.id, ...d.data() } as ProjectData))
                    );
                }
            }
        }
        fetchData();
    }, [projectId]);

    const images = useMemo(() => {
        if (!project) return [];
        return project.images && project.images.length > 0 
            ? project.images 
            : [project.coverUrl || "/placeholder.jpg"];
    }, [project]);

    if (!project) return <div className="h-screen flex items-center justify-center animate-pulse font-black uppercase tracking-widest text-slate-300">Proje Detayları Yükleniyor...</div>;

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* HERO SECTION */}
            <section className="relative h-[80vh] w-full overflow-hidden bg-slate-900">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImg}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[activeImg]}
                            alt={project.name || "Proje"}
                            fill
                            className="object-cover opacity-80"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                <div className="absolute bottom-20 left-0 w-full">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
                                {service?.name || "Özel Proje"}
                            </span>
                            <h1 className="text-[10vw] lg:text-[100px] font-black leading-[0.85] tracking-tighter uppercase italic text-slate-900">
                                {project.name}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-10 right-10 flex gap-2">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImg(i)}
                            className={`w-12 h-12 rounded-full border-2 transition-all overflow-hidden ${activeImg === i ? "border-orange-500 scale-110" : "border-white/20 opacity-50"}`}
                        >
                            <Image src={img} alt="thumb" width={50} height={50} className="object-cover h-full w-full" />
                        </button>
                    ))}
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-4 space-y-12">
                        <div className="lg:sticky lg:top-32 space-y-10">
                            <div>
                                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-4">
                                    <div className="h-[1px] w-8 bg-orange-500" /> Proje Künyesi
                                </h3>
                                <div className="space-y-6">
                                    <DetailItem icon={MapPin} label="Konum" value={project.location || "Belirtilmemiş"} />
                                    <DetailItem icon={Layers} label="Durum" value={project.status === "ongoing" ? "Devam Ediyor" : "Tamamlandı"} color={project.status === "ongoing" ? "text-orange-500" : "text-emerald-500"} />
                                    {project.startedAt && <DetailItem icon={Calendar} label="Başlangıç" value={project.startedAt.toDate().toLocaleDateString('tr-TR')} />}
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <p className="text-slate-600 font-medium leading-relaxed italic">
                                    "{project.description || "Bu proje CBO Yapı'nın üstün mühendislik ve estetik anlayışıyla inşa edilmiştir."}"
                                </p>
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
                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-8">Mimari Yaklaşım</h2>
                            <p className="text-xl text-slate-500 font-medium leading-loose">
                                Proje kapsamında modern çizgiler ve dayanıklı mühendislik çözümleri bir araya getirilmiştir.
                                Mekansal bütünlük ve kullanıcı deneyimi odağa alınarak tasarlanan bu yapı, CBO Yapı'nın kalite standartlarını yansıtmaktadır.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {images.slice(0, 4).map((img, i) => (
                                <motion.div
                                    key={i}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    initial={{ opacity: 0, y: 40 }}
                                    viewport={{ once: true }}
                                    className={`relative overflow-hidden rounded-[2.5rem] shadow-xl ${i % 3 === 0 ? "col-span-2 h-[500px]" : "col-span-1 h-[350px]"}`}
                                >
                                    <Image src={img} alt="Detail" fill className="object-cover hover:scale-110 transition-transform duration-1000" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {related && related.length > 0 && (
                <section className="bg-slate-50 py-24 mt-20">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <h2 className="text-[6vw] font-black uppercase italic tracking-tighter text-slate-200 mb-12">İlgili İşler</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {related.map((p) => (
                                <Link key={p.id} href={{ pathname: "/proje-detay", query: { id: p.id } }} className="group">
                                    <div className="relative h-72 overflow-hidden rounded-[2rem] mb-4">
                                        <Image src={p.coverUrl || p.images?.[0] || "/placeholder.jpg"} alt={p.name || "İlgili Proje"} fill className="object-cover group-hover:scale-110 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <h4 className="text-slate-900 font-black uppercase italic tracking-tight">{p.name}</h4>
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{p.location}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

// 4. DetailItem için Tip Güvenliği
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