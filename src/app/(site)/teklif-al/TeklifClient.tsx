// File: app/teklif/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

type Form = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  company?: string;
  serviceId?: string;
  budget?: string;
  startDate?: string; // yyyy-mm-dd
  message: string;
  captcha: string;
  trap?: string; // honeypot
};

type Service = {
  id: string;
  name: string;
};

export default function TeklifPage() {
  const [form, setForm] = useState<Form>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    company: "",
    serviceId: "",
    budget: "",
    startDate: "",
    message: "",
    captcha: "",
    trap: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Hizmet listesi (opsiyonel dropdown)
  const [services, setServices] = useState<Service[]>([]);

  // Basit captcha (a + b)
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  useEffect(() => {
    setA(Math.floor(Math.random() * 7) + 3); // 3-9
    setB(Math.floor(Math.random() * 7) + 3); // 3-9
  }, []);
  const answer = useMemo(() => String(a + b), [a, b]);

  useEffect(() => {
    (async () => {
      try {
        const qy = query(collection(db, "services"), orderBy("createdAt", "desc"));
        const snap = await getDocs(qy);
        const list: Service[] = snap.docs.map((d) => {
          const x = d.data() as any;
          return { id: d.id, name: x.name || "Hizmet" };
        });
        setServices(list);
      } catch {
        setServices([]);
      }
    })();
  }, []);

  const update = (key: keyof Form, v: string) => setForm((p) => ({ ...p, [key]: v }));

  const validate = () => {
    if (!form.fullName.trim()) return "Lütfen ad soyad girin.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return "Geçerli bir e-posta girin.";
    if (!form.phone.trim()) return "Telefon alanı zorunludur.";
    if (!form.city.trim()) return "Şehir/İlçe bilgisini girin.";
    if (!form.message.trim() || form.message.trim().length < 10) return "Mesaj en az 10 karakter olmalı.";
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
      await addDoc(collection(db, "offers"), {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        company: form.company?.trim() || null,
        serviceId: form.serviceId || null,
        budget: form.budget || null,
        startDate: form.startDate || null,
        message: form.message.trim(),
        status: "new", // admin tarafında işlemek için
        createdAt: serverTimestamp(),
        meta: {
          ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
          page: "/teklif",
        },
      });
      setMsg({ type: "ok", text: "Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz." });
      // reset + yeni captcha
      setForm({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        company: "",
        serviceId: "",
        budget: "",
        startDate: "",
        message: "",
        captcha: "",
        trap: "",
      });
      setA(Math.floor(Math.random() * 7) + 3);
      setB(Math.floor(Math.random() * 7) + 3);
    } catch (e) {
      console.error(e);
      setMsg({ type: "err", text: "Talep gönderilirken bir sorun oluştu. Lütfen tekrar deneyin." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Başlık */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Teklif Talebi
            </span>
          </h1>
          <p className="mt-2 text-gray-600">
            Projeniz için hızlı bir teklif almak üzere formu doldurun.
          </p>
        </header>

        {/* Grid: Form + Bilgi Kartı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <section className="lg:col-span-2">
            <form
              onSubmit={onSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
            >
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
                  <label className="block text-sm font-medium text-gray-700">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Adınız Soyadınız"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="ornek@domain.com"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Şehir / İlçe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Tekirdağ / Kapaklı"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firma (ops.)
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Firma adı"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hizmet (ops.)
                  </label>
                  <select
                    value={form.serviceId}
                    onChange={(e) => update("serviceId", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  >
                    <option value="">Seçin…</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bütçe (ops.)
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  >
                    <option value="">Seçin…</option>
                    <option value="0-250k">0 – 250.000 TL</option>
                    <option value="250k-1m">250.000 – 1.000.000 TL</option>
                    <option value="1m-5m">1 – 5 M TL</option>
                    <option value="5m+">5 M TL üzeri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Başlangıç Tarihi (ops.)
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proje Detayı <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Projenizi kısaca anlatın…"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-[#155dfc]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Güvenlik Doğrulaması
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-11 px-8 rounded-lg border border-gray-300 bg-gray-50 text-gray-700">
                      {a}+{b}=
                    </span>
                    <input
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
                  className="inline-flex items-center justify-center h-11 px-6 rounded-lg font-semibold bg-[#e30000] text-white hover:brightness-110 active:scale-[0.99] shadow-md hover:shadow-lg transition disabled:opacity-60"
                >
                  {busy ? "Gönderiliyor..." : "Teklif İste"}
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
          </section>

          {/* Sağ Bilgi Kartı */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-lg font-bold">
                <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
                  Sizi Arayalım
                </span>
              </h3>
              <p className="mt-3 text-sm text-gray-700">
                İhtiyacınıza en uygun çözümü birlikte planlayalım. Talebinizi iletin, proje danışmanımız en kısa sürede sizi arasın.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                <li>• Ücretsiz keşif ve danışmanlık</li>
                <li>• Şeffaf fiyatlandırma</li>
                <li>• Zamanında teslim garantisi</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
