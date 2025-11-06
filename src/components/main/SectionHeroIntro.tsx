// File: app/components/SectionHeroIntro.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase/config";
import {
    collection,
    query,
    where,
    getCountFromServer, // <-- önemli
} from "firebase/firestore";

type Stat = { label: string; value: string | number; icon?: React.ReactNode };

type Props = {
    title?: string;
    subtitle?: string;
    stats?: Stat[]; // dışarıdan stat verirsen yine animasyon çalışır
    ctaHref?: string;
    ctaText?: string;
    imageUrl?: string;
};

/** Basit sayıcı: 0'dan hedef değere kadar animasyon */
function CountUp({ value, duration = 1200 }: { value: string | number; duration?: number }) {
    const [current, setCurrent] = useState(0);

    // "1000+", "1.2M" gibi değerlerde sayısal kısmı ve son eki ayır
    const { target, suffix } = useMemo(() => {
        const s = String(value).trim();
        const match = s.match(/^(\d+(?:[.,]\d+)*)\s*([^\d]*)$/);
        if (!match) return { target: Number(s) || 0, suffix: "" };
        const numeric = Number(match[1].replace(/\./g, "").replace(",", ".")); // TR sayıları da destekle
        const suf = (match[2] || "").trim();
        return { target: isNaN(numeric) ? 0 : numeric, suffix: suf };
    }, [value]);

    useEffect(() => {
        let raf = 0;
        let start: number | null = null;
        const animate = (t: number) => {
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setCurrent(Math.floor(eased * target));
            if (p < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);

    return (
        <>
            {current.toLocaleString("tr-TR")}
            {suffix ? suffix : ""}
        </>
    );
}

export default function SectionHeroIntro({
    title = "Ustalığın ve Teknolojinin Buluştuğu",
    subtitle = "CBO İnşaat olarak konut, ofis ve iç dekorasyon projelerinde uçtan uca çözüm sunuyor; mimari tasarımdan uygulamaya kadar tüm süreci tek çatı altında yönetiyoruz. Dayanıklı malzeme, şeffaf süreç ve zamanında teslim ilkeleriyle güvenilir yapılar inşa ediyoruz.",
    stats: initialStats = [
        { label: "Tamamlanan Proje", value: "0+" }, // DB'den güncellenecek
        { label: "Mutlu Müşteri", value: "1000+" },
    ],
    ctaHref = "/iletisim",
    ctaText = "Teklif Al",
    imageUrl = "/images/hero-insaat.jpg",
}: Props) {
    const [stats, setStats] = useState<Stat[]>(initialStats);

    // Firestore'dan tamamlanan proje sayısını çek
    useEffect(() => {
        (async () => {
            try {
                const q = query(
                    collection(db, "projects"),
                    where("status", "in", ["finished", "finished"]) // gerekirse "finished" vb. ekleyebilirsin
                );
                const snapshot = await getCountFromServer(q);
                const count = snapshot.data().count || 0;

                setStats((prev) => {
                    // "Tamamlanan Proje" öğesini yakalayıp güncelle
                    const idx = prev.findIndex((s) => s.label.toLowerCase().includes("tamamlanan"));
                    const next = [...prev];
                    if (idx >= 0) {
                        // Sonuna "+" ekleyerek eski görsel dili koruyalım
                        next[idx] = { ...next[idx], value: `${count}+` };
                    } else {
                        next.unshift({ label: "Tamamlanan Proje", value: `${count}+` });
                    }
                    return next;
                });
            } catch (e) {
                // sessiz geç; stat 0 kalır
                console.error("Tamamlanan proje sayısı alınamadı:", e);
            }
        })();
    }, []);

    return (
        <section className="relative py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
                {/* Sol: Metin */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
                        <span className="block">Güvenilir Yapılar,</span>
                        <span className="bg-gradient-to-r from-slate-500 to-slate-300 bg-clip-text text-transparent">
                            CBO İnşaat İmzasıyla
                        </span>
                    </h1>

                    <p className="mt-5 text-lg text-slate-700 max-w-2xl">{subtitle}</p>

                    {/* İstatistikler */}
                    <div className="mt-8 grid sm:grid-cols-2 gap-5 max-w-xl">
                        {stats.map((s, i) => (
                            <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow p-5">
                                <div className="text-3xl font-extrabold text-slate-900">
                                    <CountUp value={s.value} />
                                </div>
                                <div className="mt-1 text-sm text-gray-600">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold bg-slate-600 text-white hover:bg-slate-700 transform hover:scale-105 transition duration-300 ease-in-out shadow-md"
                        >
                            {ctaText}
                        </Link>
                    </div>
                </div>

                {/* Sağ: Görsel + rozet */}
                <div className="relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                        <Image
                            src="/intro/intro.jpg"
                            alt="Şantiyede proje planı inceleyen CBO İnşaat ekibi"
                            width={960}
                            height={700}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>

                    {/* Köşe rozet kartı */}
                    <div className="absolute -bottom-5 left-5">
                        <div className="flex items-center gap-4 bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100 px-5 py-4">
                            <div className="h-11 w-11 rounded-xl bg-slate-600 text-white grid place-items-center text-lg font-bold">
                                25
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900">Yıl</div>
                                <div className="text-xs text-gray-600">Sektör Deneyimi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}