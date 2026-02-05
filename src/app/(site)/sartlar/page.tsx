"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scale, ShieldCheck, FileText, Globe, Gavel, Mail } from "lucide-react";

const ORG = {
  name: "CBO İnşaat",
  updatedAt: "05.11.2025",
};

const containerVariants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TermsPage() {
  return (
      <main className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="relative mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-[8vw] md:text-[90px] font-black leading-none uppercase italic tracking-tighter text-slate-900">
              ŞARTLAR & <br /> 
              <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a] opacity-30">KOŞULLAR</span>
            </h1>
          </motion.div>
          <div className="mt-8 flex items-center gap-6">
            <div className="h-[1px] w-20 bg-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Son Güncelleme: {ORG.updatedAt}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: Sticky Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <motion.nav 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100"
            >
              <h3 className="text-slate-900 font-black uppercase italic tracking-tighter text-xl mb-6">İçindekiler</h3>
              <ul className="space-y-3">
                {[
                  { t: "Kapsam", h: "#kapsam" },
                  { t: "Site Kullanımı", h: "#kullanim" },
                  { t: "Teklif & Sözleşme", h: "#teklif" },
                  { t: "Fikri Mülkiyet", h: "#fikri" },
                  { t: "Gizlilik & Hukuk", h: "#hukuk" },
                ].map((item, i) => (
                  <li key={i}>
                    <a 
                      href={item.h} 
                      className="group flex items-center justify-between text-slate-500 hover:text-orange-500 transition-colors py-2 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <span>0{i + 1}. {item.t}</span>
                      <div className="h-[1px] w-0 group-hover:w-8 bg-orange-500 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </aside>

          {/* RIGHT: Content Sections */}
          <div className="lg:col-span-8 space-y-32">
            
            {/* 1. Kapsam */}
            <motion.section id="kapsam" {...itemVariants} whileInView="whileInView" initial="initial" viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white italic font-black">01</div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Kapsam ve Tanımlar</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-loose">
                <p>
                  Bu şartlar, <strong>{ORG.name}</strong> dijital varlıklarının kullanımını ve hizmet taleplerinizin yasal çerçevesini belirler. Sitemizi kullanarak, bu koşulları peşinen kabul etmiş sayılırsınız.
                </p>
                <div className="mt-8 p-8 bg-slate-50 rounded-[2rem] border-l-4 border-orange-500 italic">
                  "CBO Yapı, dijital platformu üzerinden sadece bilgilendirme ve ön talep toplama hizmeti sunar."
                </div>
              </div>
            </motion.section>

            {/* 2. Site Kullanımı */}
            <motion.section id="kullanim" {...itemVariants} whileInView="whileInView" initial="initial" viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white italic font-black">02</div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Kullanım Kuralları</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Globe, t: "Global Erişim", d: "Sitedeki içerikler genel bilgilendirme amaçlıdır." },
                  { icon: ShieldCheck, t: "Veri Güvenliği", d: "Hatalı veya yanıltıcı bilgi girişi kullanıcı sorumluluğundadır." },
                  { icon: FileText, t: "Dokümantasyon", d: "Sitedeki görseller ve metinler teklif niteliği taşımaz." },
                  { icon: Scale, t: "Yasal Uyumluluk", d: "Siber saldırı veya kötüye kullanım yasal takibe tabidir." }
                ].map((rule, idx) => (
                  <div key={idx} className="p-8 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-colors group">
                    <rule.icon className="text-orange-500 mb-6 group-hover:scale-110 transition-transform" size={24} />
                    <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-3">{rule.t}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{rule.d}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 3. Teklif Süreci */}
            <motion.section id="teklif" {...itemVariants} whileInView="whileInView" initial="initial" viewport={{ once: true }}>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white italic font-black">03</div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Süreç ve Sözleşme</h2>
              </div>
              <div className="relative space-y-12 before:absolute before:left-[23px] before:top-0 before:h-full before:w-[1px] before:bg-slate-100">
                {[
                  { t: "Dijital Talep", d: "Web sitesi üzerinden gönderilen formlar bağlayıcı bir sözleşme değildir." },
                  { t: "Resmi Teklif", d: "Keşif sonrası hazırlanan ıslak imzalı veya resmi e-postalı dokümanlar geçerlidir." },
                  { t: "Uygulama", d: "İş başlangıcı, karşılıklı imzalanan hizmet sözleşmesi ile resmiyet kazanır." }
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-16">
                    <div className="absolute left-0 top-0 w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    </div>
                    <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-2">{step.t}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Fikri Mülkiyet & Hukuk Mini Kartlar */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div id="fikri" {...itemVariants} className="p-10 bg-slate-900 rounded-[3rem] text-white">
                <h3 className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-6">Mülkiyet Hakkı</h3>
                <p className="text-slate-400 text-sm leading-loose">
                  Tüm projeler, çizimler ve görsel materyaller <strong>CBO Yapı</strong> telif hakları altındadır. İzinsiz kopyalanamaz.
                </p>
              </motion.div>
              <motion.div id="hukuk" {...itemVariants} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                <h3 className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-6">Yetkili Mahkemeler</h3>
                <p className="text-slate-500 text-sm leading-loose">
                  Anlaşmazlık durumunda <strong>Tekirdağ / Kapaklı</strong> Mahkemeleri ve İcra Daireleri yetkilidir.
                </p>
              </motion.div>
            </div>

            {/* İletişim Footer */}
            <motion.div 
              {...itemVariants}
              className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start gap-12"
            >
              <div>
                <h4 className="text-slate-900 font-black uppercase italic tracking-tighter text-2xl mb-4">Sorularınız İçin</h4>
                <p className="text-slate-500 text-sm max-w-xs">Şartlar hakkında detaylı bilgi almak için hukuk departmanımızla iletişime geçebilirsiniz.</p>
              </div>
              <div className="flex flex-col gap-4">
                <a href="mailto:info@cboyapi.com" className="group flex items-center gap-4 text-slate-900 font-black uppercase tracking-widest text-xs">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Mail size={16} />
                  </div>
                  info@cboyapi.com
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}