"use client";

import { motion, easeOut } from "framer-motion";
import { HardHat, Users, Trophy, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: easeOut }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2 } },
  viewport: { once: true }
};

export default function HakkimizdaPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      
      {/* HERO SECTION - Parallax & Reveal Effect */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src="/hakkimizda/image.png"
            alt="CBO Yapı Ekibi"
            fill
            className="object-cover opacity-60 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-white" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1 }}
            className="text-orange-500 font-bold uppercase text-xs mb-6 block"
          >
            Since 2011
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[12vw] md:text-[120px] font-black leading-none uppercase tracking-tighter text-white italic"
          >
            BİZİM <br /> 
            <span className="text-transparent [-webkit-text-stroke:1.5px_#fff]">HİKAYEMİZ</span>
          </motion.h1>
        </div>
      </section>

      {/* VİZYON & METİN - Reveal on Scroll */}
      <section className="py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 items-start">
            
            <motion.div 
              {...fadeInUp}
              className="lg:col-span-7"
            >
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 mb-12">
                GELECEĞİ <br /> <span className="text-orange-500">TASARLIYORUZ.</span>
              </h2>
              <div className="space-y-8 text-xl text-slate-500 font-medium leading-relaxed">
                <p>
                  CBO Yapı, sadece binalar değil, yaşamın kendisini çevreleyen estetik ve fonksiyonel heykeller inşa etmek amacıyla kuruldu. Tekirdağ merkezli vizyonumuzla, 15 yılı aşkın süredir şehrin dokusuna modern imzalar atıyoruz.
                </p>
                <p className="text-slate-900 border-l-4 border-orange-500 pl-8 italic">
                  "Bir yapının ruhu, detaylarında gizlidir. Biz o ruhu her santimetrekarede yaşatıyoruz."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  {["İç Mimari Tasarım", "Mobilya Üretimi", "Mühendislik Çözümleri", "Yapı Market"].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-800 font-bold uppercase tracking-widest text-sm">
                      <CheckCircle className="text-orange-500 w-5 h-5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ASİMETRİK İSTATİSTİK KARTLARI */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-5 grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, val: "250+", label: "Müşteri", color: "bg-slate-900 text-white" },
                { icon: Trophy, val: "18", label: "Ödül", color: "bg-orange-500 text-white" },
                { icon: HardHat, val: "42", label: "Proje", color: "bg-slate-100 text-slate-900" },
                { icon: Clock, val: "15+", label: "Yıl", color: "bg-slate-50 text-slate-400" },
              ].map((s, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  className={`${s.color} p-10 rounded-[2.5rem] flex flex-col justify-between h-64 transition-transform hover:scale-95 duration-500`}
                >
                  <s.icon strokeWidth={1.5} size={40} />
                  <div>
                    <div className="text-4xl font-black italic leading-none mb-2">{s.val}</div>
                    <div className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-70">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEĞERLERİMİZ - Horizontal Reveal */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div {...fadeInUp} className="mb-24">
            <h3 className="text-[8vw] md:text-[80px] font-black uppercase italic leading-none text-slate-200">
              NEDEN BİZ?
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "TEK ÇATI ÇÖZÜMÜ", 
                desc: "Mimari çizimden mobilya montajına kadar tüm süreç tek bir profesyonel elden yönetilir." 
              },
              { 
                title: "YEREL UZMANLIK", 
                desc: "Trakya bölgesinin dinamiklerine, zemin yapısına ve mimari kimliğine en hakim ekibiz." 
              },
              { 
                title: "ESTETİK VİZYON", 
                desc: "Sadece dayanıklı değil, aynı zamanda çağdaş sanatın izlerini taşıyan mekanlar tasarlıyoruz." 
              }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mb-8 group-hover:bg-orange-500 transition-colors">
                  <ArrowRight size={20} />
                </div>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-slate-900">
                  {v.title}
                </h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Big Impact */}
      <section className="py-40 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[4rem] py-24 px-12 relative overflow-hidden"
          >
            {/* Background Decorative Text */}
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
               <span className="text-[20vw] font-black italic text-white uppercase">CBO YAPI</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-12 relative z-10">
              GELECEĞİNİZİ BİRLİKTE <br /> 
              <span className="text-transparent [-webkit-text-stroke:1px_#fff]">İNŞA EDELİM.</span>
            </h2>

            <Link
              href="/iletisim"
              className="relative z-10 inline-flex items-center gap-6 px-12 py-6 rounded-full bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-slate-900 transition-all duration-500 group"
            >
              Hemen İletişime Geç
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}