// app/admin/panel/page.tsx
import DashboardStats from "./components/DashboardStats";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Hoş Geldin, Yönetici!</h1>
      <DashboardStats />
    </div>
  );
}