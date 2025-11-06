// File: app/hizmet-detay/HizmetDetay.tsx
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
} from "firebase/firestore";

type Service = {
    id: string;
    name: string;
    description: string;
    slug?: string;
    imageUrl?: string;
    createdAt?: Timestamp | null;
};

type Project = {
    id: string;
    name?: string;
    title?: string;
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

type Props = {
    serviceId: string;
};

export default function HizmetDetay({ serviceId }: Props) {
    const [service, setService] = useState<Service | null>(null);
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [tab, setTab] = useState<"all" | "ongoing" | "completed">("all");
    const [error, setError] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!projects) return null;
        if (tab === "all") return projects;
        return projects.filter((p) => p.status === (tab === "ongoing" ? "ongoing" : "completed"));
    }, [projects, tab]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setError(null);
            setService(null);
            setProjects(null);

            try {
                // 1) Hizmet
                const ref = doc(db, "services", serviceId);
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    if (!cancelled) setError("Hizmet kaydı bulunamadı.");
                    return;
                }
                const sdata = snap.data() as any;
                const svc: Service = {
                    id: snap.id,
                    name: sdata.name,
                    description: sdata.description,
                    slug: sdata.slug,
                    imageUrl: sdata.imageUrl,
                    createdAt: sdata.createdAt ?? null,
                };
                if (!cancelled) setService(svc);

                // 2) Projeler: önce serviceId
                const q1 = query(
                    collection(db, "projects"),
                    where("serviceId", "==", serviceId),
                    orderBy("createdAt", "desc")
                );
                const r1 = await getDocs(q1);
                let list: Project[] = r1.docs.map((d) => {
                    const x = d.data() as any;
                    return {
                        id: d.id,
                        name: x.name || x.title,
                        title: x.title,
                        description: x.description,
                        status: x.status,
                        serviceId: x.serviceId,
                        serviceSlug: x.serviceSlug,
                        images: x.images || [],
                        coverUrl: x.coverUrl,
                        location: x.location,
                        startedAt: x.startedAt ?? null,
                        finishedAt: x.finishedAt ?? null,
                        createdAt: x.createdAt ?? null,
                    };
                });

                // 3) Hiç çıkmazsa slug ile dene
                if (list.length === 0 && svc.slug) {
                    const q2 = query(
                        collection(db, "projects"),
                        where("serviceSlug", "==", svc.slug),
                        orderBy("createdAt", "desc")
                    );
                    const r2 = await getDocs(q2);
                    list = r2.docs.map((d) => {
                        const x = d.data() as any;
                        return {
                            id: d.id,
                            name: x.name || x.title,
                            title: x.title,
                            description: x.description,
                            status: x.status,
                            serviceId: x.serviceId,
                            serviceSlug: x.serviceSlug,
                            images: x.images || [],
                            coverUrl: x.coverUrl,
                            location: x.location,
                            startedAt: x.startedAt ?? null,
                            finishedAt: x.finishedAt ?? null,
                            createdAt: x.createdAt ?? null,
                        };
                    });
                }

                if (!cancelled) setProjects(list);
            } catch (e: any) {
                console.error(e);
                if (!cancelled) setError("Veriler alınırken bir hata oluştu.");
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [serviceId]);

    return (
        <main className="min-h-screen bg-white mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Üst başlık alanı — loading */}
                {!service && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="relative h-64 rounded-2xl bg-gray-100 animate-pulse" />
                        <div className="animate-pulse">
                            <div className="h-8 w-64 bg-gray-200 rounded" />
                            <div className="mt-3 h-4 w-96 bg-gray-200 rounded" />
                            <div className="mt-2 h-4 w-80 bg-gray-200 rounded" />
                            <div className="mt-2 h-4 w-72 bg-gray-200 rounded" />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Üst başlık alanı — tasarım */}
                {service && (
                    <>
                        <section className="rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-white to-slate-50 p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                                {/* Sol: Görsel */}
                                <div className="relative">
                                    <div className="relative h-64 md:h-full min-h-[260px] w-full overflow-hidden rounded-xl ring-2 ring-slate-200 shadow-lg">
                                        <Image
                                            src={service.imageUrl || "/placeholder.jpg"}
                                            alt={service.name || "Hizmet görseli"}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 600px"
                                        />
                                    </div>
                                </div>

                                {/* Sağ: İçerik paneli */}
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                                        <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
                                            {service.name}
                                        </span>
                                    </h1>

                                    {/* Açıklama */}
                                    <div className="mt-5 text-gray-700 leading-relaxed space-y-3">
                                        {service.description?.split("\n").map((p, i) => (
                                            <p key={i} className="text-[15px] md:text-base">
                                                {p.trim()}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Sekmeler */}
                        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
                            {[
                                { key: "all", label: "Tümü" },
                                { key: "ongoing", label: "Devam Eden" },
                                { key: "completed", label: "Bitmiş" },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key as any)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                                        tab === t.key
                                            ? "bg-slate-600 text-white border-slate-600 shadow-md"
                                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Proje listesi */}
                        <section id="projeler" className="mt-10">
                            {projects === null && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-md border border-gray-100">
                                            <div className="h-48 w-full rounded-xl bg-gray-200" />
                                            <div className="mt-4 h-5 w-3/4 bg-gray-200 rounded" />
                                            <div className="mt-2 h-4 w-full bg-gray-200 rounded" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {projects && projects.length === 0 && (
                                <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-slate-600 bg-slate-50">
                                    <p className="text-lg">Bu hizmete bağlı proje bulunmuyor.</p>
                                </div>
                            )}

                            {filtered && filtered.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filtered.map((p) => {
                                        const title = p.name || p.title || "Proje";
                                        const cover =
                                            (p.images && p.images[0]) ||
                                            p.coverUrl ||
                                            "/placeholder.jpg";

                                        return (
                                            <Link
                                                key={p.id}
                                                href={{ pathname: "/proje-detay", query: { id: p.id } }}
                                                className="
                                                    group block focus:outline-none
                                                    rounded-2xl bg-white shadow-lg border border-gray-100
                                                    transition-all duration-300
                                                    hover:-translate-y-1 hover:shadow-2xl
                                                    overflow-hidden
                                                "
                                            >
                                                <div className="relative h-48 w-full">
                                                    <Image
                                                        src={cover}
                                                        alt={title}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                                    />
                                                    {p.status && (
                                                        <span
                                                            className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full border font-medium ${
                                                                p.status === "ongoing"
                                                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                                                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                            }`}
                                                        >
                                                            {p.status === "ongoing" ? "Devam" : "Tamamlandı"}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                                                        {title}
                                                    </h3>
                                                    {p.location && (
                                                        <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M12 22s7-5.33 7-12A7 7 0 105 10c0 6.67 7 12 7 12z" />
                                                                <circle cx="12" cy="10" r="3" />
                                                            </svg>
                                                            {p.location}
                                                        </p>
                                                    )}
                                                    {p.description && (
                                                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                                                            {p.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="px-5 pb-4">
                                                    <span
                                                        className="
                                                            inline-flex items-center text-sm font-medium text-slate-600
                                                            opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                                                            transition-all duration-300
                                                        "
                                                    >
                                                        Projeyi İncele
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
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}