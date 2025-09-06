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
  updating: boolean;
  setUser: (user: UserProfileState['user']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUpdating: (updating: boolean) => void;
  clearUser: () => void;
}

const useUserProfileStore = create<UserProfileState>()(
  subscribeWithSelector((set) => ({
    user: null,
    loading: false,
    error: null,
    updating: false,
    setUser: (user) => set({ user, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setUpdating: (updating) => set({ updating }),
    clearUser: () => set({ user: null, error: null, loading: false, updating: false }),
  }))
);

// Hook untuk fetch user profile
export const useUserProfile = () => {
  const { 
    user, 
    loading, 
    error, 
    updating,
    setUser, 
    setLoading, 
    setError,
    setUpdating 
  } = useUserProfileStore();
  const { accessToken } = useAuthStore();

  const fetchUserProfile = async () => {
    if (!accessToken) {
      setError('No access token');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/user/me');
      
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Di user.ts, update updateUserProfile method untuk ensure state consistency

const updateUserProfile = async (updates: { name?: string }, file?: File) => {
  if (!accessToken) {
    setError('No access token');
    throw new Error('No access token');
  }

  try {
    setUpdating(true);
    setError(null);
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add text fields - sesuai dengan UpdateProfileDto
    if (updates.name) {
      formData.append('name', updates.name);
    }
    
    // Add file with correct field name - sesuai dengan FileInterceptor
    if (file) {
      formData.append('profileImage', file);
    }

    console.log('Updating profile with data:', { name: updates.name, hasFile: !!file });

    // Gunakan PUT method sesuai dengan API endpoint
    const response = await apiClient.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Profile updated successfully:', response.data);
    
    // Ensure response.data has all required fields
    const updatedUser = {
      ...user, // Keep existing data
      ...response.data, // Override with new data
      name: response.data.name || user?.name || 'User', // Ensure name is never undefined
    };
    
    setUser(updatedUser);
    return updatedUser;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update user profile';
    setError(errorMessage);
    console.error('Error updating user profile:', err);
    throw new Error(errorMessage);
  } finally {
    setUpdating(false);
  }
};

  return {
    user,
    loading,
    error,
    updating,
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