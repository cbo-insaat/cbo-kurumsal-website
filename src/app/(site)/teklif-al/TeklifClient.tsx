"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { Calculator, Calendar, MapPin, Briefcase, User, Mail, Phone, Send, Sparkles } from "lucide-react";

type Form = {
  fullName: string; email: string; phone: string; city: string;
  company?: string; serviceId?: string; budget?: string;
  startDate?: string; message: string; trap?: string;
};

export default function TeklifPage() {
  const [form, setForm] = useState<Form>({
    fullName: "", email: "", phone: "", city: "", company: "",
    serviceId: "", budget: "", startDate: "", message: "", trap: "",
  });
  const [services, setServices] = useState<{ id: string, name: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  useEffect(() => {
    setA(Math.floor(Math.random() * 5) + 5);
    setB(Math.floor(Math.random() * 5) + 2);
    (async () => {
      const qy = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const snap = await getDocs(qy);
      setServices(snap.docs.map(d => ({ id: d.id, name: (d.data() as any).name })));
    })();
  }, []);

  const answer = useMemo(() => String(a + b), [a, b]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    setBusy(true);
    try {
      await addDoc(collection(db, "offers"), { ...form, status: "new", createdAt: serverTimestamp() });
      setMsg({ type: "ok", text: "Talebiniz başarıyla iletildi. Uzmanlarımız sizi arayacak." });
      setForm({ fullName: "", email: "", phone: "", city: "", company: "", serviceId: "", budget: "", startDate: "", message: "", trap: "" });
    } catch {
      setMsg({ type: "err", text: "Bir hata oluştu." });
    } finally { setBusy(false); }
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* HEADER */}
        <div className="relative mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-[10vw] md:text-[110px] font-black leading-[0.85] tracking-tighter uppercase italic text-slate-900">
              YATIRIMINIZI <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#0f172a] opacity-30">PLANLAYIN</span>
            </h1>
          </motion.div>
          <div className="absolute top-0 right-0 hidden lg:block">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border border-slate-100 rounded-full flex items-center justify-center">
              <Sparkles className="text-orange-500 opacity-20" size={40} />
            </motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* FORM AREA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-3xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full" />

            <form onSubmit={onSubmit} className="relative z-10 space-y-12">

              {/* Bölüm 1: Kişisel Bilgiler */}
              <div className="space-y-8">
                <h3 className="text-white/20 font-black uppercase tracking-widest text-xs flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-white/10" /> 01. Müşteri Bilgileri
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <TeklifInput icon={User} label="AD SOYAD" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} />
                  <TeklifInput icon={Mail} label="E-POSTA" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                  <TeklifInput icon={Phone} label="TELEFON" type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                  <TeklifInput icon={MapPin} label="ŞEHİR / İLÇE" value={form.city} onChange={v => setForm({ ...form, city: v })} />
                </div>
              </div>

              {/* Bölüm 2: Proje Detayları */}
              <div className="space-y-8">
                <h3 className="text-white/20 font-black uppercase tracking-widest text-xs flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-white/10" /> 02. Proje Parametreleri
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <Briefcase className="absolute left-0 bottom-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <select
                      value={form.serviceId}
                      onChange={e => setForm({ ...form, serviceId: e.target.value })}
                      className="w-full bg-transparent border-b border-slate-700 text-white pl-8 py-4 outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">HİZMET SEÇİN</option>
                      {services.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>)}
                    </select>
                  </div>
                  <div className="relative group">
                    <Calculator className="absolute left-0 bottom-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <select
                      value={form.budget}
                      onChange={e => setForm({ ...form, budget: e.target.value })}
                      className="w-full bg-transparent border-b border-slate-700 text-white pl-8 py-4 outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">TAHMİNİ BÜTÇE</option>
                      <option value="250k-" className="bg-slate-900">0 - 250.000 TL</option>
                      <option value="1m+" className="bg-slate-900">1.000.000 TL +</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mesaj */}
              <div className="relative group">
                <textarea
                  placeholder="PROJE DETAYLARINIZ"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-slate-700 text-white py-4 outline-none focus:border-orange-500 transition-all placeholder:text-slate-600 font-bold text-sm"
                />
              </div>

              <div className="flex flex-col md:flex-row  justify-end  pt-6">
           

                <button
                  disabled={busy}
                  className="cursor-pointer group relative w-full md:w-auto px-16 py-6 bg-orange-500 rounded-full text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-slate-900 transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {busy ? "İŞLENİYOR..." : "TEKLİFİ OLUŞTUR"} <Send size={16} />
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>

              <AnimatePresence>
                {msg && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] ${msg.type === "ok" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    {msg.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* ASIDE INFO */}
          <div className="lg:col-span-4 space-y-10">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 mb-6">NEDEN TEKLİF ALMALISINIZ?</h3>
              <ul className="space-y-6">
                {[
                  { t: "Ücretsiz Keşif", d: "Projenizi yerinde inceleyip en doğru maliyet analizini yapıyoruz." },
                  { t: "Şeffaf Süreç", d: "Tüm kalemleri detaylıca raporlayıp sürpriz maliyetleri eliyoruz." },
                  { t: "Hızlı Dönüş", d: "Talebinize en geç 24 saat içerisinde uzman yanıtı veriyoruz." }
                ].map((item, i) => (
                  <li key={i} className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="font-black uppercase tracking-widest text-[10px] text-slate-900">{item.t}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.d}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

        
          </div>
        </div>
      </div>
    </main>
  );
}

interface TeklifInputProps {
  icon: React.ComponentType<{ size: number; className: string }>;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

function TeklifInput({ icon: Icon, label, type = "text", value, onChange }: TeklifInputProps) {
  return (
    <div className="relative group">
      <Icon className="absolute left-0 bottom-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={label}
        className="w-full bg-transparent border-b border-slate-700 text-white pl-8 py-4 outline-none focus:border-orange-500 transition-all placeholder:text-slate-600 font-bold text-xs tracking-widest uppercase"
      />
    </div>
  );
}