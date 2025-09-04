import type { AxiosResponse } from 'axios';
import { useState } from 'react';

const useApiRequest = <TData, TError>() => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);

  const makeRequest = async (request: () => Promise<AxiosResponse<TData>>) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await request();
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
      throw message;
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => setData(null);

  return { loading, data, error, makeRequest, clearData };
};


export default useApiRequest;
