// File: app/admin/panel/teklifler/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase/config";
import {
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  CalendarClock,
  MapPin,
  Tag,
  Trash2,
  CheckCircle2,
  Eye,
  Clock3,
} from "lucide-react";

type Offer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  serviceName?: string; // opsiyonel: teklif formunda gönderiyorsan
  budget?: string;      // opsiyonel
  message?: string;
  status?: "new" | "in_progress" | "done";
  createdAt?: Timestamp | null;
  meta?: any;
};

const STATUS_OPTIONS: { key: Offer["status"]; label: string; color: string }[] = [
  { key: "new",         label: "Yeni",         color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "in_progress", label: "İnceleniyor",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "done",        label: "Tamamlandı",   color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [qtext, setQtext] = useState("");
  const [statusFilter, setStatusFilter] = useState<Offer["status"] | "all">("all");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    setOffers(null);
    try {
      // Firestore tarafında createdAt için index varsa orderBy kullanır.
      // Filtre seçiliyse where ile sorgula; değilse tümünü çek.
      let qref;
      if (statusFilter === "all") {
        qref = query(collection(db, "offers"), orderBy("createdAt", "desc"));
      } else {
        qref = query(
          collection(db, "offers"),
          where("status", "==", statusFilter),
          orderBy("createdAt", "desc")
        );
      }
      const snap = await getDocs(qref);
      const list: Offer[] = snap.docs.map((d) => {
        const x = d.data() as any;
        return {
          id: d.id,
          name: x.name,
          email: x.email,
          phone: x.phone,
          city: x.city,
          serviceName: x.serviceName,
          budget: x.budget,
          message: x.message,
          status: x.status ?? "new",
          createdAt: x.createdAt ?? null,
          meta: x.meta,
        };
      });
      setOffers(list);
    } catch (e) {
      console.error(e);
      setOffers([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = useMemo(() => {
    if (!offers) return null;
    const t = qtext.trim().toLowerCase();
    if (!t) return offers;
    return offers.filter((o) => {
      const hay = [
        o.name,
        o.email,
        o.phone,
        o.city,
        o.serviceName,
        o.budget,
        o.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(t);
    });
  }, [offers, qtext]);

  const changeStatus = async (id: string, next: Offer["status"]) => {
    try {
      await updateDoc(doc(db, "offers", id), { status: next });
      setOffers((prev) =>
        prev
          ? prev.map((o) => (o.id === id ? { ...o, status: next } : o))
          : prev
      );
    } catch (e) {
      console.error(e);
      alert("Durum güncellenemedi.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu teklifi silmek istediğine emin misin?")) return;
    try {
      await deleteDoc(doc(db, "offers", id));
      setOffers((prev) => (prev ? prev.filter((o) => o.id !== id) : prev));
      if (openId === id) setOpenId(null);
    } catch (e) {
      console.error(e);
      alert("Silme işlemi başarısız.");
    }
  };

  const badge = (st?: Offer["status"]) => {
    const found = STATUS_OPTIONS.find((s) => s.key === st);
    const cls = found ? found.color : "bg-gray-50 text-gray-700 border-gray-200";
    const label = found ? found.label : "Bilinmiyor";
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${cls}`}>{label}</span>
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Başlık */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#155dfc] to-[#8cc1ff] bg-clip-text text-transparent">
                Teklifler
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              Ziyaretçilerin gönderdiği teklif taleplerini görüntüle, yönet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={busy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />
              Yenile
            </button>
          </div>
        </div>

        {/* Filtre & Arama */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-2 py-1.5 shadow-sm">
            {(["all", "new", "in_progress", "done"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setStatusFilter(k === "all" ? "all" : k)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusFilter === k
                    ? "bg-[#155dfc] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {k === "all"
                  ? "Tümü"
                  : k === "new"
                  ? "Yeni"
                  : k === "in_progress"
                  ? "İnceleniyor"
                  : "Tamamlandı"}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={qtext}
              onChange={(e) => setQtext(e.target.value)}
              placeholder="Ada, e-postaya, telefona veya mesaja göre ara…"
              className="text-black pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
            />
          </div>
        </div>

        {/* Liste */}
        {offers === null ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-20 rounded-xl bg-white border border-gray-100"
              />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((o) => {
              const created =
                o.createdAt?.toDate?.() ??
                (o.createdAt as any)?.toDate?.() ??
                null;
              const dateStr = created
                ? created.toLocaleString("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              const isOpen = openId === o.id;

              return (
                <div
                  key={o.id}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
                >
                  {/* Satır üstü */}
                  <div className="flex flex-wrap items-center gap-3 p-4">
                    <button
                      onClick={() => setOpenId(isOpen ? null : o.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                      title={isOpen ? "Daralt" : "Detayı Aç"}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-[160px]">
                      <div className="font-semibold text-gray-900">
                        {o.name || "—"}
                      </div>
                      <div className="text-xs text-gray-500">{dateStr}</div>
                    </div>

                    <div className="hidden md:block text-sm text-gray-700">
                      {o.email ? (
                        <span className="inline-flex items-center gap-2 mr-4">
                          <Mail className="w-4 h-4" />
                          {o.email}
                        </span>
                      ) : null}
                      {o.phone ? (
                        <span className="inline-flex items-center gap-2 mr-4">
                          <Phone className="w-4 h-4" />
                          {o.phone}
                        </span>
                      ) : null}
                      {o.city ? (
                        <span className="inline-flex items-center gap-2 mr-4">
                          <MapPin className="w-4 h-4" />
                          {o.city}
                        </span>
                      ) : null}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                      {badge(o.status)}
                      <div className="relative">
                        <select
                          value={o.status ?? "new"}
                          onChange={(e) =>
                            changeStatus(
                              o.id,
                              e.target.value as Offer["status"]
                            )
                          }
                          className="text-black text-sm rounded-lg border border-gray-200 bg-white px-2 py-1.5"
                          title="Durum değiştir"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.key} value={s.key!}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => remove(o.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </div>
                  </div>

                  {/* Detay alanı */}
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="text-xs text-gray-500 mb-1">İletişim</div>
                          <div className="space-y-1 text-sm text-gray-800">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <a className="hover:underline" href={o.email ? `mailto:${o.email}` : "#"}>{o.email || "—"}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <a className="hover:underline" href={o.phone ? `tel:${o.phone}` : "#"}>{o.phone || "—"}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{o.city || "—"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="text-xs text-gray-500 mb-1">Teklif Bilgisi</div>
                          <div className="space-y-1 text-sm text-gray-800">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              <span>Hizmet: {o.serviceName || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Bütçe: {o.budget || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarClock className="w-4 h-4" />
                              <span>Oluşturma: {dateStr || "—"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="text-xs text-gray-500 mb-1">Durum</div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-800">
                              {badge(o.status)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Eye className="w-4 h-4" />
                              <span>Durumu değiştirerek süreci yönetin.</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock3 className="w-4 h-4" />
                              <span>Yanıt süresi SLA: 24 saat (iç hedef).</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg border border-gray-100 p-4 bg-gray-50">
                        <div className="text-xs text-gray-500 mb-1">Mesaj</div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {o.message || "—"}
                        </p>
                      </div>

                      {o.meta?.ua && (
                        <div className="mt-3 text-xs text-gray-500">
                          <span className="font-medium">UA:</span> {o.meta.ua}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
            Kayıt bulunamadı.
          </div>
        )}
      </div>
    </main>
  );
}
