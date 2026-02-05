"use client";

import { motion, HTMLMotionProps } from "framer-motion"; // HTMLMotionProps eklendi
import Link from "next/link";
import { Shield, Globe, Lock, Send, ChevronRight } from "lucide-react";

const ORG = {
  name: "CBO İnşaat",
  address: "19 Mayıs Mah. Toygar Sk. No: 36G, Kapaklı / Tekirdağ",
  email: "info@cboyapi.com",
  updatedAt: "05.11.2025",
};

// ÇÖZÜM: fadeInUp objesine açıkça tip tanımlıyoruz
const fadeInUp: HTMLMotionProps<"section"> = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function KVKKPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="relative mb-24 border-b border-slate-100 pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-[7vw] md:text-[80px] font-black leading-none uppercase italic tracking-tighter text-slate-900">
              KVKK <br /> 
              <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a] opacity-30">AYDINLATMA</span>
            </h1>
          </motion.div>
          <div className="mt-8 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
               <div className="h-[2px] w-12 bg-orange-500" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">6698 Sayılı Kanun Uyarınca</p>
            </div>
            <p className="text-slate-300 font-mono text-[10px] uppercase tracking-tighter">Son Revizyon: {ORG.updatedAt}</p>
          </div>
        </div>

        {/* SIDE-BY-SIDE CONTENT */}
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: Internal Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 p-10 rounded-[3rem] text-white"
            >
              <Shield className="text-orange-500 mb-6" size={32} />
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Veri Rehberi</h3>
              <ul className="space-y-4">
                {[
                  { t: "Veri Sorumlusu", h: "#sorumlu" },
                  { t: "Veri Kategorileri", h: "#kategoriler" },
                  { t: "Hukuki Sebep", h: "#amac" },
                  { t: "Haklarınız", h: "#haklar" },
                ].map((item, i) => (
                  <li key={i}>
                    <a href={item.h} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors">
                      <ChevronRight size={12} /> {item.t}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <div className="px-8 py-6 border-l-2 border-slate-100 italic text-slate-400 text-sm leading-relaxed">
              "Verileriniz, mimari projelerimizin her bir tuğlası kadar özenle ve güvenle saklanmaktadır."
            </div>
          </aside>

          {/* RIGHT: Main Text */}
          <div className="lg:col-span-8 space-y-32">
            
            {/* 1. Veri Sorumlusu */}
            <motion.section id="sorumlu" {...fadeInUp}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-black italic">01</div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 underline decoration-orange-500/30 decoration-4 underline-offset-8">Veri Sorumlusu</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Ticari Unvan</h4>
                  <p className="text-slate-900 font-black uppercase italic tracking-tight">{ORG.name}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resmi Adres</h4>
                  <p className="text-slate-900 text-sm font-medium">{ORG.address}</p>
                </div>
              </div>
            </motion.section>

            {/* 2. Kategoriler */}
            <motion.section id="kategoriler" {...fadeInUp}>
               <div className="flex items-center gap-4 mb-12">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-black italic">02</div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 underline decoration-orange-500/30 decoration-4 underline-offset-8">İşlenen Veri Grupları</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Kimlik (Ad, Soyad)",
                  "İletişim (Tel, E-posta)",
                  "Müşteri İşlem (Talep içeriği)",
                  "İşlem Güvenliği (IP, Loglar)",
                  "Görsel Veriler (Dosya paylaşımları)"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
                    <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 3. Amaçlar */}
            <motion.section id="amac" {...fadeInUp}>
              <div className="bg-slate-50 p-12 md:p-16 rounded-[4rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full" />
                <div className="flex items-center gap-4 mb-12 relative z-10">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic">03</div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Hukuki Amaçlar</h2>
                </div>
                <div className="space-y-6 relative z-10">
                   {[
                     { t: "Sözleşmenin İfası", d: "Teklif ve proje süreçlerinin yönetilmesi için zorunlu veriler." },
                     { t: "Hukuki Yükümlülük", d: "Fatura ve resmi kayıtların mevzuata uygun tutulması." },
                     { t: "Meşru Menfaat", d: "Sistem güvenliğinin sağlanması ve hizmet kalitesinin artırılması." }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-white rounded-3xl border border-slate-200">
                        <span className="text-slate-900 font-black uppercase italic tracking-tighter text-lg">{item.t}</span>
                        <p className="text-slate-500 text-sm font-medium max-w-sm">{item.d}</p>
                     </div>
                   ))}
                </div>
              </div>
            </motion.section>

            {/* 4. Haklar & Başvuru */}
            <motion.section id="haklar" {...fadeInUp} className="pt-20 border-t border-slate-100">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                   <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-8">KVKK m.11 Haklarınız</h3>
                   <p className="text-slate-500 font-medium leading-relaxed mb-8">
                     Verilerinizin işlenip işlenmediğini öğrenme, hatalı verilerin düzeltilmesini isteme ve verilerinizin silinmesini talep etme hakkına sahipsiniz.
                   </p>
                   <div className="p-8 bg-slate-900 rounded-[3rem] text-white">
                      <Lock className="text-orange-500 mb-6" size={24} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Veri Silme Talebi</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Başvurularınızı ıslak imzalı dilekçe ile ofisimize veya güvenli e-imzalı olarak e-posta adresimize iletebilirsiniz.</p>
                   </div>
                </div>

                <div className="space-y-12">
                   <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Yasal İletişim</span>
                      <a href={`mailto:${ORG.email}`} className="text-2xl font-black uppercase italic text-slate-900 hover:text-orange-500 transition-colors flex items-center gap-4 group">
                        {ORG.email} <Send size={20} className="group-hover:translate-x-2 transition-transform" />
                      </a>
                   </div>
                   <div className="p-10 border-2 border-dashed border-slate-100 rounded-[3rem] flex items-center gap-8">
                      <div className="shrink-0 w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <Globe className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                        Verileriniz Google Firebase <br /> altyapısında güvenle saklanır.
                      </p>
                   </div>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-40 text-center border-t border-slate-50 pt-20"
      >
        <Link 
          href="/iletisim" 
          className="inline-flex items-center gap-8 text-slate-900 font-black uppercase italic tracking-tighter text-3xl md:text-5xl group"
        >
          SORUNUZ MU VAR? 
        </Link>
      </motion.div>
    </main>
  );
}