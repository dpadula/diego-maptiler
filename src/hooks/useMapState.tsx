import { useEffect, useState } from 'react';
import {
  DATAVIZ_DARK_URL,
  SATELLITE_URL,
  STREETS_V4_URL,
} from '../data/constants';

export function useMapState({ mapRef, bottomSheetRef }: any) {
  const [zoom, setZoom] = useState(16);
  const [pitch, setPitch] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mapStyle, setMapStyle] = useState(STREETS_V4_URL);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [home, setHome] = useState([-60.6888, -31.6356]);
  const [showRoute, setShowRoute] = useState(false);
  const [showCuts, setShowCuts] = useState(false);

  const validateCoordinates = (event: any) => {
    let coords: [number, number] | null = null;

    if (
      event.geometry &&
      event.geometry.type !== 'GeometryCollection' &&
      'coordinates' in event.geometry
    ) {
      coords = event.geometry.coordinates as [number, number];
      // console.log('🚀 ~ handlePress ~ coords:', coords);
    }

    if (coords) {
      return coords;
    }
  };

  const handleLongPress = async (event: any) => {
    const coords = validateCoordinates(event);
    if (!coords) return;

    const zoomLevel = await mapRef.current?.getZoom();
    setZoom(zoomLevel);
    setHome(coords);
  };

  const handlePress = (event: any) => {
    const coords = validateCoordinates(event);
    if (!coords) return;

    setSelectedCoords(coords);
    setHome(coords);
    bottomSheetRef.current?.present();
  };

  const toggleDarkMode = () => setDarkMode((d) => !d);
  const togglePitch = () => setPitch((prev) => (prev === 0 ? 85 : 0));

  useEffect(() => {
    setMapStyle(darkMode ? DATAVIZ_DARK_URL : STREETS_V4_URL);
  }, [darkMode]);

  const toggleMapStyle = () => {
    setMapStyle((prev) =>
      prev.includes('streets') ? SATELLITE_URL : STREETS_V4_URL
    );
  };

  return {
    zoom,
    pitch,
    mapStyle,
    darkMode,
    showCuts,
    showRoute,
    home,
    selectedCoords,
    setZoom,
    setPitch,
    toggleDarkMode,
    toggleMapStyle,
    togglePitch,
    handlePress,
    handleLongPress,
  };
}
