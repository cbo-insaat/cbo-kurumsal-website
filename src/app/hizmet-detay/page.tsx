"use client";

import { useSearchParams } from "next/navigation";
import HizmetDetay from "./HizmetDetay";

export default function HizmetDetayPage() {
  const params = useSearchParams();
  const id = params.get("id") || "";

  if (!id) {
    return (
      <main className="min-h-[60vh] grid place-items-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">Hizmet bulunamadı</h1>
          <p className="mt-2 text-gray-600">
            Geçersiz ya da eksik bir bağlantı kullandınız. Lütfen hizmetler sayfasından tekrar deneyin.
          </p>
        </div>
      </main>
    );
  }

  return <HizmetDetay serviceId={id} />;
}
