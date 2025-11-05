// File: app/iletisim/page.tsx
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
  trap?: string; // honeypot
};

const CONTACT = {
  title: "İLETİŞİM",
  address:
    "19 MAYIS MAH. TOYGAR SK. 54 NOLU B.B. NO: 36G\nKAPAKLI / TEKİRDAĞ",
  phone: "0511 111 11 11",
  email: "info@cboyapi.com", // ihtiyacına göre düzenle
};

const SHOW_MAP = false; // dilediğinde true yap

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
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  // Basit captcha (a + b)
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
    if (!form.name.trim()) return "Lütfen adınızı girin.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Geçerli bir e-posta girin.";
    if (!form.message.trim() || form.message.trim().length < 10)
      return "Mesaj en az 10 karakter olmalı.";
    if (form.trap && form.trap.trim().length > 0) return "İşlem engellendi.";
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
      setMsg({
        type: "ok",
        text: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        website: "",
        message: "",
        captcha: "",
        trap: "",
      });
      setA(Math.floor(Math.random() * 7) + 3);
      setB(Math.floor(Math.random() * 7) + 3);
    } catch (e) {
      console.error(e);
      setMsg({
        type: "err",
        text: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Başlık */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              İletişim
            </span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Sorularınız ve teklif talepleriniz için formu doldurun; ekibimiz
            en kısa sürede sizinle iletişime geçsin.
          </p>
        </header>

        {/* Kart: Form + Bilgi Bloğu */}
        <section className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Üst şerit */}
          <div className="h-1 w-full bg-gradient-to-r from-[#155dfc] via-[#4e96ff] to-[#8cc1ff]" />

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Sol: Form */}
            <div className="lg:col-span-2 p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Honeypot */}
                <input
                  type="text"
                  value={form.trap}
                  onChange={(e) => update("trap", e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="ornek@domain.com"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefon
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="05xx xxx xx xx"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Web Sitesi (Opsiyonel)
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mesajınız <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Projenizden kısaca bahsedin..."
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="captcha"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Güvenlik Doğrulaması
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-11 px-8 rounded-lg border border-gray-300 bg-gray-50 text-gray-700">
                        {a}+{b}=
                      </span>
                      <input
                        id="captcha"
                        type="text"
                        inputMode="numeric"
                        value={form.captcha}
                        onChange={(e) => update("captcha", e.target.value)}
                        placeholder="Cevap"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center justify-center h-11 px-6 rounded-lg font-semibold bg-[#155dfc] text-white hover:brightness-110 active:scale-[0.99] shadow-md hover:shadow-lg transition disabled:opacity-60"
                  >
                    {busy ? "Gönderiliyor..." : "Gönder"}
                  </button>
                </div>

                {msg && (
                  <div
                    className={`rounded-lg px-4 py-3 text-sm ${
                      msg.type === "ok"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </form>
            </div>

            {/* Sağ: Bilgi Bloğu */}
            <aside className="bg-gray-50 p-6 md:p-8">
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="bg-[#e30000] text-white px-6 py-3 font-semibold">
                  {CONTACT.title}
                </div>
                <div className="p-6 space-y-5 text-sm text-gray-700">
                  <Item
                    icon={
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2C8 2 4.5 5 4.5 9c0 5.25 7.5 13 7.5 13s7.5-7.75 7.5-13c0-4-3.5-7-7.5-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                    }
                    title="Adres"
                  >
                    <span className="whitespace-pre-line">{CONTACT.address}</span>
                  </Item>

                  <Item
                    icon={
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.31 1.76.57 2.6a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l.57-1.18a2 2 0 0 1 2.11-.45c.84.26 1.71.45 2.6.57A2 2 0 0 1 22 16.92z" />
                      </svg>
                    }
                    title="Telefon"
                  >
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="hover:underline"
                    >
                      {CONTACT.phone}
                    </a>
                  </Item>

                  <Item
                    icon={
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="m22 6-10 7L2 6" />
                      </svg>
                    }
                    title="E-posta"
                  >
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="hover:underline break-all"
                    >
                      {CONTACT.email}
                    </a>
                  </Item>

                  {SHOW_MAP && (
                    <div className="pt-2">
                      <div className="h-48 w-full overflow-hidden rounded-xl border">
                        <iframe
                          className="w-full h-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src="https://www.google.com/maps?q=KAPAKLI%20TEKİRDAĞ&output=embed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ——— Yardımcı küçük bileşen ——— */
function Item({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 text-gray-700">{icon}</span>
      <div>
        <div className="text-xs font-semibold text-gray-900">{title}</div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
