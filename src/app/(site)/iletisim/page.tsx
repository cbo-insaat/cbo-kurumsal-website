// app/iletisim/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type Form = {
  name: string;
  email: string;
  phone: string;
  website: string;
  message: string;
  captcha: string;
  trap?: string;
};

const CONTACT = {
  title: "İLETİŞİM",
  address:
    "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G\nKAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com",
};

const SHOW_MAP = false;

export default function ContactPage() {
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
    captcha: "",
    trap: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Captcha
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  useEffect(() => {
    setA(Math.floor(Math.random() * 7) + 3);
    setB(Math.floor(Math.random() * 7) + 3);
  }, []);
  const answer = useMemo(() => String(a + b), [a, b]);

  const update = (key: keyof Form, v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const validate = () => {
    if (!form.name.trim()) return "Ad soyad gerekli.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Geçerli e-posta girin.";
    if (!form.message.trim() || form.message.trim().length < 10)
      return "Mesaj en az 10 karakter olmalı.";
    if (form.trap?.trim()) return "İşlem engellendi.";
    if (form.captcha.trim() !== answer) return "Captcha yanlış.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const err = validate();
    if (err) {
      setMsg({ type: "err", text: err });
      return;
    }
    try {
      setBusy(true);
      await addDoc(collection(db, "messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        message: form.message.trim(),
        status: "unread",
        createdAt: serverTimestamp(),
        meta: {
          ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
          page: "/iletisim",
        },
      });
      setMsg({ type: "ok", text: "Mesajınız alındı. En kısa sürede dönüş yapacağız." });
      setForm({ name: "", email: "", phone: "", website: "", message: "", captcha: "", trap: "" });
      setA(Math.floor(Math.random() * 7) + 3);
      setB(Math.floor(Math.random() * 7) + 3);
    } catch (e) {
      console.error(e);
      setMsg({ type: "err", text: "Gönderim hatası. Lütfen tekrar deneyin." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Başlık */}
        <header className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-600 to-slate-300 bg-clip-text text-transparent">
              İletişim
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Teklif talebi, soru veya keşif için formu doldurun. 24 saat içinde dönüş yapalım.
          </p>
        </header>

        {/* Ana Kart */}
        <section className="rounded-3xl shadow-2xl border border-slate-100 overflow-hidden bg-white">
          {/* Gradient şerit */}
          <div className="h-2 w-full bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400" />

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* FORM – Sol */}
            <div className="lg:col-span-2 p-8 md:p-12">
              <form onSubmit={onSubmit} className="space-y-7">
                {/* Honeypot */}
                <input
                  type="text"
                  value={form.trap}
                  onChange={(e) => update("trap", e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Ad Soyad *" id="name" value={form.name} onChange={(v) => update("name", v)} placeholder="Adınız Soyadınız" />
                  <Input label="E-posta *" id="email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="ornek@domain.com" />
                  <Input label="Telefon" id="phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="05xx xxx xx xx" />
                  <Input label="Web Sitesi" id="website" type="url" value={form.website} onChange={(v) => update("website", v)} placeholder="https://ornek.com" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    rows={7}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Projenizden kısaca bahsedin..."
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-500 transition"
                  />
                </div>

                {/* Captcha + Gönder */}
                <div className="flex flex-col md:flex-row gap-5 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Güvenlik Doğrulaması
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-14 px-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-lg border border-slate-300">
                        {a} + {b} =
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.captcha}
                        onChange={(e) => update("captcha", e.target.value)}
                        placeholder="?"
                        className="w-28 rounded-xl border border-slate-300 px-4 py-3.5 text-center text-lg font-medium focus:outline-none focus:ring-4 focus:ring-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="
                      group relative px-10 py-4 rounded-2xl font-bold text-white text-lg
                      bg-gradient-to-r from-slate-600 to-slate-700
                      hover:from-slate-700 hover:to-slate-800
                      shadow-xl hover:shadow-2xl
                      transition-all duration-300 hover:-translate-y-0.5
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    <span className="flex items-center gap-2">
                      {busy ? "Gönderiliyor..." : "Gönder"}
                      {!busy && (
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>

                {/* Mesaj */}
                {msg && (
                  <div
                    className={`rounded-2xl p-5 text-sm font-medium border ${
                      msg.type === "ok"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </form>
            </div>

            {/* BİLGİ – Sağ */}
            <aside className="bg-gradient-to-b from-slate-50 to-white p-8 md:p-12">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">{CONTACT.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">Hızlı iletişim, hızlı çözüm</p>
                </div>

                <div className="space-y-7">
                  <InfoItem
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                    title="Adres"
                  >
                    <span className="whitespace-pre-line text-sm">{CONTACT.address}</span>
                  </InfoItem>

                  <InfoItem
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                    title="Telefon"
                  >
                    <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="text-slate-700 hover:text-slate-900 font-medium">
                      {CONTACT.phone}
                    </a>
                  </InfoItem>

                  <InfoItem
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                    title="E-posta"
                  >
                    <a href={`mailto:${CONTACT.email}`} className="text-slate-700 hover:text-slate-900 font-medium break-all">
                      {CONTACT.email}
                    </a>
                  </InfoItem>
                </div>

                {SHOW_MAP && (
                  <div className="mt-8">
                    <div className="h-64 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
                      <iframe
                        className="w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=KAPAKLI+TEK%C4%B0RDA%C4%9E"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">
                    Mesajınız 256-bit şifreleme ile korunur. <br />
                    Detaylar için <a href="/gizlilik-politikasi" className="underline hover:text-slate-700">Gizlilik Politikası</a>.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

/* Yardımcı Bileşenler */
function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 px-5 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-500 transition"
      />
    </div>
  );
}

function InfoItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</p>
        <div className="mt-1 text-sm text-slate-700">{children}</div>
      </div>
    </div>
  );
}