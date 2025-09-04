import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import useAuthStore from "hooks/auth";

export default function ProtectedLayout() {
  const { accessToken} = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/', { replace: true });
    }
  }, [accessToken, navigate]);

  if (!accessToken) {
    return null;
  }

  return <Outlet />;
}