import { useCallback, useState } from 'react';

export function useGeoJsonLayer() {
  const token =
    'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNndCIsImRvbWFpbiI6IkdJU0BQUk8iLCJhcHAiOiJnZW9TZXJ2ZXIiLCJleHRlbmQiOiIiLCJpc0Fub21hbHlBZG1pbiI6MCwiZXhwaXJlZFRpbWUiOiIyMDQ1LzA3LzMxIDE0OjA4OjE0IiwidXNlcklkIjoxNDI0LCJyb2xlIjoiR2VvR2VvbWV0cnkiLCJpYXQiOjE3NjMwNTM2OTQsImV4cCI6MjM4NTEzMzY5NH0.V-FNIuwL4JRtljwKWzUqQZirVBCJa-GQu-487Q-cvK5n00ndsNBh7Zt2q8zUSwZpf8K10HGyJMo6K9kFlo36LTzFdnzAXQIwEpC9NN9-t6tAWlZLwuDqJQ1UeiiHdgtWqfbs1M3qi8aR-4vOPpatxldmbptUNN2ZxvILKd0SQKA';

  const [data, setData] = useState<GeoJSON.FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (urls: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const promises = urls.map((url) =>
        fetch(url, {
          headers: {
            Authorization: `${token}`,
          },
        }).then((res) => {
          if (!res.ok) throw new Error(`Error en ${url}`);
          return res.json();
        })
      );

      const results: GeoJSON.FeatureCollection[] = await Promise.all(promises);

      const merged: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: results.flatMap((fc) => fc.features),
      };

      setData(merged);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    load, // 🔥 exponemos el método manual para cargar cuando queramos
  };
}
