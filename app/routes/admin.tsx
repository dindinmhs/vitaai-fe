import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import AdminDashboard from "../../components/admin/dashboard";
import useAuthStore from "../../hooks/auth";

const AdminRoute: React.FC = () => {
  const { userRole, accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Jika tidak ada token atau bukan admin, redirect
    if (!accessToken || userRole !== "ADMIN") {
      navigate("/chat", { replace: true });
    }
  }, [accessToken, userRole, navigate]);

  // Jika bukan admin, jangan render apapun
  if (!accessToken || userRole !== "ADMIN") {
    return null;
  }

  return <AdminDashboard />;
};

export default AdminRoute;
