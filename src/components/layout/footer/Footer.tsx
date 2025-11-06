"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

/** Twitter yerine X logosu (brand) – custom SVG */
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M18.244 2H21L13.98 10.02 22 22h-6.244l-4.86-6.77L5.4 22H3l7.49-8.52L2 2h6.33l4.39 6.1L18.244 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-200">
      {/* üst çizgi – marka rengi */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700" />

      {/* arka plan radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(800px 400px at 20% 0%, rgba(100,116,139,.45), transparent 60%), radial-gradient(700px 300px at 90% 10%, rgba(71,85,105,.35), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Hakkımızda */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo/logobeyaz.png"
              alt="CBO İnşaat Logo"
              width={80}
              height={80}
              className="object-contain rounded-lg"
            />
      
          </div>
          <p className="text-slate-300/90 leading-relaxed">
            CBO İnşaat; inşaat, dekorasyon, çelik kapı, otomotiv ve yapı market alanlarında faaliyet gösterir.
            Müşteri memnuniyeti odaklı yaklaşımıyla yaşam ve çalışma alanlarını yenileyen, dönüştüren ve
            güzelleştiren çözümler üretir.
          </p>
        </div>

        {/* Hızlı Linkler */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <h3 className="text-white font-semibold text-lg mb-4">Hızlı Linkler</h3>
          <ul className="grid grid-cols-2 gap-y-3 text-slate-300">
            <li><Link className="hover:text-white transition hover:scale-105 inline-block" href="/">Anasayfa</Link></li>
            <li><Link className="hover:text-white transition hover:scale-105 inline-block" href="/tum-hizmetler">Hizmetlerimiz</Link></li>
            <li><Link className="hover:text-white transition hover:scale-105 inline-block" href="/tum-projeler">Projelerimiz</Link></li>
            <li><Link className="hover:text-white transition hover:scale-105 inline-block" href="/hakkimizda">Hakkımızda</Link></li>
            <li><Link className="hover:text-white transition hover:scale-105 inline-block" href="/iletisim">İletişim</Link></li>
            <li><Link className="hover:text-white transition hover:scale-105 inline-block" href="/kvkk">KVKK</Link></li>
          </ul>
        </div>

        {/* İletişim + Sosyal */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
          <h3 className="text-white font-semibold text-lg mb-4">İletişim</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-slate-400" />
              <span>19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G KAPAKLI / TEKİRDAĞ</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <a href="tel:05111111111" className="hover:text-white transition">0511 111 11 11</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <a href="mailto:info@cboinsaat.com" className="hover:text-white transition">info@cboinsaat.com</a>
            </li>
          </ul>

          <div className="flex items-center gap-3 mt-6">
            <a
              aria-label="Facebook"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              aria-label="X (Twitter)"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              title="X"
            >
              <XIcon className="w-5 h-5" />
            </a>
            <a
              aria-label="LinkedIn"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              aria-label="Instagram"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* alt bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-slate-400">© {year} CBO. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/gizlilik-politikasi" className="hover:text-white transition">Gizlilik</Link>
            <Link href="/sartlar" className="hover:text-white transition">Şartlar</Link>
            <Link href="/iletisim" className="hover:text-white transition">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}