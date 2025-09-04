import { useState, useCallback } from 'react';

export default function useOnFetch() {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFetch = useCallback(async (callback) => {
    setIsLoading(true);

    try {
      const data = await callback;
      setResult(data.result);
      if (data.success === true) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      setIsSuccess(false);
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { onFetch, result, isSuccess, isLoading };
}
