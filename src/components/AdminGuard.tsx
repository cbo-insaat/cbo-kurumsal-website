"use client";

import { ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState<null | boolean>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        setOk(false);
        router.replace("/admin/giris");
        return;
      }
      try {
        const q = query(
          collection(db, "admins"),
          where("email", "==", user.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setOk(true);
        } else {
          await signOut(auth);
          setOk(false);
          router.replace("/admin/giris?e=unauthorized");
        }
      } catch (e) {
        await signOut(auth);
        setOk(false);
        router.replace("/admin/giris?e=error");
      }
    });
    return () => unsub();
  }, [router]);

  if (ok === null) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-gray-500">Kontrol ediliyor…</div>
      </div>
    );
  }

  if (!ok) return null; // yönlendirme yapılacak

  return <>{children}</>;
}
