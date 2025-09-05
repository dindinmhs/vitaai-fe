import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { CustomButton } from "../common/button";
import { Logo } from "../common/logo";
import apiClient from "services/api-service";
import useApiRequest from "hooks/request";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const { loading, error, makeRequest } = useApiRequest<{message: string}, string>();
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || hasVerified.current) {
        if (!token) {
          setMessage('Token verifikasi tidak ditemukan');
        }
        return;
      }

      hasVerified.current = true;

      try {
        const response = await makeRequest(() =>
          apiClient.get(`/auth/verify?token=${token}`)
        );
        if (response) {
    
          setMessage(response.message || 'Email berhasil diverifikasi');
          
          // Redirect ke login setelah 3 detik
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Verifikasi email gagal');
        console.error('Verification error:', err);
      }
    };

    verifyEmail();
  }, [token]); // Hapus makeRequest dan navigate dari dependency

  const handleBackToLogin = () => {
    navigate('/');
  };
  console.log(error)
  return (
    <div className="flex flex-col gap-6 border-2 rounded-2xl border-gray-200 p-10 bg-white min-w-[30rem] text-center">
      <div className="flex items-center flex-col gap-2 mb-3">
        <Logo variant="text"/>
        <h2 className="font-semibold text-xl">Verifikasi Email</h2>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="text-gray-600">Memverifikasi email Anda...</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-600 mb-2">Verifikasi Berhasil!</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Anda akan dialihkan ke halaman login dalam 3 detik...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Verifikasi Gagal</h3>
            <p className="text-gray-600 mb-4">{message}</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="space-y-3">
          <CustomButton
            title="Kembali ke Login"
            onClick={handleBackToLogin}
            otherStyle="w-full py-2.5"
          />
          <Link
            to="/register"
            className="block text-emerald-500 hover:text-emerald-600 font-medium text-sm"
          >
            Daftar Ulang
          </Link>
        </div>
      )}
    </div>
  );
};