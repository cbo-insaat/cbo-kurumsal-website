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
    name?: string;          // bazı kayıtlarda name yok
    title?: string;         // admin formu title ile kaydediyor
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
                        name: x.name || x.title, // <-- kritik düzeltme
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
                            name: x.name || x.title, // <-- kritik düzeltme
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
        <main className="min-h-screen bg-white">
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
                        <section
                            className="
                rounded-2xl border border-gray-100 shadow-sm
                bg-gradient-to-br from-white to-[#f7fbff]
                p-4 md:p-6
              "
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                                {/* Sol: Görsel */}
                                <div className="relative">
                                    <div className="relative h-64 md:h-full min-h-[260px] w-full overflow-hidden rounded-xl ring-1 ring-gray-100 shadow-md">
                                        <Image
                                            src={service.imageUrl || "/placeholder.jpg"}
                                            alt={service.name || "Hizmet görseli"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 600px"
                                        />
                                    </div>
                                </div>

                                {/* Sağ: İçerik paneli */}
                                <div className="flex flex-col">
                                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                                        <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
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
                        <div className="mt-10 flex items-center justify-center gap-2">
                            {[
                                { key: "all", label: "Tümü" },
                                { key: "ongoing", label: "Devam Eden" },
                                { key: "completed", label: "Bitmiş" },
                            ].map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${tab === t.key
                                            ? "bg-[#155dfc] text-white border-[#155dfc]"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Proje listesi */}
                        <section id="projeler" className="mt-8">
                            {projects === null && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                                            <div className="h-40 w-full rounded-lg bg-gray-200" />
                                            <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded" />
                                            <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {projects && projects.length === 0 && (
                                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                                    Bu hizmete bağlı proje bulunmuyor.
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
                                            <Link key={p.id}
                                                href={{ pathname: "/proje-detay", query: { id: p.id } }} className="rounded-2xl bg-white border border-gray-100 shadow hover:shadow-md transition">
                                                <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                                                    <Image
                                                        src={cover}
                                                        alt={title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900">{title}</h3>
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

                                                    {p.description && (
                                                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                                            {p.description}
                                                        </p>
                                                    )}
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
