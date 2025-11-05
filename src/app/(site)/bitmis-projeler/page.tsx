// File: app/bitmis-projeler/page.tsx
import nextDynamic from "next/dynamic";
import { Suspense } from "react";

export const dynamic = "force-static" as const; // route option
export const revalidate = false;

const BitmisProjelerClient = nextDynamic(() => import("./BitmisProjelerClient"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen grid place-items-center bg-white mt-20">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-400 border-t-transparent" />
    </main>
  ),
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BitmisProjelerClient />
    </Suspense>
  );
}
