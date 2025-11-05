"use client";

import { useSearchParams } from "next/navigation";
import HaberBlogDetay from "./HaberBlogDetay";

export default function QueryBridge() {
  const params = useSearchParams(); // Artık Suspense altında render ediliyor
  const id = params.get("id") ?? "";
  return <HaberBlogDetay postId={id} />;
}
