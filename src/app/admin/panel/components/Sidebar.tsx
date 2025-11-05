// app/admin/panel/components/Sidebar.tsx
"use client";

import { HardHat, Image, Wrench, LayoutDashboard, LogOut, Menu, X, Building2, Newspaper, MessageSquare, ClipboardList } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebase/config";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/admin/panel", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/panel/projects", label: "Projeler", icon: Building2 },
    { href: "/admin/panel/sliders", label: "Slider", icon: Image },
    { href: "/admin/panel/haber-ekle", label: "Haber & Blog", icon: Newspaper },
    { href: "/admin/panel/messages", label: "Mesajlar", icon: MessageSquare },
    { href: "/admin/panel/services", label: "Hizmetler", icon: Wrench },
    { href: "/admin/panel/teklifler", label: "Teklifler", icon: ClipboardList },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-amber-500 text-white rounded-xl shadow-lg"
            >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                            <HardHat className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">CBO İnşaat</h1>
                            <p className="text-amber-300 text-xs">Yönetim Paneli</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === item.href ? "bg-amber-500" : "hover:bg-slate-800"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={() => signOut(auth).then(() => (window.location.href = "/admin/giris"))}
                        className="mt-10 w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

// SVG fallback
const FileText = (props: any) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m-4 0v6h6m-8 6h8m-8 4h8m-8 4h5" />
    </svg>
);