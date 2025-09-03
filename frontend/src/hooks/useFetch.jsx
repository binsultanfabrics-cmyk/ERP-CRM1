import { useEffect, useState, useRef } from 'react';

export default function useFetch(fetchFunction) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSuccess, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const fetchFunctionRef = useRef(fetchFunction);

  // Update the ref when fetchFunction changes
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  useEffect(() => {
    let isCancelled = false;
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunctionRef.current();
        
        if (!isCancelled && isMountedRef.current) {
          setData(result.result);
          setSuccess(true);
        }
      } catch (err) {
        if (!isCancelled && isMountedRef.current) {
          setError(err);
          setSuccess(false);
        }
      } finally {
        if (!isCancelled && isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [fetchFunction]); // Depend on the actual fetchFunction

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { result: data, isLoading, isSuccess, error };
}
