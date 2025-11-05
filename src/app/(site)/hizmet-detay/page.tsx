import { Suspense } from "react";
import QueryBridge from "./QueryBridge";

export const dynamic = "force-static"; // static export ile uyumlu

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center bg-white mt-20">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-400 border-t-transparent" />
        </main>
      }
    >
      <QueryBridge />
    </Suspense>
  );
}
