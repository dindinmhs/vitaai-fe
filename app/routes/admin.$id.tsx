import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { AdminContent } from "../../components/admin/content";
import { AdminLayout } from "../../layouts/admin";
import useAuthStore from "../../hooks/auth";
import useMedicalEntries from "../../hooks/medical-entry";

const AdminWithId: React.FC = () => {
  const { userRole, accessToken } = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { refetch, lastUpdate } = useMedicalEntries();

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

  // Jika tidak ada ID, redirect ke admin
  if (!id) {
    navigate("/admin", { replace: true });
    return null;
  }

  return (
    <AdminLayout selectedId={id}>
      <AdminContent key={`content-${id}-${lastUpdate}`} medicalEntryId={id} onRefresh={refetch} />
    </AdminLayout>
  );
};

export default AdminWithId;
