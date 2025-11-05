// File: app/proje-detay/ProjeDetay.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/firebase/config";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    limit,
} from "firebase/firestore";

type Project = {
    id: string;
    name: string;
    description?: string;
    status?: "ongoing" | "completed";
    serviceId?: string;
    serviceSlug?: string;
    images?: string[];
    coverUrl?: string;
    location?: string;
    startedAt?: Timestamp | null;
    finishedAt?: Timestamp | null;
    createdAt?: Timestamp | null;
};

type Service = {
    id: string;
    name: string;
    slug?: string;
};

type Props = { projectId: string };

export default function ProjeDetay({ projectId }: Props) {
    const [project, setProject] = useState<Project | null>(null);
    const [service, setService] = useState<Service | null>(null);
    const [related, setRelated] = useState<Project[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Basit görsel galerisi
    const images = useMemo(() => {
        if (!project) return [];
        if (project.images && project.images.length > 0) return project.images;
        if (project.coverUrl) return [project.coverUrl];
        return ["/placeholder.jpg"];
    }, [project]);

    const [active, setActive] = useState(0);
    const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
    const next = () => setActive((i) => (i + 1) % images.length);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setError(null);
            setProject(null);
            setService(null);
            setRelated(null);

            try {
                if (!projectId) {
                    setError("Geçersiz proje.");
                    return;
                }

                // 1) Proje
                const pref = doc(db, "projects", projectId);
                const psnap = await getDoc(pref);
                if (!psnap.exists()) {
                    setError("Proje bulunamadı.");
                    return;
                }
                const pdata = psnap.data() as any;
                const p: Project = {
                    id: psnap.id,
                    name: pdata.name,
                    description: pdata.description,
                    status: pdata.status,
                    serviceId: pdata.serviceId,
                    serviceSlug: pdata.serviceSlug,
                    images: pdata.images || [],
                    coverUrl: pdata.coverUrl,
                    location: pdata.location,
                    startedAt: pdata.startedAt ?? null,
                    finishedAt: pdata.finishedAt ?? null,
                    createdAt: pdata.createdAt ?? null,
                };
                if (cancelled) return;
                setProject(p);
                setActive(0);

                // 2) İlgili hizmet (varsa)
                if (p.serviceId) {
                    const sref = doc(db, "services", p.serviceId);
                    const ssnap = await getDoc(sref);
                    if (ssnap.exists()) {
                        const sdata = ssnap.data() as any;
                        if (!cancelled) {
                            setService({
                                id: ssnap.id,
                                name: sdata.name,
                                slug: sdata.slug,
                            });
                        }
                    }
                }

                // 3) İlgili projeler (aynı hizmetten 6 tane)
                if (p.serviceId) {
                    const rq = query(
                        collection(db, "projects"),
                        where("serviceId", "==", p.serviceId),
                        orderBy("createdAt", "desc"),
                        limit(6)
                    );
                    const rs = await getDocs(rq);
                    const rlist: Project[] = rs.docs
                        .filter((d) => d.id !== projectId)
                        .map((d) => {
                            const x = d.data() as any;
                            return {
                                id: d.id,
                                name: x.name,
                                description: x.description,
                                status: x.status,
                                serviceId: x.serviceId,
                                serviceSlug: x.serviceSlug,
                                images: x.images || [],
                                coverUrl: x.coverUrl,
                                location: x.location,
                                createdAt: x.createdAt ?? null,
                            };
                        });
                    if (!cancelled) setRelated(rlist);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("Veriler alınırken bir hata oluştu.");
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [projectId]);

    return (
        <main className="min-h-screen bg-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Üst bar */}
                <div className="mb-6 flex flex-wrap items-center gap-3">

                    {project?.status && (
                        <span
                            className={`text-xs px-2 py-1 rounded-full border ${project.status === "ongoing"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                        >
                            {project.status === "ongoing" ? "Devam Eden" : "Bitmiş"}
                        </span>
                    )}
                    {service && (
                        <Link
                            href={{ pathname: "/hizmetler", query: { id: service.id } }}
                            className="text-xs px-2 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-700 hover:brightness-110"
                        >
                            Hizmet: {service.name}
                        </Link>
                    )}
                </div>

                {/* Hata / Yükleniyor */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}
                {!project && !error && (
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
                {project && (
                    <>
                        {/* Başlık + Galeri + Bilgiler */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Sol: Galeri */}
                            <div className="relative">
                                <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-gray-100 shadow">
                                    <Image
                                        key={images[active]} // blurları tetikler
                                        src={images[active]}
                                        alt={project.name || "Proje görseli"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 600px"
                                    />
                                    {/* Oklar */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prev}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow p-2"
                                                aria-label="Önceki"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={next}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow p-2"
                                                aria-label="Sonraki"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Küçük önizlemeler */}
                                {images.length > 1 && (
                                    <div className="mt-3 grid grid-cols-5 gap-2">
                                        {images.map((src, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActive(i)}
                                                className={`relative h-16 rounded-lg overflow-hidden ring-1 ${i === active ? "ring-blue-400" : "ring-gray-200"
                                                    }`}
                                                aria-label={`Görsel ${i + 1}`}
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`thumb-${i}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="160px"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sağ: Başlık ve detaylar */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                                    <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
                                        {project.name}
                                    </span>
                                </h1>

                                {/* Meta */}
                                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                                    {project.location && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 22s7-5.33 7-12A7 7 0 105 10c0 6.67 7 12 7 12z" stroke="currentColor" strokeWidth="2" />
                                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            {project.location}
                                        </span>
                                    )}
                                    {project.startedAt?.toDate && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            Başlangıç: {project.startedAt.toDate().toLocaleDateString()}
                                        </span>
                                    )}
                                    {project.finishedAt?.toDate && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            Bitiş: {project.finishedAt.toDate().toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                {/* Açıklama */}
                                {project.description && (
                                    <div className="mt-5 text-gray-700 leading-relaxed space-y-3">
                                        {project.description.split("\n").map((p, i) => (
                                            <p key={i} className="text-[15px] md:text-base">
                                                {p.trim()}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Aksiyonlar */}
                                <div className="mt-6 flex flex-wrap gap-3">
                                    {service && (
                                        <Link
                                            href={{ pathname: "/hizmet-detay", query: { id: service.id } }}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#155dfc] text-white font-medium hover:brightness-110"
                                        >
                                            {service.name} hizmetine dön
                                        </Link>
                                    )}
                                    <Link
                                        href="/tum-projeler"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    >
                                        Tüm projeler
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* İlgili projeler */}
                        {related && related.length > 0 && (
                            <section className="mt-12">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    İlgili Projeler
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {related.map((p) => {
                                        const cover = (p.images && p.images[0]) || p.coverUrl || "/placeholder.jpg";
                                        return (
                                            <Link
                                                key={p.id}
                                                href={{ pathname: "/proje-detay", query: { id: p.id } }}
                                                className="rounded-2xl bg-white border border-gray-100 shadow hover:shadow-md transition block"
                                            >
                                                <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                                                    <Image
                                                        src={cover}
                                                        alt={p.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                                                        {p.status && (
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full border ${p.status === "ongoing"
                                                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    }`}
                                                            >
                                                                {p.status === "ongoing" ? "Devam Eden" : "Bitmiş"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {p.location && (
                                                        <p className="mt-1 text-xs text-gray-500">{p.location}</p>
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
