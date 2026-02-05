"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

/** Twitter yerine X logosu */
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
    <footer className="relative bg-slate-950 text-white pt-24 pb-12 overflow-hidden">
      {/* Arka Plan Dekoratif - Büyük Marka Yazısı (Transparent Outline) */}
      <div className="absolute -bottom-10 left-0 w-full pointer-events-none select-none opacity-5">
        <h2 className="text-[25vw] font-black leading-none uppercase italic text-transparent [-webkit-text-stroke:2px_#fff]">
          CBO YAPI
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">

          {/* SOL: Marka Vizyon */}
          <div className="lg:col-span-5">
            <Image
              src="/logo/logobeyaz.png"
              alt="CBO İnşaat"
              width={100}
              height={100}
              className="mb-8 opacity-90"
            />
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              Geleceğin yapılarını bugünden, estetik ve mühendisliğin kusursuz uyumuyla inşa ediyoruz.
            </p>

            <div className="flex gap-4 mt-10">
              {[
                { icon: <Facebook size={20} />, href: "#" },
                { icon: <XIcon className="w-5 h-5" />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* SAĞ: Link Grupları */}
          <div className="lg:col-span-7 grid md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs mb-8">Kurumsal</h4>
              <ul className="space-y-4">
                {[
                  { name: "Anasayfa", href: "/" },
                  { name: "Hakkımızda", href: "/hakkimizda" },
                  { name: "Hizmetlerimiz", href: "/tum-hizmetler" },
                  { name: "Projelerimiz", href: "/tum-projeler" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                      {item.name}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

            </div>

            <div>
              <h4 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs mb-8">Yasal</h4>
              <ul className="space-y-4">
                {[
                  { name: "KVKK", href: "/kvkk" },
                  { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
                  { name: "Şartlar", href: "/sartlar" },
                  { name: "İletişim", href: "/iletisim" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

            </div>

            <div>
              <h4 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs mb-8">Bize Ulaşın</h4>
              <p className="text-slate-300 text-sm leading-loose">
                19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. <br /> NO: 36G KAPAKLI / TEKİRDAĞ
              </p>
              <div className="mt-6">
                <a href="tel:05111111111" className="block text-xl font-bold hover:text-orange-500 transition-colors">
                  0511 111 11 11
                </a>
                <a href="mailto:info@cboinsaat.com" className="text-slate-400 hover:text-white transition-colors">
                  info@cboinsaat.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ALT BAR: Minimalist */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © {year} CBO İNŞAAT. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <div className="h-1 w-12 bg-orange-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}