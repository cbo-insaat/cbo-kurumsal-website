"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { ArrowRight, Box, CheckCircle2, LayoutGrid, Clock } from "lucide-react";

export default function HizmetDetay({ serviceId }: { serviceId: string }) {
    const [service, setService] = useState<any | null>(null);
    const [projects, setProjects] = useState<any[] | null>(null);
    const [tab, setTab] = useState<"all" | "ongoing" | "completed">("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function run() {
            try {
                const ref = doc(db, "services", serviceId);
                const snap = await getDoc(ref);
                if (!snap.exists()) { setError("Hizmet bulunamadı."); return; }
                const sdata = snap.id ? { id: snap.id, ...snap.data() } : null;
                setService(sdata);

                const q = query(
                    collection(db, "projects"),
                    where("serviceId", "==", serviceId),
                    orderBy("createdAt", "desc")
                );
                const rs = await getDocs(q);
                setProjects(rs.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (e) {
                console.error(e);
                setError("Veriler yüklenirken bir hata oluştu.");
            }
        }
        run();
    }, [serviceId]);

    const filtered = useMemo(() => {
        if (!projects) return null;
        if (tab === "all") return projects;
        return projects.filter((p) => p.status === tab);
    }, [projects, tab]);

    if (error) return <div className="min-h-screen grid place-items-center text-red-500 font-bold">{error}</div>;
    if (!service) return <div className="min-h-screen grid place-items-center animate-pulse font-black text-slate-200">HİZMET YÜKLENİYOR...</div>;

    return (
        <main className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                
                {/* HEADER: Mimari Manifesto Stili */}
                <header className="grid lg:grid-cols-12 gap-16 items-start mb-32">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8"
                    >
                 
                        <h1 className="text-[10vw] lg:text-[100px] font-black leading-[0.85] tracking-tighter uppercase italic text-slate-900 mb-10">
                            {service.name}
                        </h1>
                        <div className="max-w-2xl text-xl text-slate-500 font-medium leading-relaxed">
                            {service.description}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-4 relative h-[450px] overflow-hidden rounded-[3rem] shadow-2xl"
                    >
                        <Image 
                            src={service.imageUrl || "/placeholder.jpg"} 
                            alt={service.name} 
                            fill 
                            className="object-cover" 
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                        <div className="absolute bottom-10 left-10 text-white font-black uppercase italic text-2xl tracking-tighter">
                            CBO <br /> EXPERTISE
                        </div>
                    </motion.div>
                </header>

                {/* PROJELER SECTION */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Uygulamalarımız</h2>
                            <div className="mt-2 h-[2px] w-20 bg-orange-500" />
                        </div>

                        {/* Filtre Sekmeleri */}
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            {[
                                { k: "all", l: "HEPSİ" },
                                { k: "ongoing", l: "DEVAM EDEN" },
                                { k: "completed", l: "TAMAMLANAN" }
                            ].map((t) => (
                                <button
                                    key={t.k}
                                    onClick={() => setTab(t.k as any)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                        ${tab === t.k ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    {t.l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Proje Grid */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filtered?.map((p, idx) => (
                                <ServiceProjectCard key={p.id} project={p} index={idx} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filtered?.length === 0 && (
                        <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                            <p className="text-2xl font-black uppercase italic text-slate-200">Bu kategoride henüz proje yok.</p>
                        </div>
                    )}
                </section>

                {/* BOTTOM CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-32 p-12 md:p-20 bg-slate-900 rounded-[4rem] text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none">
                         <span className="text-[20vw] font-black italic text-white uppercase leading-none">QUOTE</span>
                    </div>
                    <h3 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-10 relative z-10">
                        HAYALİNİZDEKİ PROJE <br /> İÇİN <span className="text-orange-500">TEKLİF ALIN</span>
                    </h3>
                    <Link 
                        href="/teklif-al" 
                        className="relative z-10 inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all duration-500 group"
                    >
                        SÜRECİ BAŞLATALIM <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>

            </div>
        </main>
    );
}

function ServiceProjectCard({ project, index }: { project: any, index: number }) {
    const isWide = index % 3 === 0;
    const cover = project.coverUrl || project.images?.[0] || "/placeholder.jpg";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className={`${isWide ? "md:col-span-8" : "md:col-span-4"} group relative h-[450px] overflow-hidden rounded-[2.5rem] bg-slate-100`}
        >
            <Link href={{ pathname: "/proje-detay", query: { id: project.id } }}>
                <Image 
                    src={cover} 
                    alt={project.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                        {project.status === "ongoing" ? 
                            <Clock className="text-orange-500" size={16} /> : 
                            <CheckCircle2 className="text-emerald-500" size={16} />
                        }
                        <span className="text-white font-black uppercase tracking-widest text-[10px]">
                            {project.status === "ongoing" ? "DEVAM EDİYOR" : "TAMAMLANDI"}
                        </span>
                    </div>
                    <h4 className="text-white text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none group-hover:text-orange-500 transition-colors">
                        {project.name}
                    </h4>
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        PROJEYİ İNCELE —&gt;
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}