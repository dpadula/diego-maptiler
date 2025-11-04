// src/hooks/useUserLocation.ts
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface UserLocation {
  coords: [number, number] | null;
  permissionGranted: boolean;
  error?: string;
}

export function useUserLocation(): UserLocation {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        return;
      }
      setPermissionGranted(true);
      const location = await Location.getCurrentPositionAsync({});
      setCoords([location.coords.longitude, location.coords.latitude]);
    })();
  }, []);

  return { coords, permissionGranted, error };
}
