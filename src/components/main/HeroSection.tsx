"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import type { SliderItem } from "@/types/slider";
import HeroSlider from "./HeroSlider";

export default function HomePage() {
  const [items, setItems] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // aktif slider'ları order alanına göre artan sırada getir
    const q = query(
      collection(db, "sliders"),
      where("active", "==", true),
      orderBy("order", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: SliderItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as SliderItem),
        }));
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error("Slider fetch error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <main className="relative">
        <section className="relative h-screen flex items-center justify-center bg-slate-100">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-400 border-t-transparent" />
        </section>
      </main>
    );
  }

  return (
    <main className="relative  " data-hero>
      <HeroSlider items={items} />
    </main>
  );
}
