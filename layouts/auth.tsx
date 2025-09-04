import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="relative flex items-center justify-center pt-16 pb-4 min-h-screen overflow-hidden bg-gray-50">
      
      {/* Emerald splash elements - organic shapes */}
      <div className="absolute top-0 -left-40 w-[30rem] h-[10rem] bg-gradient-to-br from-emerald-500 via-emerald-300 to-emerald-400 rounded-full blur-[7rem]"></div>
      <div className="absolute bottom-0 -right-40 w-[30rem] h-[10rem] bg-gradient-to-br from-emerald-700 via-emerald-500 to-emerald-400 rounded-full blur-[8rem]"></div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        <Outlet/>
      </div>
    </main>
  );
}