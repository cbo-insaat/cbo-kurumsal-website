import { Suspense } from "react";
import Bitmis from "./Bitmis";

export const dynamic = "force-static"; // static export için güvenli

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-slate-900">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-amber-400 border-t-transparent" />
        </main>
      }
    >
      <Bitmis />
    </Suspense>
  );
}
