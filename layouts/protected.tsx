import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import useAuthStore from "hooks/auth";

export default function ProtectedLayout() {
  const { accessToken, userRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Jika tidak ada token, redirect ke login
    if (!accessToken) {
      navigate('/', { replace: true });
      return;
    }

    // Jika user mengakses root path /chat atau /admin langsung
    // redirect berdasarkan role mereka
    if (location.pathname === '/') {
      if (userRole === "ADMIN") {
        navigate('/admin', { replace: true });
      } else {
        navigate('/chat', { replace: true });
      }
    }
  }, [accessToken, userRole, navigate, location.pathname]);

  if (!accessToken) {
    return null;
  }

  return <Outlet />;
}