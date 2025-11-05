"use client";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";

export function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await signOut(auth);
        window.location.href = "/admin/giris";
      }}
      className="rounded-lg border px-4 py-2 hover:bg-gray-50"
    >
      Çıkış Yap
    </button>
  );
}
