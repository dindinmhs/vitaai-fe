import { useState, useEffect } from 'react';
import apiClient from '../services/api-service';

interface MedicalEntryDetail {
  id: string;
  title: string;
  content: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface UseMedicalEntryDetailResult {
  medicalEntry: MedicalEntryDetail | null;
  loading: boolean;
  error: string | null;
  fetchMedicalEntryDetail: (id: string) => Promise<void>;
  refetch: () => void;
}

const useMedicalEntryDetail = (id?: string): UseMedicalEntryDetailResult => {
  const [medicalEntry, setMedicalEntry] = useState<MedicalEntryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalEntryDetail = async (entryId: string) => {
    if (!entryId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Gunakan API client yang sudah dikonfigurasi
      const response = await apiClient.get<MedicalEntryDetail>(`/medicalentry/${entryId}`);
      setMedicalEntry(response.data);
      console.log('Successfully fetched medical entry detail:', response.data);
    } catch (err: any) {
      console.warn('Failed to fetch from configured API:', err.message);
      
      // Fallback ke localhost
      try {
        const fallbackResponse = await fetch(`http://localhost:3000/medicalentry/${entryId}`);
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          setMedicalEntry(data);
          console.log('Successfully fetched from localhost fallback:', data);
        } else {
          throw new Error('Medical entry tidak ditemukan');
        }
      } catch (fallbackErr: any) {
        console.error('Failed to fetch medical entry detail:', fallbackErr);
        setError('Gagal memuat data medical entry');
        setMedicalEntry(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (id) {
      fetchMedicalEntryDetail(id);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMedicalEntryDetail(id);
    }
  }, [id]);

  return {
    medicalEntry,
    loading,
    error,
    fetchMedicalEntryDetail,
    refetch
  };
};

export default useMedicalEntryDetail;
export type { MedicalEntryDetail };
