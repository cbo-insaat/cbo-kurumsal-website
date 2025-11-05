// File: app/proje-detay/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import ProjeDetay from "./ProjeDetay";

export default function ProjeDetayPage() {
  const params = useSearchParams();
  const id = params.get("id") || "";

  return <ProjeDetay projectId={id} />;
}
