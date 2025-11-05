// File: app/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasHero, setHasHero] = useState(false);

  useEffect(() => {
    // Sayfada [data-hero] var mı? (Ana sayfa gibi hero üstünde transparan görünüm için)
    setHasHero(!!document.querySelector("[data-hero]"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobil açılıyken body scroll kilidi (opsiyonel ama iyi deneyim)
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const linkColor = scrolled ? "text-gray-900" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 w-full transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"
        } z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/logo.png"
            alt="CBO İnşaat Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </Link>

        {/* Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`font-medium transition-colors ${linkColor} hover:text-blue-600`}
          >
            Anasayfa
          </Link>

          <Link
            href="/tum-hizmetler"
            className={`font-medium transition-colors ${linkColor} hover:text-blue-600`}
          >
            Hizmetler
          </Link>

          {/* Projeler + hover dropdown */}
          <div className="relative group">
            <Link
              href="/tum-projeler"
              className={`font-medium transition-colors ${linkColor} hover:text-blue-600`}
            >
              Projeler
            </Link>
            <div className="absolute left-0 top-full hidden group-hover:block focus-within:block">
              <div className="pt-2">
                <div className="w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <ul className="py-2 text-sm text-gray-800">
                    <li>
                      <Link
                        href="/bitmis-projeler"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 16.2l-3.5-3.5L3 15.2l6 6L21 9.2l-2.5-2.5L9 16.2z" fill="currentColor" />
                        </svg>
                        <span>Bitmiş Projeler</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/devam-eden-projeler"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M12 6V3L8 7l4 4V8a5 5 0 110 10 5 5 0 01-4.9-4H5a7 7 0 006.9 6 7 7 0 000-14z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Devam Eden Projeler</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/hakkimizda"
            className={`font-medium transition-colors ${linkColor} hover:text-blue-600`}
          >
            Hakkımızda
          </Link>

          <Link
            href="/iletisim"
            className={`font-medium transition-colors ${linkColor} hover:text-blue-600`}
          >
            İletişim
          </Link>
        </nav>

        {/* Masaüstü CTA */}
        <Link
          href="/teklif-al"
          className="hidden md:inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Teklif Al
        </Link>

        {/* Mobil Hamburger */}
        <button
          aria-label="Menüyü Aç/Kapat"
          className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg ${scrolled ? "text-gray-900" : "text-white"
            }`}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            // X icon
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobil Menü (slide-in) */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        aria-hidden={!mobileOpen}
      >
        {/* Arka plan blur + karartma */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-[84%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          role="dialog"
          aria-label="Mobil menü"
        >
          <div className="px-6 pt-4 pb-6 flex items-center justify-between border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <Image
                src="/logo/logo.png"
                alt="CBO İnşaat Logo"
                width={90}
                height={90}
                className="object-contain"
              />
            </Link>
            <button
              aria-label="Menüyü kapat"
              className="w-10 h-10 inline-flex items-center justify-center text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="px-6 py-4 space-y-1 text-gray-900 text-base">
            <li>
              <Link
                href="/"
                className="block px-3 py-3 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                Anasayfa
              </Link>
            </li>
            <li>
              <Link
                href="/tum-hizmetler"
                className="block px-3 py-3 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                Hizmetler
              </Link>
            </li>

            {/* Projeler + alt linkler */}
            <li className="pt-2">
              <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Projeler
              </div>
              <Link
                href="/tum-projeler"
                className="block px-3 py-3 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                Tüm Projeler
              </Link>
              <div className="mt-1 grid grid-cols-1 gap-1 pl-1">
                <Link
                  href="/bitmis-projeler"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  ✓ Bitmiş Projeler
                </Link>
                <Link
                  href="/devam-eden-projeler"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  ↻ Devam Eden Projeler
                </Link>
              </div>
            </li>

            <li className="pt-2">
              <Link
                href="/hakkimizda"
                className="block px-3 py-3 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/iletisim"
                className="block px-3 py-3 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                İletişim
              </Link>
            </li>
          </ul>

          {/* Mobil CTA */}
          <div className="px-6 pb-8 mt-2">
            <Link
              href="/teklif-al"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Teklif Al
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
