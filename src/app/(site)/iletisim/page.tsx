"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

type Form = {
  name: string;
  email: string;
  phone: string;
  message: string;
  
  trap?: string;
};

const CONTACT_INFO = [
  { icon: MapPin, title: "Merkez Ofis", detail: "19 Mayıs Mah. Toygar Sk. No: 36G Kapaklı / Tekirdağ" },
  { icon: Phone, title: "Bize Ulaşın", detail: "0511 111 11 11" },
  { icon: Mail, title: "E-Posta", detail: "info@cboyapi.com" },
];

export default function ContactPage() {
  const [form, setForm] = useState<Form>({ name: "", email: "", phone: "", message: "",  trap: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  useEffect(() => {
    setA(Math.floor(Math.random() * 8) + 2);
    setB(Math.floor(Math.random() * 8) + 2);
  }, []);

  const answer = useMemo(() => String(a + b), [a, b]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setBusy(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setMsg({ type: "ok", text: "Mesajınız başarıyla iletildi. Sizinle en kısa sürede iletişime geçeceğiz." });
      setForm({ name: "", email: "", phone: "", message: "",  trap: "" });
    } catch {
      setMsg({ type: "err", text: "Bir hata oluştu, lütfen tekrar deneyin." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-8">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10vw] md:text-[120px] font-black leading-none uppercase italic tracking-tighter text-slate-900"
            >
              PROJENİZİ <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a] opacity-40">BAŞLATIN</span>
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 flex items-end pb-4"
          >
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Hayallerinizi somut projelere dönüştürmek için sadece bir mesaj uzağınızdayız. 
              Uzman ekibimiz 24 saat içinde size dönüş yapacaktır.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-slate-900 p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
            
            <form onSubmit={onSubmit} className="relative z-10 space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <FloatingInput label="ADINIZ SOYADINIZ" value={form.name} onChange={(v) => setForm({...form, name: v})} />
                <FloatingInput label="E-POSTA ADRESİNİZ" type="email" value={form.email} onChange={(v) => setForm({...form, email: v})} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-10">
                <FloatingInput label="TELEFON NUMARANIZ" type="tel" value={form.phone} onChange={(v) => setForm({...form, phone: v})} />
            
              </div>

              <div className="relative">
                <textarea 
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="w-full bg-transparent border-b border-slate-700 text-white py-4 outline-none focus:border-orange-500 transition-colors peer placeholder-transparent"
                  placeholder="Mesajınız"
                />
                <label className="absolute left-0 -top-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-orange-500">
                  PROJE DETAYLARI
                </label>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
                <AnimatePresence>
                  {msg && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${msg.type === "ok" ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {msg.type === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {msg.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  disabled={busy}
                  className="w-full md:w-auto px-12 py-6 bg-orange-500 rounded-full text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95"
                >
                  {busy ? "GÖNDERİLİYOR..." : "MESAJI GÖNDER"}
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* RIGHT: Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between py-8">
            <div className="space-y-16">
              {CONTACT_INFO.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="group flex gap-8 items-start"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-900 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shrink-0">
                    <item.icon strokeWidth={1.5} size={32} />
                  </div>
                  <div>
                    <h4 className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">{item.title}</h4>
                    <p className="text-slate-900 text-xl font-black uppercase italic leading-tight tracking-tight">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

       
          </div>

        </div>
      </div>
    </main>
  );
}

function FloatingInput({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative w-full">
      <input 
        required
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-slate-700 text-white py-4 outline-none focus:border-orange-500 transition-colors peer placeholder-transparent"
        placeholder={label}
      />
      <label className="absolute left-0 -top-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:-top-4 peer-focus:text-orange-500 pointer-events-none">
        {label}
      </label>
    </div>
  );
}