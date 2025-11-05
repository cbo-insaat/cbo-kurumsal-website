// File: app/admin/mesajlar/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc as fsDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

type MessageDoc = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  message: string;
  status?: "unread" | "read";
  createdAt?: Timestamp | null;
  meta?: { ua?: string | null; page?: string | null };
};

export default function AdminMesajlarPage() {
  const [messages, setMessages] = useState<MessageDoc[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  // Canlı dinle
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: MessageDoc[] = snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            name: x.name ?? "",
            email: x.email ?? "",
            phone: x.phone ?? null,
            website: x.website ?? null,
            message: x.message ?? "",
            status: x.status ?? "unread",
            createdAt: x.createdAt ?? null,
            meta: x.meta ?? {},
          };
        });
        setMessages(list);
      },
      (err) => {
        console.error(err);
        setMessages([]);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const key = search.trim().toLowerCase();
    return (messages ?? []).filter((m) => {
      const passUnread = onlyUnread ? (m.status ?? "unread") === "unread" : true;
      const passSearch =
        !key ||
        m.name.toLowerCase().includes(key) ||
        m.email.toLowerCase().includes(key) ||
        (m.phone ?? "").toLowerCase().includes(key) ||
        (m.message ?? "").toLowerCase().includes(key);
      return passUnread && passSearch;
    });
  }, [messages, search, onlyUnread]);

  const toggleExpand = async (id: string, currentStatus?: string) => {
    setExpanded((e) => (e === id ? null : id));
    // ilk kez açılıyorsa "read" yap
    if (currentStatus !== "read") {
      try {
        await updateDoc(fsDoc(db, "messages", id), { status: "read" });
      } catch (e) {
        console.warn("Durum güncellenemedi:", e);
      }
    }
  };

  const toggleRead = async (id: string, next: "read" | "unread") => {
    try {
      await updateDoc(fsDoc(db, "messages", id), { status: next });
    } catch (e) {
      console.error(e);
      alert("Durum güncellenemedi.");
    }
  };

  const remove = async (m: MessageDoc) => {
    const ok = confirm(`“${m.name} / ${m.email}” mesajını silmek istiyor musun?`);
    if (!ok) return;
    try {
      await deleteDoc(fsDoc(db, "messages", m.id));
      if (expanded === m.id) setExpanded(null);
    } catch (e) {
      console.error(e);
      alert("Silme sırasında hata oluştu.");
    }
  };

  const fmtDate = (t?: Timestamp | null) => {
    if (!t) return "—";
    const d = t.toDate();
    return d.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-3 md:px-0">
        {/* Başlık */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
              Mesajlar
            </span>
          </h1>
          <p className="mt-2 text-gray-600">İletişim formundan gelen mesajları görüntüleyin, işaretleyin ve silin.</p>
        </header>

        {/* Kontroller */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara: ad, e-posta, telefon, mesaj…"
              className="w-full md:w-80 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
            />
            Sadece okunmamışlar
          </label>
        </div>

        {/* Liste */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Üst şerit */}
          <div className="h-1 w-full bg-gradient-to-r from-[#155dfc] via-[#4e96ff] to-[#8cc1ff]" />

          {messages === null ? (
            <div className="p-6 grid grid-cols-1 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-600">Kayıt bulunamadı.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filtered.map((m) => {
                const isOpen = expanded === m.id;
                const isUnread = (m.status ?? "unread") === "unread";
                return (
                  <li key={m.id} className="px-4 md:px-6">
                    {/* Satır başlığı */}
                    <button
                      onClick={() => toggleExpand(m.id, m.status)}
                      className="w-full py-4 flex items-center gap-3 text-left focus:outline-none"
                    >
                      {/* Ok */}
                      <span
                        className={`transition-transform duration-200 text-gray-500 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden
                        title="Aç/Kapat"
                      >
                        ▼
                      </span>

                      {/* Sol kısım: ad + email */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-gray-900 truncate">{m.name || "—"}</span>
                     
                        </div>
                     
                      </div>

                      {/* Sağ: tarih + rozet */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-gray-500">{fmtDate(m.createdAt)}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            isUnread
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {isUnread ? "Okunmadı" : "Okundu"}
                        </span>
                      </div>
                    </button>

                    {/* Detay paneli */}
                    {isOpen && (
                      <div className="pb-5 -mt-2 md:pl-7">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div>
                              <dt className="text-gray-500">Ad Soyad</dt>
                              <dd className="text-gray-900">{m.name || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">E-posta</dt>
                              <dd className="text-gray-900 break-all">{m.email || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Telefon</dt>
                              <dd className="text-gray-900">{m.phone || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Web Sitesi</dt>
                              <dd className="text-gray-900 break-all">
                                {m.website ? (
                                  <a
                                    href={m.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#155dfc] hover:underline"
                                  >
                                    {m.website}
                                  </a>
                                ) : (
                                  "—"
                                )}
                              </dd>
                            </div>
                            <div className="md:col-span-2">
                              <dt className="text-gray-500">Mesaj</dt>
                              <dd className="text-gray-900 whitespace-pre-wrap mt-1">
                                {m.message}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Tarih</dt>
                              <dd className="text-gray-900">{fmtDate(m.createdAt)}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Kaynak</dt>
                              <dd className="text-gray-900">
                                {(m.meta?.page as any) || "/iletisim"}
                              </dd>
                            </div>
                            {m.meta?.ua && (
                              <div className="md:col-span-2">
                                <dt className="text-gray-500">User-Agent</dt>
                                <dd className="text-gray-900 break-all">{m.meta.ua}</dd>
                              </div>
                            )}
                          </dl>

                          {/* Aksiyonlar */}
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            {isUnread ? (
                              <button
                                onClick={() => toggleRead(m.id, "read")}
                                className="text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3 py-1.5 text-sm font-semibold"
                              >
                                Okundu İşaretle
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleRead(m.id, "unread")}
                                className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-1.5 text-sm font-semibold"
                              >
                                Okunmadı Yap
                              </button>
                            )}
                            <button
                              onClick={() => remove(m)}
                              className="text-white bg-red-600 hover:bg-red-700 rounded-lg px-3 py-1.5 text-sm font-semibold"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
