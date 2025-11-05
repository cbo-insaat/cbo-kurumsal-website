// File: app/bitmis-projeler/page.tsx
"use client";

import dynamic from "next/dynamic";

const DevamEdenProjelerClient = dynamic(() => import("./DevamEdenProjelerClient"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen grid place-items-center bg-white mt-20">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-400 border-t-transparent" />
    </main>
  ),
});

export default function Page() {
  return <DevamEdenProjelerClient />;
}