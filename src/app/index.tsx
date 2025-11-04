import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Camera,
  LineLayer,
  MapView,
  MapViewRef,
  ShapeSource,
} from '@maplibre/maplibre-react-native';
import type { FeatureCollection, LineString } from 'geojson';
import { useRef, useState } from 'react';
import FloatingButtons from '../components/FloatingButtons';

export default function Index() {
  const MAPTILER_API_KEY = 'cVxKrO7kxSIAfQTy4QJP';
  const mapRef = useRef<MapViewRef | null>(null);
  const [mapStyle, setMapStyle] = useState<string>(
    'https://api.maptiler.com/maps/streets-v4/style.json?key=' +
      MAPTILER_API_KEY
  );
  const [zoom, setZoom] = useState(16);
  const [showRoute, setShowRoute] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const toggleMapStyle = () => {
    setMapStyle((prev) =>
      prev.includes('streets')
        ? `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`
        : `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_API_KEY}`
    );
  };
  // Polyline simulada (recorrido)
  const routeGeoJSON: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-60.6888, -31.6356],
            [-60.7, -31.64],
            [-60.71, -31.65],
          ],
        },
        properties: {},
      },
    ],
  };

  const handleLongPress = async (feature: any) => {
    console.log('Evento de LongPress en:', feature.geometry.coordinates);

    // 2. Usar la referencia para obtener el zoom
    if (mapRef.current) {
      try {
        // MapLibreGL.MapView.getZoom() es un método asíncrono
        const zoomLevel = await mapRef.current.getZoom();

        console.log('✅ Nivel de Zoom Actual:', zoomLevel);
        // Puedes guardarlo en el estado si necesitas usarlo en el UI
        setZoom(zoomLevel);
      } catch (error) {
        console.error('Error al obtener el nivel de zoom:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          ref={mapRef}
          onLongPress={handleLongPress}
          style={styles.map}
          mapStyle={mapStyle}
          logoEnabled={false}
          attributionPosition={{ bottom: 8, right: 8 }}
        >
          <Camera
            centerCoordinate={[-60.688798780339226, -31.635692179155193]}
            zoomLevel={zoom}
            animationDuration={1500}
            animationMode='flyTo'
          />
          {/* Polyline simulada */}
          {showRoute && (
            <ShapeSource id='route' shape={routeGeoJSON}>
              <LineLayer
                id='lineLayer'
                style={{
                  lineColor: '#007AFF',
                  lineWidth: 4,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}
              />
            </ShapeSource>
          )}
        </MapView>

        <Pressable
          style={{
            position: 'absolute',
            top: 150,
            zIndex: 1000,
            backgroundColor: 'white',
            padding: 20,
            marginHorizontal: 10,
            borderRadius: 5,
          }}
          onPress={() => {
            if (zoom === 16) {
              setZoom(10);
            } else {
              setZoom(16);
            }
          }}
        >
          <Text>Cambiar Zoom</Text>
        </Pressable>

        <FloatingButtons
          onToggleStyle={toggleMapStyle}
          onToggleRoute={() => {
            setZoom(12);
            setShowRoute((r) => !r);
          }}
          onZoomIn={() => setZoom((z) => Math.min(z + 1, 20))}
          onZoomOut={() => setZoom((z) => Math.max(z - 1, 3))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapcontainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
  },
});
