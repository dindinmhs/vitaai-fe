import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import useAuthStore from './auth';
import apiClient from 'services/api-service';

// User Profile Store - Global state yang bisa diakses dari mana saja
interface UserProfileState {
  user: {
    id: string;
    name: string;
    email: string;
    imgUrl?: string;
    role: 'ADMIN' | 'USER';
    verifiedAt?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserProfileState['user']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

const useUserProfileStore = create<UserProfileState>()(
  subscribeWithSelector((set) => ({
    user: null,
    loading: false,
    error: null,
    setUser: (user) => set({ user, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearUser: () => set({ user: null, error: null, loading: false }),
  }))
);

// Hook untuk fetch user profile
export const useUserProfile = () => {
  const { user, loading, error, setUser, setLoading, setError } = useUserProfileStore();
  const { accessToken } = useAuthStore();

  const fetchUserProfile = async () => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfileState['user']>) => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.patch('/user/me', updates, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      setUser(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user profile');
      console.error('Error updating user profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    refetch: fetchUserProfile,
  };
};

// Hook untuk auto-fetch user profile saat komponen mount
export const useAutoFetchUserProfile = () => {
  const { fetchUserProfile, user, loading, error } = useUserProfile();
  const { accessToken } = useAuthStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (accessToken && !user && !loading && !hasInitialized) {
      fetchUserProfile();
      setHasInitialized(true);
    }
  }, [accessToken, user, loading, hasInitialized, fetchUserProfile]);

  return { user, loading, error, refetch: fetchUserProfile };
};

export default useUserProfileStore;