// File: app/admin/proje-ekle/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { db } from "../../../../firebase/config";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  doc as fsDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  ref as refFromURL,
} from "firebase/storage";

// ✅ react-quill-new
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type ServiceDoc = {
  id: string;
  name: string;
  slug: string;
};

type ProjectForm = {
  title: string;
  description: string; // ✅ HTML (Quill)
  status: "finished" | "ongoing";
  serviceId: string;
  client?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  images: File[]; // sadece YENİ eklenecek medya dosyaları (görsel/video)
};

type ProjectDoc = {
  id: string;
  title: string;
  slug: string;
  description: string; // ✅ HTML (Quill)
  status: "finished" | "ongoing";
  serviceId: string;
  client?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  images: string[]; // tüm mevcut URL’ler (görsel/video)
  coverImageUrl?: string;
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

// ✅ Quill HTML -> plain text validation
function stripHtml(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// ✅ Video URL kontrolcü (render ederken kullanmak için)
function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export default function ProjeEklePage() {
  const [services, setServices] = useState<ServiceDoc[] | null>(null);
  const [servicesMap, setServicesMap] = useState<Record<string, ServiceDoc>>({});
  const [projects, setProjects] = useState<ProjectDoc[] | null>(null);

  // ——— FORM STATE ———
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    status: "ongoing",
    serviceId: "",
    client: "",
    location: "",
    startDate: "",
    endDate: "",
    images: [], // YENİ dosyalar (görsel veya video)
  });

  // ✅ Quill toolbar/modules
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "align",
      "blockquote",
      "code-block",
      "link",
    ],
    []
  );

  // Yeni dosya önizlemeleri
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // Düzenleme moduna özel: mevcut medya URL’leri ve silinecekler
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [removedExistingUrls, setRemovedExistingUrls] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Liste filtreleri
  const [filterStatus, setFilterStatus] = useState<"all" | "ongoing" | "finished">("all");
  const [search, setSearch] = useState("");

  const storage = useMemo(() => getStorage(), []);

  // ——— HİZMETLER ———
  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "services"), orderBy("name", "asc"));
        const snap = await getDocs(q);
        const list: ServiceDoc[] = snap.docs.map((d) => ({
          id: d.id,
          name: (d.data() as any).name,
          slug: (d.data() as any).slug,
        }));
        setServices(list);
        const map: Record<string, ServiceDoc> = {};
        list.forEach((s) => (map[s.id] = s));
        setServicesMap(map);
      } catch (e) {
        console.error(e);
        setServices([]);
        setServicesMap({});
      }
    })();
  }, []);

  // ——— PROJELER (canlı) ———
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: ProjectDoc[] = snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            title: x.title,
            slug: x.slug,
            description: x.description,
            status: x.status,
            serviceId: x.serviceId,
            client: x.client ?? null,
            location: x.location ?? null,
            startDate: x.startDate ?? null,
            endDate: x.endDate ?? null,
            images: x.images || [],
            coverImageUrl: x.coverImageUrl,
            createdAt: x.createdAt ?? null,
            updatedAt: x.updatedAt ?? null,
          };
        });
        setProjects(list);
      },
      (err) => {
        console.error(err);
        setProjects([]);
      }
    );
    return () => unsub();
  }, []);

  // ——— DOSYA SEÇİMİ (YENİ) (Video Desteği Eklendi) ———
  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Sadece görsel veya video olanları al
    const validFiles = files.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));

    if (validFiles.length !== files.length) {
      setMessage({ type: "err", text: "Lütfen yalnızca görsel veya video dosyaları seçin." });
    }
    setForm((p) => ({ ...p, images: validFiles }));
    setNewPreviews(validFiles.map((f) => URL.createObjectURL(f)));
  };

  // Yeni seçilenlerden tek tek kaldır
  const removeNewImageAt = (idx: number) => {
    setForm((p) => {
      const copy = [...p.images];
      copy.splice(idx, 1);
      return { ...p, images: copy };
    });
    setNewPreviews((pv) => {
      const copy = [...pv];
      copy.splice(idx, 1);
      return copy;
    });
  };

  // Mevcut (URL) medyadan kaldır
  const removeExistingAt = (idx: number) => {
    setExistingImageUrls((prev) => {
      const url = prev[idx];
      const next = [...prev];
      next.splice(idx, 1);
      // silinecek listesine ekle
      setRemovedExistingUrls((del) => (url ? [...del, url] : del));
      return next;
    });
  };

  // ——— FORM VALIDATION ———
  const validate = async () => {
    if (!form.title.trim()) return "Proje başlığı zorunludur.";
    if (form.title.trim().length < 3) return "Başlık en az 3 karakter olmalı.";

    const descText = stripHtml(form.description || "");
    if (!descText) return "Proje açıklaması zorunludur.";

    if (!form.serviceId) return "Lütfen bir hizmet seçin.";

    if (!editingId) {
      if (form.images.length === 0) return "En az bir medya (görsel/video) ekleyin.";
    } else {
      if (existingImageUrls.length === 0 && form.images.length === 0) {
        return "En az bir medya bırakın veya yeni medya ekleyin.";
      }
    }

    try {
      const sDoc = await getDoc(fsDoc(db, "services", form.serviceId));
      if (!sDoc.exists()) return "Seçilen hizmet bulunamadı.";
    } catch {
      return "Hizmet doğrulaması başarısız.";
    }
    return null;
  };

  // ——— KAYDET ———
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const err = await validate();
    if (err) {
      setMessage({ type: "err", text: err });
      return;
    }

    try {
      setSubmitting(true);

      const slugBase = slugify(form.title);
      const stamp = Date.now();

      const options = {
        maxSizeMB: 1.25,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      };

      const uploadedUrls: string[] = [];
      for (let i = 0; i < form.images.length; i++) {
        const file = form.images[i];
        const isVideo = file.type.startsWith("video/");

        let fileToUpload: File | Blob = file;

        // Sadece görselleri sıkıştır, videoları doğrudan yükle
        if (!isVideo) {
          fileToUpload = await imageCompression(file, options);
        }

        const ext = (file.name.split(".").pop() || (isVideo ? "mp4" : "jpg")).toLowerCase();
        const path = `projects/${slugBase}-${stamp}/${i + 1}.${ext}`;
        const sref = storageRef(storage, path);
        await uploadBytes(sref, fileToUpload);
        const url = await getDownloadURL(sref);
        uploadedUrls.push(url);
      }

      if (!editingId) {
        // YENİ PROJE
        const allImages = [...uploadedUrls];
        const coverImageUrl = allImages[0] || "";
        await addDoc(collection(db, "projects"), {
          title: form.title.trim(),
          slug: slugBase,
          description: form.description,
          status: form.status,
          serviceId: form.serviceId,
          client: form.client?.trim() || null,
          location: form.location?.trim() || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          images: allImages,
          coverImageUrl,
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setMessage({ type: "ok", text: "Proje başarıyla eklendi 🎉" });
        resetForm();
      } else {
        // DÜZENLEME
        const finalImages = [...existingImageUrls, ...uploadedUrls];
        const coverImageUrl = finalImages[0] || "";

        await updateDoc(fsDoc(db, "projects", editingId), {
          title: form.title.trim(),
          slug: slugBase,
          description: form.description,
          status: form.status,
          serviceId: form.serviceId,
          client: form.client?.trim() || null,
          location: form.location?.trim() || null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          images: finalImages,
          coverImageUrl,
          updatedAt: serverTimestamp(),
        });

        for (const url of removedExistingUrls) {
          try {
            const r = refFromURL(storage, url);
            await deleteObject(r);
          } catch (er) {
            console.warn("Medya silinemedi:", url, er);
          }
        }

        setMessage({ type: "ok", text: "Proje güncellendi." });
        resetForm();
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: "err", text: "Kayıt sırasında bir hata oluştu. Konsolu kontrol edin." });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "ongoing",
      serviceId: "",
      client: "",
      location: "",
      startDate: "",
      endDate: "",
      images: [],
    });
    setNewPreviews([]);
    setExistingImageUrls([]);
    setRemovedExistingUrls([]);
    setEditingId(null);
  };

  // ——— LİSTE ———
  const filteredProjects = (projects ?? []).filter((p) => {
    const passStatus = filterStatus === "all" ? true : p.status === filterStatus;
    const key = search.trim().toLowerCase();
    const passSearch =
      !key ||
      p.title.toLowerCase().includes(key) ||
      stripHtml(p.description ?? "").toLowerCase().includes(key) ||
      (servicesMap[p.serviceId]?.name ?? "").toLowerCase().includes(key);
    return passStatus && passSearch;
  });

  const startEdit = (p: ProjectDoc) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      status: p.status,
      serviceId: p.serviceId,
      client: p.client ?? "",
      location: p.location ?? "",
      startDate: p.startDate ?? "",
      endDate: p.endDate ?? "",
      images: [],
    });
    setExistingImageUrls(p.images || []);
    setRemovedExistingUrls([]);
    setNewPreviews([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    resetForm();
  };

  const deleteProject = async (p: ProjectDoc) => {
    const yes = confirm(`"${p.title}" projesini silmek istiyor musun? Bu işlem medyaları da kaldırır.`);
    if (!yes) return;

    try {
      for (const url of p.images || []) {
        try {
          const r = refFromURL(storage, url);
          await deleteObject(r);
        } catch (e) {
          console.warn("Medya silinemedi:", url, e);
        }
      }

      await deleteDoc(fsDoc(db, "projects", p.id));
      setMessage({ type: "ok", text: "Proje ve medyaları silindi." });
      if (editingId === p.id) resetForm();
    } catch (e) {
      console.error(e);
      setMessage({ type: "err", text: "Silme sırasında hata oluştu." });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-3 md:px-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
            {editingId ? "Projeyi Düzenle" : "Proje Ekle"}
          </h1>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 underline"
            >
              Düzenlemeyi İptal Et
            </button>
          )}
        </div>

        {/* ——— FORM ——— */}
        <form
          onSubmit={handleSubmit}
          className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 ${editingId ? "ring-1 ring-blue-100" : ""}`}
        >
          {/* Başlık */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Proje Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Örn: City Park Konut Projesi"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Hizmet seçimi */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
              Hizmet <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              value={form.serviceId}
              onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">— Seçin —</option>
              {services === null && <option>Yükleniyor…</option>}
              {services?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Durum */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Durum <span className="text-red-500">*</span>
            </span>
            <div className="text-black flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="ongoing"
                  checked={form.status === "ongoing"}
                  onChange={() => setForm((p) => ({ ...p, status: "ongoing" }))}
                />
                <span>Devam Eden</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="finished"
                  checked={form.status === "finished"}
                  onChange={() => setForm((p) => ({ ...p, status: "finished" }))}
                />
                <span>Bitmiş</span>
              </label>
            </div>
          </div>

          {/* Opsiyonel detaylar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                Müşteri / Firma (opsiyonel)
              </label>
              <input
                id="client"
                type="text"
                value={form.client}
                onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))}
                placeholder="Örn: ABC İnşaat"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Konum (opsiyonel)
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Örn: Tekirdağ / Kapaklı"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                Başlangıç Tarihi (opsiyonel)
              </label>
              <input
                id="start"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                Bitiş Tarihi (opsiyonel)
              </label>
              <input
                id="end"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* ✅ Açıklama (ReactQuill) */}
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
              Proje Açıklaması <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 rounded-lg border border-gray-300 overflow-hidden text-black">
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(val: string) => setForm((p) => ({ ...p, description: val }))}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Projenin kapsamı, yapılan işler, kullanılan malzemeler vb..."
              />
            </div>
          </div>

          {/* Medya */}
          <div className="space-y-3">
            {/* Mevcut görseller/videolar (sadece düzenleme modunda) */}
            {editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Mevcut Medyalar</label>
                {existingImageUrls.length === 0 ? (
                  <p className="mt-1 text-xs text-gray-500">Bu projede kayıtlı görsel/video kalmadı.</p>
                ) : (
                  <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {existingImageUrls.map((src, idx) => (
                      <div key={src + idx} className="relative h-24 w-full overflow-hidden rounded-md ring-1 ring-gray-200">
                        {isVideoUrl(src) ? (
                          <video src={src} className="object-cover w-full h-full" muted playsInline />
                        ) : (
                          <Image src={src} alt={`Mevcut ${idx + 1}`} fill className="object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingAt(idx)}
                          className="absolute top-1 right-1 rounded bg-black/60 text-white text-xs px-2 py-0.5"
                          title="Kaldır (sil)"
                        >
                          Kaldır
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Yeni görseller/videolar */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {editingId ? "Yeni Görsel/Video Ekle (opsiyonel)" : "Proje Medyası (Görsel veya Video) *"}
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                  {/* Hem resim hem video seçilebilsin diye accept güncellendi */}
                  <input type="file" accept="image/*,video/*" multiple onChange={onFilesChange} className="hidden" />
                  Dosya Seç
                </label>

                {newPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 w-full">
                    {newPreviews.map((src, idx) => {
                      const isVideo = form.images[idx]?.type.startsWith("video/");
                      return (
                        <div key={src + idx} className="relative h-24 w-full overflow-hidden rounded-md ring-1 ring-gray-200">
                          {isVideo ? (
                            <video src={src} className="object-cover w-full h-full" muted playsInline />
                          ) : (
                            <Image src={src} alt={`Yeni ${idx + 1}`} fill className="object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeNewImageAt(idx)}
                            className="absolute top-1 right-1 rounded bg-black/60 text-white text-xs px-2 py-0.5"
                            title="Kaldır"
                          >
                            Kaldır
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mesaj */}
          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${message.type === "ok"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Gönder */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? (editingId ? "Güncelleniyor..." : "Kaydediliyor...") : editingId ? "Projeyi Güncelle" : "Projeyi Kaydet"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Vazgeç
              </button>
            )}
          </div>
        </form>

        {/* ——— LİSTE ——— */}
        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Eklenmiş Projeler</h2>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
              >
                <option value="all">Tümü</option>
                <option value="ongoing">Devam Eden</option>
                <option value="finished">Bitmiş</option>
              </select>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ara: başlık, açıklama, hizmet..."
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 w-56"
              />
            </div>
          </div>

          {projects === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                  <div className="h-40 w-full rounded-lg bg-gray-200" />
                  <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              Kayıt bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((p) => {
                const cover = p.coverImageUrl || p.images?.[0] || "/placeholder.jpg";
                const isCoverVideo = isVideoUrl(cover);
                const serviceName = servicesMap[p.serviceId]?.name || "—";
                const isEditingCard = editingId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border bg-white overflow-hidden shadow-sm ${isEditingCard ? "border-blue-300 ring-1 ring-blue-100" : "border-gray-200"
                      }`}
                  >
                    <div className="relative h-40 w-full">
                      {isCoverVideo ? (
                        <video
                          src={cover}
                          className="object-cover w-full h-full"
                          muted
                          playsInline
                        />
                      ) : (
                        <Image
                          src={cover}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      )}
                      {p.status && (
                        <span
                          className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full border ${p.status === "ongoing"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                        >
                          {p.status === "ongoing" ? "Devam Eden" : "Bitmiş"}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">Hizmet: {serviceName}</p>
                      {p.location && <p className="mt-0.5 text-xs text-gray-500">Konum: {p.location}</p>}

                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{stripHtml(p.description)}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Düzenle
                        </button>
                        <button onClick={() => deleteProject(p)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}