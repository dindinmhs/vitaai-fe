import React from "react";
import "../../app/app.css";

const AdminMainDashboard: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="h-16 w-16 mb-6" />
        <h1 className="text-3xl font-bold text-[#1A2B3C] mb-2">Selamat Datang di Vita AI Admin</h1>
        <p className="text-gray-500 mb-6">Kelola laporan, user, dan aktivitas sistem di sini.</p>
        <div className="w-full max-w-xl">
          <input type="text" placeholder="Cari data admin..." className="w-full px-4 py-3 border rounded-lg focus:outline-none" />
        </div>
      </div>
    </main>
  );
};

export default AdminMainDashboard;
