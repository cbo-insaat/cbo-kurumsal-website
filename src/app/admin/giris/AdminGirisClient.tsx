"use client";

import { useState } from "react";
import { auth, db } from "../../../firebase/config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, HardHat, Lock, Mail, Loader2 } from "lucide-react";

export default function AdminGirisClient() {
  const router = useRouter();
  const params = useSearchParams(); // Artık Suspense içinde render ediliyor
  const [email, setEmail] = useState("info@cboinsaat.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const err = params.get("e");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // 1) UID ile kontrol
      const uidDocRef = doc(db, "admins", user.uid);
      const uidSnap = await getDoc(uidDocRef);
      let isAdmin = uidSnap.exists();

      // 2) Geri uyumluluk: e‑posta ile kontrol
      if (!isAdmin && user.email) {
        const emailDocRef = doc(db, "admins", user.email);
        const emailSnap = await getDoc(emailDocRef);
        isAdmin = emailSnap.exists();
      }

      if (!isAdmin) {
        await signOut(auth);
        alert("Yetkisiz kullanıcı. Yönetici değilsiniz.");
        return;
      }

      router.replace("/admin/panel");
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/invalid-credential") {
        alert("E‑posta veya şifre yanlış.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Çok fazla deneme. Bir süre sonra tekrar deneyin.");
      } else {
        alert("Giriş hatası: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Arka plan desen */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500 shadow-2xl mb-4">
              <HardHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">CBO İnşaat</h1>
            <p className="text-amber-200 text-lg">Yönetim Paneli</p>
          </div>

          {/* Kart */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Building2 className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Yönetici Girişi</h2>
                <p className="text-amber-100 text-sm">Sadece yetkili personel erişebilir</p>
              </div>
            </div>

            {/* Hata Mesajları */}
            {err === "unauthorized" && (
              <div className="mb-5 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur">
                <p className="text-red-200 text-sm font-medium">Bu alana erişim yetkiniz yok.</p>
              </div>
            )}
            {err === "error" && (
              <div className="mb-5 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl backdrop-blur">
                <p className="text-yellow-200 text-sm font-medium">Bir hata oluştu. Lütfen tekrar deneyin.</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-amber-100 text-sm font-medium mb-2">
                  <Mail className="w-4 h-4" />
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  placeholder="info@cboinsaat.com"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-amber-100 text-sm font-medium mb-2">
                  <Lock className="w-4 h-4" />
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/50 transform hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Güvenli Giriş Yap
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-amber-200/70 text-xs">© 2025 CBO İnşaat. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
