"use client";

import { useEffect, useMemo, useState } from "react";
import { db, storage } from "@/firebase/config";
import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { SliderItem } from "@/types/slider";
import AdminGuard from "@/components/AdminGuard";
import { Plus, Save, Trash2, Upload, ArrowUp, ArrowDown, X, Image as ImageIcon } from "lucide-react";

const EMPTY: SliderItem = {
  imageUrl: "",
  title: "",
  subtitle: "",
  description: "",
  order: 0,
  active: true,
};

export default function SlidersAdminPage() {
  const [items, setItems] = useState<SliderItem[]>([]);
  const [editing, setEditing] = useState<SliderItem>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const reload = async () => {
    setLoading(true);
    const q = query(collection(db, "sliders"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as SliderItem) })));
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const pickOrder = useMemo(
    () => (items.length ? items[items.length - 1].order + 1 : 0),
    [items]
  );

  const uploadImage = async (file: File) => {
    const r = ref(storage, `sliders/slider-${Date.now()}-${file.name}`);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  };

  const save = async () => {
    if (!editing.title || !editing.imageUrl) {
      alert("En azından görsel ve büyük başlık zorunlu.");
      return;
    }
    setSaving(true);
    if (editing.id) {
      await setDoc(doc(db, "sliders", editing.id), editing, { merge: true });
    } else {
      await addDoc(collection(db, "sliders"), {
        ...editing,
        order: editing.order ?? pickOrder,
        createdAt: Date.now(),
      });
    }
    setSaving(false);
    setEditing(EMPTY);
    setShowForm(false);
    await reload();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Bu slider silinsin mi?")) return;
    await deleteDoc(doc(db, "sliders", id));
    await reload();
  };

  const move = async (idx: number, dir: "up" | "down") => {
    const other = dir === "up" ? idx - 1 : idx + 1;
    if (other < 0 || other >= items.length) return;
    const a = items[idx], b = items[other];
    await Promise.all([
      setDoc(doc(db, "sliders", a.id!), { order: b.order }, { merge: true }),
      setDoc(doc(db, "sliders", b.id!), { order: a.order }, { merge: true }),
    ]);
    await reload();
  };

  const startEdit = (item: SliderItem) => {
    setEditing(item);
    setShowForm(true);
  };

  const startNew = () => {
    setEditing({ ...EMPTY, order: pickOrder });
    setShowForm(true);
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Slider Yönetimi
                </h1>
                <p className="text-slate-600 mt-2">Ana sayfa slider görsellerini yönetin</p>
              </div>
              <button
                onClick={startNew}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Yeni Slider
              </button>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-sm font-medium text-slate-600">Toplam Slider</div>
              <div className="text-3xl font-bold text-slate-800 mt-1">{items.length}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-sm font-medium text-slate-600">Aktif</div>
              <div className="text-3xl font-bold text-green-600 mt-1">
                {items.filter(s => s.active).length}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-sm font-medium text-slate-600">Pasif</div>
              <div className="text-3xl font-bold text-slate-400 mt-1">
                {items.filter(s => !s.active).length}
              </div>
            </div>
          </div>

          {/* Liste */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <h2 className="font-semibold text-slate-800">Slider Listesi</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="text-slate-500 font-medium">Henüz slider eklenmemiş</div>
                  <p className="text-slate-400 text-sm mt-1">Yeni bir slider ekleyerek başlayın</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((s, i) => (
                    <li 
                      key={s.id} 
                      className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div
                        className="relative w-24 h-16 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm overflow-hidden"
                        style={{ backgroundImage: `url(${s.imageUrl})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-slate-800 truncate">{s.title}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            s.active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {s.active ? '● Aktif' : '○ Pasif'}
                          </span>
                        </div>
                        {s.subtitle && (
                          <div className="text-sm text-slate-600 truncate">{s.subtitle}</div>
                        )}
                        <div className="text-xs text-slate-400 mt-1">Sıra: {s.order}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => move(i, "up")}
                          disabled={i === 0}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Yukarı taşı"
                        >
                          <ArrowUp className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => move(i, "down")}
                          disabled={i === items.length - 1}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Aşağı taşı"
                        >
                          <ArrowDown className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => startEdit(s)}
                          className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 font-medium transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => remove(s.id)}
                          className="p-2 rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {editing.id ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditing(EMPTY);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Image Preview */}
                  {editing.imageUrl && (
                    <div className="relative w-full h-48 rounded-xl bg-cover bg-center shadow-md overflow-hidden"
                      style={{ backgroundImage: `url(${editing.imageUrl})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Büyük Başlık <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="text-black w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        value={editing.title}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        placeholder="Ana başlık giriniz"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Alt Başlık
                      </label>
                      <input
                        className="text-black w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        value={editing.subtitle}
                        onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                        placeholder="İkincil başlık (opsiyonel)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Açıklama
                      </label>
                      <textarea
                        className="text-black w-full border border-slate-300 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                        value={editing.description}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                        placeholder="Detaylı açıklama (opsiyonel)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Sıra Numarası
                        </label>
                        <input
                          type="number"
                          className="text-black w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          value={editing.order}
                          onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Durum
                        </label>
                        <label className="flex items-center gap-3 px-4 py-3 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            checked={editing.active}
                            onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                          />
                          <span className="text-sm font-medium text-slate-700">Aktif</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Görsel <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          className="text-black flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          value={editing.imageUrl}
                          onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                          placeholder="Görsel URL'si veya dosya yükleyin"
                        />
                        <label className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-colors">
                          <Upload className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-700">Yükle</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const url = await uploadImage(f);
                              setEditing((d) => ({ ...d, imageUrl: url }));
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditing(EMPTY);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={save}
                    disabled={saving || !editing.title || !editing.imageUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  );
}