// app/admin/panel/components/DashboardStats.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config";

export default function DashboardStats() {
  const [counts, setCounts] = useState({ projects: 0, sliders: 0, services: 0, teklifler: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [p, s, sv, t] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "sliders")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "teklifler")),
      ]);
      setCounts({
        projects: p.size,
        sliders: s.size,
        services: sv.size,
        teklifler: t.size,
      });
    };
    fetch();
  }, []);

  const stats = [
    { title: "Toplam Proje", count: counts.projects, color: "bg-blue-500" },
    { title: "Slider", count: counts.sliders, color: "bg-amber-500" },
    { title: "Hizmet", count: counts.services, color: "bg-green-500" },
    { title: "Gelen Teklif", count: counts.teklifler, color: "bg-purple-500" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border">
          <div className={`w-12 h-12 ${s.color} rounded-xl mb-4`}></div>
          <p className="text-slate-600 text-sm">{s.title}</p>
          <p className="text-3xl font-bold text-slate-800">{s.count}</p>
        </div>
      ))}
    </div>
  );
}