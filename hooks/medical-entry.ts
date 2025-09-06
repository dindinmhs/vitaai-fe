import { useState, useEffect } from 'react';
import apiClient from '../services/api-service';

interface MedicalEntry {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface UseMedicalEntriesResult {
  medicalEntries: MedicalEntry[];
  loading: boolean;
  error: string | null;
  fetchMedicalEntries: () => Promise<void>;
  refetch: () => void;
  isUsingFallback: boolean;
  lastUpdate: number;
}

// Fallback data berdasarkan response yang Anda berikan
const fallbackData: MedicalEntry[] = [
  {
    id: "2470c1fa-eb03-4c91-af20-422932aec5e4",
    title: "Asthma",
    createdAt: "2025-09-05T04:07:47.954Z",
    updatedAt: "2025-09-05T04:07:47.954Z"
  },
  {
    id: "e7bf1926-3f12-4896-94c0-7de793c2a985",
    title: "Apoplexy",
    createdAt: "2025-09-05T04:05:20.624Z",
    updatedAt: "2025-09-05T04:05:20.624Z"
  },
  {
    id: "e0679058-a080-4098-a6ce-32016152d88b",
    title: "Anaerobic",
    createdAt: "2025-09-05T04:04:16.822Z",
    updatedAt: "2025-09-05T04:04:16.822Z"
  },
  {
    id: "0e4c5f77-ac70-467d-a096-c0d760e2110c",
    title: "Allergen",
    createdAt: "2025-09-05T04:02:20.839Z",
    updatedAt: "2025-09-05T04:02:20.839Z"
  },
  {
    id: "3c271a2d-d0af-4860-b795-199e55a582f8",
    title: "Alkalosis",
    createdAt: "2025-09-05T04:00:21.350Z",
    updatedAt: "2025-09-05T04:00:21.350Z"
  },
  {
    id: "8ab9584d-6190-40ea-bb9c-98549765d231",
    title: "Abscess",
    createdAt: "2025-09-05T03:28:17.047Z",
    updatedAt: "2025-09-05T03:28:17.047Z"
  }
];

const useMedicalEntries = (): UseMedicalEntriesResult => {
  const [medicalEntries, setMedicalEntries] = useState<MedicalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchMedicalEntries = async () => {
    console.log('Starting fetchMedicalEntries...');
    setLoading(true);
    setError(null);
    setIsUsingFallback(false);

    try {
      // Gunakan API client yang sudah dikonfigurasi dengan environment variable
      const response = await apiClient.get<MedicalEntry[]>('/medicalentry');
      console.log('Successfully fetched medical entries via API client:', response.data);
      setMedicalEntries(response.data);
      setLastUpdate(Date.now());
    } catch (err: any) {
      console.warn('Failed to fetch from configured API:', err.message);
      
      // Fallback ke localhost
      try {
        const fallbackResponse = await fetch('http://localhost:3000/medicalentry');
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          console.log('Successfully fetched from localhost fallback:', data);
          setMedicalEntries(data);
          setLastUpdate(Date.now());
        } else {
          throw new Error('Localhost API juga tidak tersedia');
        }
      } catch (fallbackErr: any) {
        console.warn('Both API calls failed, using static fallback data');
        setMedicalEntries(fallbackData);
        setIsUsingFallback(true);
        setError(null); // Clear error jika pakai fallback
        setLastUpdate(Date.now());
      }
    } finally {
      setLoading(false);
      console.log('fetchMedicalEntries completed');
    }
  };

  const refetch = () => {
    console.log('Refetching medical entries...');
    fetchMedicalEntries();
  };

  useEffect(() => {
    fetchMedicalEntries();
  }, []);

  return {
    medicalEntries,
    loading,
    error,
    fetchMedicalEntries,
    refetch,
    isUsingFallback,
    lastUpdate
  };
};

export default useMedicalEntries;
export type { MedicalEntry };
