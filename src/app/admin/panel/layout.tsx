// app/admin/panel/layout.tsx
import Sidebar from "./components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
 
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}