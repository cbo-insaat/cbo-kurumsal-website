// app/admin/panel/components/ProjectManager.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../firebase/config";
import { Plus, Trash2, Upload } from "lucide-react";

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const snap = await getDocs(collection(db, "projects"));
    setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const upload = async (file: File) => {
    const refPath = ref(storage, `projects/${Date.now()}_${file.name}`);
    await uploadBytes(refPath, file);
    return getDownloadURL(refPath);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Resim seç!");
    setLoading(true);
    try {
      const url = await upload(image);
      await addDoc(collection(db, "projects"), { name, description: desc, image: url, createdAt: new Date() });
      alert("Eklendi!");
      setName(""); setDesc(""); setImage(null);
      fetchProjects();
    } catch { alert("Hata!"); }
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Sil?")) return;
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  };

  return (
    <>
      <form onSubmit={add} className="bg-white p-6 rounded-2xl shadow-lg border mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input placeholder="Proje Adı" value={name} onChange={e => setName(e.target.value)} className="px-4 py-3 border rounded-xl" required />
          <input placeholder="Açıklama" value={desc} onChange={e => setDesc(e.target.value)} className="px-4 py-3 border rounded-xl" required />
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="px-4 py-3 border rounded-xl" required />
          <button type="submit" disabled={loading} className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 flex items-center gap-2">
            <Plus className="w-5 h-5" /> {loading ? "Yükleniyor..." : "Ekle"}
          </button>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border">
            <img src={p.image} alt="" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-slate-600">{p.description}</p>
              <button onClick={() => remove(p.id)} className="mt-3 text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}