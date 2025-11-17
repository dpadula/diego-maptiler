import { useEffect, useState } from 'react';

export function useGeoJsonLayer(url: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNndCIsImRvbWFpbiI6IkdJU0BQUk8iLCJhcHAiOiJnZW9TZXJ2ZXIiLCJleHRlbmQiOiIiLCJpc0Fub21hbHlBZG1pbiI6MCwiZXhwaXJlZFRpbWUiOiIyMDQ1LzA3LzMxIDE0OjA4OjE0IiwidXNlcklkIjoxNDI0LCJyb2xlIjoiR2VvR2VvbWV0cnkiLCJpYXQiOjE3NjMwNTM2OTQsImV4cCI6MjM4NTEzMzY5NH0.V-FNIuwL4JRtljwKWzUqQZirVBCJa-GQu-487Q-cvK5n00ndsNBh7Zt2q8zUSwZpf8K10HGyJMo6K9kFlo36LTzFdnzAXQIwEpC9NN9-t6tAWlZLwuDqJQ1UeiiHdgtWqfbs1M3qi8aR-4vOPpatxldmbptUNN2ZxvILKd0SQKA';

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (!res.ok) throw new Error('No se pudo cargar la capa');

        const json = await res.json();

        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (e: any) {
        if (mounted) {
          setError(e.message);
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
