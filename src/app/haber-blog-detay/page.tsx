// File: app/haber-blog-detay/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import HaberBlogDetay from "./HaberBlogDetay";

export default function HaberBlogDetayPage() {
  const params = useSearchParams();
  const id = params.get("id") || "";

  return <HaberBlogDetay postId={id} />;
}
