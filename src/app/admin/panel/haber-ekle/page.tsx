// File: app/admin/haber-ekle/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { db } from "@/firebase/config";
import {
    addDoc,
    collection,
    deleteDoc,
    doc as fsDoc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    ref as refFromURL,
} from "firebase/storage";

/* ---------------- Types ---------------- */
type PostForm = {
    title: string;
    excerpt: string;
    content: string;
    status: "draft" | "published";
    category?: string;
    tags: string;          // virgül ile
    cover?: File | null;   // tek
    gallery: File[];       // çoklu
};

type PostDoc = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: "draft" | "published";
    category?: string | null;
    tags?: string[];       // parçalanmış
    coverUrl?: string | null;
    images?: string[];     // galeri
    createdAt?: any;
    updatedAt?: any;
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

/* ---------------- Page ---------------- */
export default function HaberEklePage() {
    const storage = useMemo(() => getStorage(), []);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    // Form state
    const [form, setForm] = useState<PostForm>({
        title: "",
        excerpt: "",
        content: "",
        status: "draft",
        category: "",
        tags: "",
        cover: null,
        gallery: [],
    });

    // Previews
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    // List & filters
    const [posts, setPosts] = useState<PostDoc[] | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published">("all");

    // Edit
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<Partial<PostDoc>>({});

    /* ----------- File handlers ----------- */
    const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setForm((p) => ({ ...p, cover: f }));
        setCoverPreview(f ? URL.createObjectURL(f) : null);
    };

    const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const onlyImages = files.filter((f) => f.type.startsWith("image/"));
        setForm((p) => ({ ...p, gallery: onlyImages }));
        setGalleryPreviews(onlyImages.map((f) => URL.createObjectURL(f)));
        if (onlyImages.length !== files.length) {
            setMsg({ type: "err", text: "Galeri için yalnızca görsel dosyaları seçin." });
        }
    };

    const removeGalleryAt = (i: number) => {
        setForm((p) => {
            const g = [...p.gallery];
            g.splice(i, 1);
            return { ...p, gallery: g };
        });
        setGalleryPreviews((pv) => {
            const cp = [...pv];
            cp.splice(i, 1);
            return cp;
        });
    };

    /* ----------- Fetch posts (live) ----------- */
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(
            q,
            (snap) => {
                const list: PostDoc[] = snap.docs.map((d) => {
                    const x = d.data() as any;
                    return {
                        id: d.id,
                        title: x.title,
                        slug: x.slug,
                        excerpt: x.excerpt,
                        content: x.content,
                        status: x.status,
                        category: x.category ?? null,
                        tags: x.tags ?? [],
                        coverUrl: x.coverUrl ?? null,
                        images: x.images ?? [],
                        createdAt: x.createdAt ?? null,
                        updatedAt: x.updatedAt ?? null,
                    };
                });
                setPosts(list);
            },
            (err) => {
                console.error(err);
                setPosts([]);
            }
        );
        return () => unsub();
    }, []);

    /* ----------- Validation ----------- */
    const validate = async () => {
        if (!form.title.trim()) return "Başlık zorunludur.";
        if (!form.excerpt.trim() || form.excerpt.trim().length < 10) return "Özet en az 10 karakter olmalı.";
        if (!form.content.trim() || form.content.trim().length < 20) return "İçerik en az 20 karakter olmalı.";
        if (!form.cover) return "Kapak görseli zorunludur.";
        return null;
    };

    /* ----------- Submit ----------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        const err = await validate();
        if (err) {
            setMsg({ type: "err", text: err });
            return;
        }

        try {
            setSubmitting(true);
            const stamp = Date.now();
            const slug = slugify(form.title);

            // compression options
            const options = { maxSizeMB: 1.25, maxWidthOrHeight: 2000, useWebWorker: true };

            // Upload cover
            let coverUrl: string | null = null;
            if (form.cover) {
                const cExt = (form.cover.name.split(".").pop() || "jpg").toLowerCase();
                const compressed = await imageCompression(form.cover, options);
                const path = `posts/${slug}-${stamp}/cover.${cExt}`;
                const ref = storageRef(storage, path);
                await uploadBytes(ref, compressed);
                coverUrl = await getDownloadURL(ref);
            }

            // Upload gallery
            const galleryUrls: string[] = [];
            for (let i = 0; i < form.gallery.length; i++) {
                const f = form.gallery[i];
                const gExt = (f.name.split(".").pop() || "jpg").toLowerCase();
                const compressed = await imageCompression(f, options);
                const path = `posts/${slug}-${stamp}/gallery-${i + 1}.${gExt}`;
                const ref = storageRef(storage, path);
                await uploadBytes(ref, compressed);
                const url = await getDownloadURL(ref);
                galleryUrls.push(url);
            }

            // tags split
            const tags = form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            // Save Firestore
            await addDoc(collection(db, "posts"), {
                title: form.title.trim(),
                slug,
                excerpt: form.excerpt.trim(),
                content: form.content.trim(),
                status: form.status,
                category: form.category?.trim() || null,
                tags,
                coverUrl,
                images: galleryUrls,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setMsg({ type: "ok", text: "Gönderi eklendi 🎉" });
            // reset
            setForm({
                title: "",
                excerpt: "",
                content: "",
                status: "draft",
                category: "",
                tags: "",
                cover: null,
                gallery: [],
            });
            setCoverPreview(null);
            setGalleryPreviews([]);
        } catch (e) {
            console.error(e);
            setMsg({ type: "err", text: "Kayıt sırasında hata oluştu. Konsolu kontrol edin." });
        } finally {
            setSubmitting(false);
        }
    };

    /* ----------- Edit helpers ----------- */
    const startEdit = (p: PostDoc) => {
        setEditingId(p.id);
        setEditDraft({
            title: p.title,
            excerpt: p.excerpt,
            content: p.content,
            status: p.status,
            category: p.category || "",
            tags: p.tags || [],
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDraft({});
    };

    const saveEdit = async (id: string) => {
        try {
            if (!editDraft.title || !editDraft.excerpt || !editDraft.content || !editDraft.status) {
                setMsg({ type: "err", text: "Lütfen zorunlu alanları doldurun." });
                return;
            }

            // optional slug change if title changed? (keep stable—don’t change)
            await updateDoc(fsDoc(db, "posts", id), {
                title: (editDraft.title as string).trim(),
                excerpt: (editDraft.excerpt as string).trim(),
                content: (editDraft.content as string).trim(),
                status: editDraft.status,
                category: (editDraft.category as string) || null,
                tags: Array.isArray(editDraft.tags)
                    ? editDraft.tags
                    : String(editDraft.tags || "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                updatedAt: serverTimestamp(),
            });

            setMsg({ type: "ok", text: "Gönderi güncellendi." });
            cancelEdit();
        } catch (e) {
            console.error(e);
            setMsg({ type: "err", text: "Güncelleme sırasında hata oluştu." });
        }
    };

    const deletePost = async (p: PostDoc) => {
        const yes = confirm(`"${p.title}" gönderisini silmek istiyor musun? (Görseller de kaldırılır)`);
        if (!yes) return;

        try {
            // delete images from storage
            if (p.coverUrl) {
                try {
                    await deleteObject(refFromURL(storage, p.coverUrl));
                } catch (e) {
                    console.warn("Kapak silinemedi:", e);
                }
            }
            for (const url of p.images || []) {
                try {
                    await deleteObject(refFromURL(storage, url));
                } catch (e) {
                    console.warn("Galeri görseli silinemedi:", url, e);
                }
            }

            // delete doc
            await deleteDoc(fsDoc(db, "posts", p.id));
            setMsg({ type: "ok", text: "Gönderi ve görseller silindi." });
        } catch (e) {
            console.error(e);
            setMsg({ type: "err", text: "Silme sırasında hata oluştu." });
        }
    };

    const filtered = (posts ?? []).filter((p) => {
        const key = search.trim().toLowerCase();
        const passStatus = filterStatus === "all" ? true : p.status === filterStatus;
        const passSearch =
            !key ||
            p.title.toLowerCase().includes(key) ||
            (p.excerpt || "").toLowerCase().includes(key) ||
            (p.category || "").toLowerCase().includes(key) ||
            (p.tags || []).join(",").toLowerCase().includes(key);
        return passStatus && passSearch;
    });

    return (
        <main className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-3 md:px-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-black">
                    Haber & Blog Ekle
                </h1>

                {/* ---- FORM ---- */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6"
                >
                    {/* Üst satır: Başlık + Durum */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Başlık <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Örn: Yeni Şantiye Sürecimiz"
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-gray-700 mb-2">Durum</span>
                            <div className="text-black flex items-center gap-4">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        checked={form.status === "draft"}
                                        onChange={() => setForm((p) => ({ ...p, status: "draft" }))}
                                    />
                                    <span>Taslak</span>
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="published"
                                        checked={form.status === "published"}
                                        onChange={() => setForm((p) => ({ ...p, status: "published" }))}
                                    />
                                    <span>Yayında</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Özet */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Özet <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={form.excerpt}
                            onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                            placeholder="Haberin/Blog yazısının kısa özeti…"
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* İçerik */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            İçerik <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={10}
                            value={form.content}
                            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                            placeholder="Detaylı içerik metni…"
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Kategori & Etiketler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <input
                                value={form.category}
                                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                placeholder="Örn: Duyuru, Şantiye, Ürün"
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Etiketler</label>
                            <input
                                value={form.tags}
                                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                                placeholder="virgül ile: dekorasyon, tadilat, boya"
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Kapak */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Kapak Görseli <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2 flex items-center gap-4">
                            <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                                <input type="file" accept="image/*" onChange={onCoverChange} className="hidden" />
                                Kapak Seç
                            </label>
                            {coverPreview && (
                                <div className="relative h-24 w-36 overflow-hidden rounded-md ring-1 ring-gray-200">
                                    <Image
                                        src={coverPreview}
                                        alt="Kapak önizleme"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Galeri (opsiyonel) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Galeri Görselleri (opsiyonel)
                        </label>
                        <div className="mt-2 flex flex-wrap items-center gap-4">
                            <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50">
                                <input type="file" accept="image/*" multiple onChange={onGalleryChange} className="hidden" />
                                Galeri Seç (Çoklu)
                            </label>
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 w-full">
                                    {galleryPreviews.map((src, i) => (
                                        <div key={i} className="relative h-20 w-full overflow-hidden rounded-md ring-1 ring-gray-200">
                                            <Image src={src} alt={`Galeri önizleme ${i + 1}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryAt(i)}
                                                className="absolute top-1 right-1 rounded bg-black/60 text-white text-xs px-2 py-0.5"
                                            >
                                                Kaldır
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mesaj */}
                    {msg && (
                        <div
                            className={`rounded-lg px-4 py-3 text-sm ${msg.type === "ok"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                        >
                            {msg.text}
                        </div>
                    )}

                    {/* Gönder */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {submitting ? "Kaydediliyor..." : "Gönderiyi Kaydet"}
                        </button>
                    </div>
                </form>

                {/* ---- LIST ---- */}
                <section className="mt-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Gönderiler</h2>
                        <div className="flex items-center gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                            >
                                <option value="all">Tümü</option>
                                <option value="draft">Taslak</option>
                                <option value="published">Yayında</option>
                            </select>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Ara: başlık, özet, kategori, etiket…"
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 w-56"
                            />
                        </div>
                    </div>

                    {posts === null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                                    <div className="h-40 w-full rounded-lg bg-gray-200" />
                                    <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded" />
                                    <div className="mt-2 h-3 w-3/4 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                            Kayıt bulunamadı.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((p) => {
                                const cover = p.coverUrl || p.images?.[0] || "/placeholder.jpg";
                                const isEditing = editingId === p.id;
                                return (
                                    <div key={p.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                                        <div className="relative h-40 w-full">
                                            <Image
                                                src={cover}
                                                alt={p.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 33vw"
                                            />
                                            <span
                                                className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full border ${p.status === "published"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                    }`}
                                            >
                                                {p.status === "published" ? "Yayında" : "Taslak"}
                                            </span>
                                        </div>

                                        {!isEditing ? (
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                                                {p.category && (
                                                    <p className="mt-0.5 text-xs text-gray-500">Kategori: {p.category}</p>
                                                )}
                                                {p.tags && p.tags.length > 0 && (
                                                    <p className="mt-0.5 text-xs text-gray-500">Etiketler: {p.tags.join(", ")}</p>
                                                )}
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{p.excerpt}</p>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <button
                                                        onClick={() => startEdit(p)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        Düzenle
                                                    </button>
                                                    <button
                                                        onClick={() => deletePost(p)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 space-y-3">
                                                <input
                                                    value={(editDraft.title as string) || ""}
                                                    onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                    placeholder="Başlık"
                                                />
                                                <textarea
                                                    rows={3}
                                                    value={(editDraft.excerpt as string) || ""}
                                                    onChange={(e) => setEditDraft((d) => ({ ...d, excerpt: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                    placeholder="Özet"
                                                />
                                                <textarea
                                                    rows={6}
                                                    value={(editDraft.content as string) || ""}
                                                    onChange={(e) => setEditDraft((d) => ({ ...d, content: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                    placeholder="İçerik"
                                                />
                                                <input
                                                    value={(editDraft.category as string) || ""}
                                                    onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                    placeholder="Kategori"
                                                />
                                                <input
                                                    value={
                                                        Array.isArray(editDraft.tags)
                                                            ? (editDraft.tags as string[]).join(", ")
                                                            : typeof editDraft.tags === "string"
                                                                ? editDraft.tags
                                                                : ""
                                                    }
                                                    onChange={(e) =>
                                                        setEditDraft((d) => ({
                                                            ...d,
                                                            tags: e.target.value
                                                                .split(",")
                                                                .map((t) => t.trim())
                                                                .filter(Boolean),
                                                        }))
                                                    }
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                    placeholder="Etiketler (virgül ile)"
                                                />
                                                <div className="flex items-center gap-4 text-sm">
                                                    <label className="inline-flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`status-${p.id}`}
                                                            value="draft"
                                                            checked={editDraft.status === "draft"}
                                                            onChange={() => setEditDraft((d) => ({ ...d, status: "draft" }))}
                                                        />
                                                        <span>Taslak</span>
                                                    </label>
                                                    <label className="inline-flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`status-${p.id}`}
                                                            value="published"
                                                            checked={editDraft.status === "published"}
                                                            onChange={() => setEditDraft((d) => ({ ...d, status: "published" }))}
                                                        />
                                                        <span>Yayında</span>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-end gap-3 pt-1">
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                                    >
                                                        Vazgeç
                                                    </button>
                                                    <button
                                                        onClick={() => saveEdit(p.id)}
                                                        className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-1.5 text-sm font-semibold"
                                                    >
                                                        Kaydet
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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
