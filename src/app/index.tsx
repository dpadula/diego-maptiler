import { StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Camera,
  CameraRef,
  LineLayer,
  MapView,
  MapViewRef,
  PointAnnotation,
  ShapeSource,
} from '@maplibre/maplibre-react-native';
import type { FeatureCollection, LineString, Position } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingMenu from '../components/FloatingMenu';
import LocationBottomSheet from '../components/LocationBottomSheet';
import {
  DATAVIZ_DARK_URL,
  SATELLITE_URL,
  STREETS_V4_URL,
} from '../data/constants';
import { useUserLocation } from '../hooks/useUserLocation';

export default function Index() {
  const mapRef = useRef<MapViewRef | null>(null);
  const cameraRef = useRef<CameraRef>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [mapStyle, setMapStyle] = useState<string>(STREETS_V4_URL);
  const [zoom, setZoom] = useState(16);
  const [pitch, setPitch] = useState(0);
  const [showRoute, setShowRoute] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [markerCoord, setMarkerCoord] = useState<[number, number] | null>([
    -60.688798780339226, -31.635692179155193,
  ]);
  const [tripCoordinates, setTripCoordinates] = useState<Position[]>([]);
  const [home, setHome] = useState([-60.688798780339226, -31.635692179155193]);
  const [trip, setTrip] = useState(true);
  const [tripActive, setTripActive] = useState(false);
  const { coords: userCoords, permissionGranted } = useUserLocation();
  const toggleMapStyle = () => {
    setMapStyle((prev) =>
      prev.includes('streets') ? SATELLITE_URL : STREETS_V4_URL
    );
  };
  const toggleMapMode = () => {
    setDarkMode((mode) => !mode);
  };

  const changeTripEndpoint = () => {
    if (trip) {
      setHome([-60.688798780339226, -31.635692179155193]);
    } else {
      setHome([-60.715926228085266, -31.636315286439974]);
    }
    setTrip(!trip);
  };

  useEffect(() => {
    if (darkMode) {
      setMapStyle(DATAVIZ_DARK_URL);
    } else {
      setMapStyle(STREETS_V4_URL);
    }
  }, [darkMode]);

  // Polyline simulada (recorrido)
  const routeGeoJSON: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-60.68882160856778, -31.635688229009155],
            [-60.689337563333964, -31.635579941550652],
            [-60.689868648350796, -31.63739765884189],
            [-60.6909333501216, -31.6371737938233],
            [-60.691990249076554, -31.636929568893102],
            [-60.69227425690693, -31.63793253917457],
            [-60.69284839952242, -31.639822812351177],
            [-60.69495669481357, -31.63935008438898],
            [-60.69575864588114, -31.642078915813777],
            [-60.71626953995822, -31.637468498535185],
            [-60.71762400586759, -31.637153389249143],
            [-60.717302027741624, -31.636022910582795],
            [-60.715926228085266, -31.636315286439974],
          ],
        },
        properties: {},
      },
    ],
  };

  const navigateRoute = () => {
    setShowRoute(true);
    setPitch(85);
    setTripCoordinates(routeGeoJSON.features[0].geometry.coordinates);
    if (cameraRef.current) {
      tripCoordinates.forEach((coord, index) => {
        setTimeout(() => {
          cameraRef.current?.moveTo(coord, 2500);
          setMarkerCoord(coord as [number, number]);

          // 🟢 Condición de corte
          if (index === tripCoordinates.length - 1) {
            // Esperás un poquito más para asegurar que el último movimiento se complete
            setTimeout(() => {
              setPitch(0); // volver a vista normal
              setTripActive(false);
              console.log('✅ Viaje completado');
              // Podrías disparar un evento, callback o estado como:
              // setTripFinished(true);
            }, 2000);
          }
        }, index * 1500);
      });
    }
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
  const handlePresentSuscribeModal = () => {
    bottomSheetRef.current?.present();
  };

  const togglePitch = () => {
    setPitch((prev) => (prev === 0 ? 85 : 0));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          ref={mapRef}
          onLongPress={handleLongPress}
          onPress={(event) => {
            let coords: [number, number] | null = null;
            if (
              event.geometry &&
              event.geometry.type !== 'GeometryCollection' &&
              'coordinates' in event.geometry
            ) {
              coords = event.geometry.coordinates as [number, number];
              console.log('🚀 ~ Index ~ coords:', coords);
            }
            if (coords) {
              setSelectedCoords(coords);
              handlePresentSuscribeModal();
            }
          }}
          style={styles.map}
          mapStyle={mapStyle}
          logoEnabled={false}
          attributionPosition={{ bottom: 8, right: 8 }}
        >
          <Camera
            ref={cameraRef}
            pitch={pitch}
            centerCoordinate={home}
            zoomLevel={zoom}
            animationDuration={2500}
            animationMode='flyTo'
          />
          {/* Paseo en auto */}
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

          <PointAnnotation id='marker' coordinate={markerCoord!}>
            <FontAwesome6 name='car' size={32} color='red' />
          </PointAnnotation>
        </MapView>

        <TouchableOpacity
          style={[styles.button, styles.buttonFly]}
          onPress={() => {
            setZoom(10);
            changeTripEndpoint();
            setZoom(16);
          }}
        >
          {trip ? (
            <Ionicons name='home' size={22} color='black' />
          ) : (
            <Ionicons name='flag' size={22} color='black' />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonTravel]}
          onPress={() => {
            setTripActive(!tripActive);
            navigateRoute();
          }}
        >
          {/* ver como coordinar cuando empieza y termina el paseo */}
          {!tripActive ? (
            <FontAwesome6 name='car-side' size={24} color='black' />
          ) : (
            <MaterialCommunityIcons
              name='map-marker-path'
              size={24}
              color='black'
            />
          )}
        </TouchableOpacity>

        <FloatingMenu
          onToggleStyle={toggleMapStyle}
          onToggleMode={toggleMapMode}
          onTogglePitch={togglePitch}
          pitch={pitch}
          darkMode={darkMode}
          mapStyle={mapStyle}
          onToggleRoute={() => {
            setZoom(13);
            setHome([-60.704594179732965, -31.640094181300455]);
            setShowRoute((r) => !r);
          }}
          onZoomIn={() => setZoom((z) => Math.min(z + 1, 20))}
          onZoomOut={() => setZoom((z) => Math.max(z - 1, 3))}
        />
        <LocationBottomSheet
          darkMode={darkMode}
          onSetDarkMode={toggleMapMode}
          ref={bottomSheetRef}
          coordinates={selectedCoords}
        />
      </View>
    </SafeAreaView>
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
  button: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  buttonFly: {
    top: 50,
    left: 20,
  },
  buttonTravel: {
    top: 120,
    left: 20,
  },
});
