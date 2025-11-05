// File: app/admin/hizmet-ekle/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { db } from "../../../../firebase/config";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

type ServiceForm = {
  name: string;
  description: string;
  imageFile: File | null;
};

type ServiceDoc = {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  active?: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Firebase downloadURL -> storage path (services/xxx.jpg) çevirici
function storagePathFromDownloadURL(url: string) {
  // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path-encoded>?...
  // veya app subdomainiyle de olabilir; biz /o/ ile ? arasını alıyoruz.
  try {
    const u = new URL(url);
    const afterO = u.pathname.split("/o/")[1] || "";
    const encodedPath = afterO; // services%2Fabc.jpg
    const raw = encodedPath.split("?")[0];
    return decodeURIComponent(raw); // services/abc.jpg
  } catch {
    return null;
  }
}

export default function HizmetEklePage() {
  const [form, setForm] = useState<ServiceForm>({
    name: "",
    description: "",
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [services, setServices] = useState<ServiceDoc[] | null>(null);

  // Edit modal state
  const [editing, setEditing] = useState<ServiceDoc | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const storage = useMemo(() => getStorage(), []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.type.startsWith("image/")) {
      setMessage({ type: "err", text: "Lütfen yalnızca görsel dosyası seçin." });
      return;
    }
    setForm((p) => ({ ...p, imageFile: file }));
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const validate = () => {
    if (!form.name.trim()) return "Hizmet adı zorunludur.";
    if (form.name.trim().length < 2) return "Hizmet adı en az 2 karakter olmalı.";
    if (!form.description.trim()) return "Açıklama zorunludur.";
    if (!form.imageFile) return "Lütfen bir görsel seçin.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const err = validate();
    if (err) {
      setMessage({ type: "err", text: err });
      return;
    }

    try {
      setSubmitting(true);

      // 1) Görseli sıkıştır
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true };
      const compressedFile = await imageCompression(form.imageFile!, options);

      // 2) Storage’a yükle
      const slug = slugify(form.name);
      const stamp = Date.now();
      const ext = form.imageFile!.name.split(".").pop() || "jpg";
      const path = `services/${slug}-${stamp}.${ext}`;
      const sref = storageRef(storage, path);
      await uploadBytes(sref, compressedFile);
      const imageUrl = await getDownloadURL(sref);

      // 3) Firestore’a kaydet
      await addDoc(collection(db, "services"), {
        name: form.name.trim(),
        description: form.description.trim(),
        slug,
        imageUrl,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMessage({ type: "ok", text: "Hizmet başarıyla eklendi 🎉" });
      setForm({ name: "", description: "", imageFile: null });
      setPreviewUrl(null);
    } catch (e: any) {
      console.error(e);
      setMessage({ type: "err", text: "Kayıt sırasında bir hata oluştu. Konsolu kontrol edin." });
    } finally {
      setSubmitting(false);
    }
  };

  // Eklenmiş hizmetleri canlı dinle (en yeni en üstte)
  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: ServiceDoc[] = snap.docs.map((d) => {
          const data = d.data() as Omit<ServiceDoc, "id">;
          return {
            id: d.id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            imageUrl: data.imageUrl,
            active: data.active,
            createdAt: (data as any).createdAt ?? null,
            updatedAt: (data as any).updatedAt ?? null,
          };
        });
        setServices(list);
      },
      (err) => {
        console.error(err);
        setServices([]);
      }
    );
    return () => unsub();
  }, []);

  // ========== Delete ==========
  const handleDelete = async (s: ServiceDoc) => {
    const ok = confirm(`"${s.name}" hizmetini silmek istediğine emin misin?`);
    if (!ok) return;

    try {
      // 1) Storage görselini sil
      if (s.imageUrl) {
        const path = storagePathFromDownloadURL(s.imageUrl);
        if (path) {
          await deleteObject(storageRef(storage, path));
        }
      }
      // 2) Firestore dokümanı sil
      await deleteDoc(doc(db, "services", s.id));
      setMessage({ type: "ok", text: "Hizmet silindi." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "err", text: "Silme işlemi sırasında hata oluştu." });
    }
  };

  // ========== Edit ==========
  const openEdit = (s: ServiceDoc) => {
    setEditing(s);
    setEditName(s.name);
    setEditDesc(s.description);
    setEditImageFile(null);
    setEditPreviewUrl(null);
  };

  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.type.startsWith("image/")) {
      alert("Lütfen yalnızca görsel dosyası seçin.");
      return;
    }
    setEditImageFile(file);
    setEditPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!editName.trim()) {
      alert("Hizmet adı zorunludur.");
      return;
    }
    if (!editDesc.trim()) {
      alert("Açıklama zorunludur.");
      return;
    }

    try {
      setEditSubmitting(true);

      let newImageUrl = editing.imageUrl;
      let newSlug = editing.slug;

      // Ad değişmişse slug’ı güncelle
      if (slugify(editName) !== editing.slug) {
        newSlug = slugify(editName);
      }

      // Yeni görsel seçildiyse:
      if (editImageFile) {
        // 1) yeni görseli sıkıştır + yükle
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true };
        const compressed = await imageCompression(editImageFile, options);

        const ext = editImageFile.name.split(".").pop() || "jpg";
        const stamp = Date.now();
        const newPath = `services/${newSlug}-${stamp}.${ext}`;
        const sref = storageRef(storage, newPath);
        await uploadBytes(sref, compressed);
        const uploadedUrl = await getDownloadURL(sref);

        // 2) eski görseli sil (varsa)
        if (editing.imageUrl) {
          const oldPath = storagePathFromDownloadURL(editing.imageUrl);
          if (oldPath) {
            try {
              await deleteObject(storageRef(storage, oldPath));
            } catch (e) {
              // Eski görsel silinemese de kritik değil—loglayıp devam
              console.warn("Eski görsel silinemedi:", e);
            }
          }
        }

        newImageUrl = uploadedUrl;
      }

      // Firestore güncelle
      await updateDoc(doc(db, "services", editing.id), {
        name: editName.trim(),
        description: editDesc.trim(),
        slug: newSlug,
        imageUrl: newImageUrl,
        updatedAt: serverTimestamp(),
      });

      setMessage({ type: "ok", text: "Hizmet güncellendi." });
      setEditing(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: "err", text: "Güncelleme sırasında hata oluştu." });
    } finally {
      setEditSubmitting(false);
    }
  };

  const closeEdit = () => {
    setEditing(null);
    setEditImageFile(null);
    setEditPreviewUrl(null);
    setEditSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-3 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-black">
          Hizmet Ekle
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5"
        >
          {/* Hizmet Adı */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Hizmet Adı <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Örn: İnşaat"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        
          </div>

          {/* Açıklama */}
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <textarea
              id="desc"
              rows={5}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Hizmet hakkında kısa bir açıklama..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Görsel */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Görsel <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                Görsel Seç
              </label>

              {previewUrl && (
                <div className="relative h-16 w-16 overflow-hidden rounded-md ring-1 ring-gray-200">
                  <Image
                    src={previewUrl}
                    alt="Önizleme"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mesaj */}
          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === "ok"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Gönder */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Kaydediliyor..." : "Hizmeti Kaydet"}
            </button>
          </div>
        </form>

        {/* Liste — Eklenmiş Hizmetler */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Eklenmiş Hizmetler</h2>
            {services && (
              <span className="text-sm text-gray-500">
                Toplam: <b>{services.length}</b>
              </span>
            )}
          </div>

          {/* Loading / Empty / Grid */}
          {services === null ? (
            // Loading state
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                  <div className="h-32 w-full rounded-md bg-gray-200" />
                  <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            // Empty state
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              Henüz hizmet eklenmemiş.
            </div>
          ) : (
            // Grid of services
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div key={s.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="relative h-40 w-full bg-gray-50">
                    {s.imageUrl ? (
                      <Image
                        src={s.imageUrl}
                        alt={s.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-gray-400">
                        Görsel yok
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{s.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">{s.description}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span className="truncate">/{s.slug}</span>
                      {s.createdAt?.toDate && (
                        <span>{s.createdAt.toDate().toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={submitEdit}
            className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Hizmeti Düzenle</h3>
              <button type="button" onClick={closeEdit} className="text-gray-500 hover:text-gray-800">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hizmet Adı</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Slug: <b>{slugify(editName) || editing.slug}</b>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <textarea
                rows={4}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Görsel</label>
              <div className="mt-2 flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                  <input type="file" accept="image/*" onChange={onEditFileChange} className="hidden" />
                  Yeni Görsel Seç
                </label>

                <div className="relative h-16 w-16 overflow-hidden rounded-md ring-1 ring-gray-200">
                  <Image
                    src={editPreviewUrl || editing.imageUrl}
                    alt="Önizleme"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Boş bırakırsan mevcut görsel korunur.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeEdit}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={editSubmitting}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {editSubmitting ? "Güncelleniyor..." : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
