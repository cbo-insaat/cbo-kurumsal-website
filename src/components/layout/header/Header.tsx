"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Sayfa kontrolü için eklendi
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname(); // Mevcut yolu alıyoruz
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Sadece ana sayfada mı kontrolü
  const isHomePage = pathname === "/";

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > lastY && y > 150);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const navLinks = [
    { name: "Hizmetler", href: "/tum-hizmetler" },
    { name: "Projeler", href: "/tum-projeler" },
    { name: "Haberler", href: "/tum-haberler" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
  ];

  // Renk mantığı: Ana sayfadaysak scroll'a bak, değilsek hep "scrolled" (beyaz tema) gibi davran
  const isDarkTheme = isHomePage && !scrolled && !mobileOpen;
  const headerBg = isDarkTheme ? "bg-transparent py-8" : "bg-white/90 backdrop-blur-md shadow-sm py-4";
  const textColor = isDarkTheme ? "text-white" : "text-slate-900";
  const logoSrc = isDarkTheme ? "/logo/logobeyaz.png" : "/logo/logo.png";
  const ctaClass = isDarkTheme
    ? "bg-white text-slate-900 hover:bg-orange-500 hover:text-white"
    : "bg-slate-900 text-white hover:bg-orange-500";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
        ${hidden ? "-translate-y-full" : "translate-y-0"} ${headerBg}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">

          {/* LOGO AREA */}
          <Link href="/" className="relative z-[60] group" onClick={() => setMobileOpen(false)}>
            <div className="relative h-12 w-32 md:w-40">
              <Image
                src={logoSrc}
                alt="CBO İnşaat"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300 relative group ${textColor}`}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & HAMBURGER */}
          <div className="flex items-center gap-6">
            <Link
              href="/teklif-al"
              className={`hidden md:flex h-12 px-8 items-center justify-center rounded-full font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${ctaClass}`}
            >
              Teklif Al
            </Link>

            {/* HAMBURGER BUTTON - z-60 sayesinde menü üstünde kalır */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none group"
            >
              <span className={`h-[2px] w-8 transition-all duration-300 
                ${mobileOpen ? "rotate-45 translate-y-2 bg-slate-900" : (isDarkTheme ? "bg-white" : "bg-slate-900")}`}
              />
              <span className={`h-[2px] w-8 transition-all duration-300 
                ${mobileOpen ? "opacity-0" : (isDarkTheme ? "bg-white" : "bg-slate-900")}`}
              />
              <span className={`h-[2px] w-8 transition-all duration-300 
                ${mobileOpen ? "-rotate-45 -translate-y-2 bg-slate-900" : (isDarkTheme ? "bg-white" : "bg-slate-900")}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-white flex flex-col justify-center px-12"
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              <span className="absolute w-6 h-[2px] bg-slate-900 rotate-45"></span>
              <span className="absolute w-6 h-[2px] bg-slate-900 -rotate-45"></span>
            </button>



            <nav className="relative z-10 flex flex-col gap-6">
              {/* Mobil menüde Anasayfa'yı da eklemek iyi olabilir */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 hover:text-orange-500 transition-colors"
                >
                  Anasayfa
                </Link>
              </motion.div>
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 hover:text-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-20 border-t border-slate-100 pt-10 flex flex-col gap-4 relative z-10">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Bize Ulaşın</span>
              <a href="mailto:info@cbo.com" className="text-xl font-bold text-slate-900">info@cbo.com</a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}