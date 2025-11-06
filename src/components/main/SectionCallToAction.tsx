// File: app/components/SectionCallToAction.tsx
"use client";

import Link from "next/link";

export default function SectionCallToAction() {
  return (
    <section className="relative bg-gradient-to-r from-slate-600 to-slate-300 text-white py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Başlık */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Projenizi Hayata Geçirmeye Hazır mısınız?
        </h2>

        {/* Alt açıklama */}
        <p className="max-w-2xl mx-auto text-lg text-white/90 mb-8">
          Uzman ekibimizle birlikte hayalinizdeki yapıyı gerçeğe dönüştürün. 
          Ücretsiz keşif ve teklif için hemen iletişime geçin.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/teklif-al"
            className="inline-block px-8 py-3 rounded-xl bg-white text-slate-600 font-semibold hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Ücretsiz Teklif Al
          </Link>

          <Link
            href="/tum-projeler"
            className="inline-block px-8 py-3 rounded-xl border border-white font-semibold hover:bg-white hover:text-slate-600 transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Projelerimizi İncele
          </Link>
        </div>
      </div>

      {/* Dekoratif dalga efekti (isteğe bağlı) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(133%+1.3px)] h-[50px]"
        >
          <path
            d="M321.39,56.24c58-10.79,114.16-30.09,172-41.86,82-16.78,168-17.73,250,0,86.68,18.59,172,57.59,258.68,75.69,89.86,18.77,183.91,8.93,271.93-18.25V120H0V16.48A600.21,600.21,0,0,0,321.39,56.24Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}