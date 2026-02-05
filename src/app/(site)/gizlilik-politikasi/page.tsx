"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Eye, Lock, Database, RefreshCcw, Mail, ArrowRight } from "lucide-react";

const ORG = {
  name: "CBO İnşaat",
  address: "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G, KAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
  updatedAt: "05.11.2025",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* HEADER SECTION */}
        <div className="relative mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-[8vw] md:text-[90px] font-black leading-none uppercase italic tracking-tighter text-slate-900">
              GİZLİLİK <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a] opacity-30">POLİTİKASI</span>
            </h1>
          </motion.div>
          <div className="mt-8 flex items-center gap-6">
            <div className="h-[1px] w-20 bg-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Sürüm: {ORG.updatedAt}
            </p>
          </div>
        </div>

        {/* QUICK NAVIGATION */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-24"
        >
          {[
            { t: "Genel", h: "#genel" },
            { t: "Veri Toplama", h: "#toplama" },
            { t: "Kullanım", h: "#kullanim" },
            { t: "Güvenlik", h: "#saklama-guvenlik" },
            { t: "İletişim", h: "#iletisim" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.h}
              className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              {item.t}
            </a>
          ))}
        </motion.nav>

        {/* CONTENT SECTIONS */}
        <div className="space-y-32">

          {/* 1. Genel & Vizyon */}
          <motion.section id="genel" {...fadeInUp}>
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white italic font-black">01</div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Genel Yaklaşım</h2>
                </div>
                <p className="text-slate-600 font-medium leading-loose text-lg">
                  CBO Yapı olarak, dijital dünyadaki varlığınızın güvenliğini en az inşa ettiğimiz binaların sağlamlığı kadar önemsiyoruz. Kişisel verilerinizin gizliliği, kurumsal şeffaflık ilkelerimizin temelidir.
                </p>
                <div className="mt-8">
                  <Link href="/kvkk" className="inline-flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-xs group">
                    KVKK AYDINLATMA METNİNE GİT <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                  <ShieldCheck size={40} className="text-slate-900 mb-6" />
                  <p className="text-slate-500 text-sm italic font-medium">
                    "Sitemizde üyelik sistemi yoktur. Sadece formlar aracılığıyla ilettiğiniz bilgiler, talebiniz kapsamında işlenir."
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 2. Toplanan Veriler (Infographic Style) */}
          <motion.section id="toplama" {...fadeInUp}>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white italic font-black">02</div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">İşlenen Veri Grupları</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Mail, t: "İletişim", d: "Ad-soyad, e-posta, telefon ve mesaj içeriğiniz." },
                { icon: Database, t: "Log Verileri", d: "IP adresi, tarayıcı türü ve ziyaret zamanı." },
                { icon: Eye, t: "Etkileşim", d: "Görüntülenen blog içerikleri ve yönlendirme verileri." }
              ].map((item, i) => (
                <div key={i} className="p-10 border border-slate-100 rounded-[2.5rem] hover:bg-slate-50 transition-all group">
                  <item.icon className="text-orange-500 mb-6 group-hover:scale-110 transition-all" size={32} />
                  <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-4">{item.t}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.d}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 3. Saklama & Firebase */}
          <motion.section id="saklama-guvenlik" {...fadeInUp}>
            <div className="bg-slate-900 p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 italic font-black">03</div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Veri Güvenliği</h2>
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed mb-8">
                    Verileriniz endüstri standardı olan <strong>Google Firebase</strong> altyapısında, yüksek güvenlikli şifreleme yöntemleri ile saklanır.
                  </p>
                  <ul className="space-y-4">
                    {["Uçtan Uca Şifreleme", "Erişim Yetkilendirme", "Periyodik Silme Politiikası"].map((l, i) => (
                      <li key={i} className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-[10px]">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" /> {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-64 h-64 border border-dashed border-white/10 rounded-full flex items-center justify-center"
                  >
                    <Lock size={60} className="text-white/20" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 4. Haklar & İletişim */}
          <motion.section id="iletisim" {...fadeInUp} className="pt-20 border-t border-slate-100">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-6">Veri Haklarınız</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  Kişisel verilerinizin silinmesini, güncellenmesini veya işlenip işlenmediğini öğrenme hakkına sahipsiniz. Tüm taleplerinizi resmi adresimize yazılı olarak iletebilirsiniz.
                </p>
                <div className="flex items-center gap-4">
                  <RefreshCcw className="text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verileriniz kontrolünüz altında.</span>
                </div>
              </div>

              <div className="bg-slate-50 p-10 rounded-[3rem] space-y-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resmi İletişim</span>
                  <a href={`mailto:${ORG.email}`} className="text-xl font-black uppercase italic text-slate-900 hover:text-orange-500 transition-colors">{ORG.email}</a>
                </div>
                <div className="h-[1px] w-full bg-slate-200" />
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {ORG.address} <br /> {ORG.phone}
                </p>
              </div>
            </div>
          </motion.section>

        </div>

        {/* BOTTOM CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center"
        >
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-6 px-12 py-6 bg-slate-900 rounded-full text-white font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all duration-500 group"
          >
            BİR SORUNUZ MU VAR? <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </main>
  );
}