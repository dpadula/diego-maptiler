import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Camera,
  CameraRef,
  FillLayer,
  LineLayer,
  Logger,
  MapView,
  MapViewRef,
  MarkerView,
  ShapeSource,
} from '@maplibre/maplibre-react-native';
import { distance } from '@turf/turf';
import type { FeatureCollection, LineString, Position } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingMenu from '../components/FloatingMenu';
import LocationBottomSheet from '../components/LocationBottomSheet';
import SimpleAnimatedButton from '../components/SimpleAnimatedButton';
import { LIGHT_YELLOW } from '../data/Colors';
import {
  DATAVIZ_DARK_URL,
  SATELLITE_URL,
  STREETS_V4_URL,
} from '../data/constants';
import { useGeoJsonLayer } from '../hooks/useGeoJsonLayer';
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
  const [showCuts, setShowCuts] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [markerCoord, setMarkerCoord] = useState<[number, number] | null>([
    -60.688798780339226, -31.635692179155193,
  ]);
  const [tripCoordinates, setTripCoordinates] = useState<Position[]>([]);
  const [tripActive, setTripActive] = useState(false);
  const [home, setHome] = useState([-60.688798780339226, -31.635692179155193]);
  const { coords: userCoords, permissionGranted } = useUserLocation(); // Para solicitar permisos de ubicacion
  const { data: geojson, loading, error, load } = useGeoJsonLayer();

  const loadCortes = () => {
    load([
      'https://servicios.epe.santafe.gov.ar/api/cortes/rosario',
      'https://servicios.epe.santafe.gov.ar/api/cortes/santafe',
    ]);
  };
  // Configuraciones de MapLibre para ignorar logs no deseados
  Logger.setLogCallback((log) => {
    const { message } = log;

    // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
    if (
      message.match('Request failed due to a permanent error: Canceled') ||
      message.match('Request failed due to a permanent error: Socket Closed') ||
      message.match("layer doesn't support this property") ||
      message.match('source must have tiles')
    ) {
      return true;
    }
    return false;
  });
  const toggleMapStyle = () => {
    setMapStyle((prev) =>
      prev.includes('streets') ? SATELLITE_URL : STREETS_V4_URL
    );
  };
  const toggleMapMode = () => {
    setDarkMode((mode) => !mode);
  };

  const toggleCuts = () => {
    loadCortes();
    setShowCuts((mode) => !mode);
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

  const centerCameraOnMiddleTrip = () => {
    const coords = routeGeoJSON.features[0].geometry.coordinates;
    cameraRef.current?.fitBounds(
      coords[0],
      coords[coords.length - 1],
      50,
      1000
    );
  };

  const setTripCoordinatesAsync = (coords: Position[]) =>
    new Promise<void>((resolve) => {
      setTripCoordinates(coords);
      requestAnimationFrame(() => resolve());
    });

  const togglePitch = () => {
    setPitch((prev) => (prev === 0 ? 85 : 0));
  };
  const tooglePitchAsync = async () => {
    togglePitch();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // new Promise<void>((resolve) => {
    //   togglePitch();
    //   requestAnimationFrame(() => resolve());
    // });
  };

  const beginTrip = async () => {
    await tooglePitchAsync();
    const coords = tripCoordinates.length
      ? tripCoordinates
      : routeGeoJSON.features[0].geometry.coordinates;
    setTripActive(true);
    setShowRoute(true);
    await setTripCoordinatesAsync(coords);
    return coords;
  };

  const endTrip = async (coords: Position[]) => {
    const reversed = [...coords].reverse();
    await setTripCoordinatesAsync(reversed);
    setHome(reversed[0]);
    setTripActive(false);
    await tooglePitchAsync();
  };

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const interpolateCoords = (
    a: Position,
    b: Position,
    steps: number
  ): Position[] => {
    const [lon1, lat1] = a;
    const [lon2, lat2] = b;
    const result: Position[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      result.push([lon1 + (lon2 - lon1) * t, lat1 + (lat2 - lat1) * t]);
    }
    return result;
  };

  const rideTrip = async (coords: Position[]) => {
    // const stepsPerSegment = 20; // más = más suave
    const stepDuration = 200; // ms

    for (let i = 0; i < coords.length - 1; i++) {
      const dist = distance(coords[i], coords[i + 1]); // km
      const stepsPerSegment = Math.max(10, Math.min(50, dist * 100)); // dinámico
      const segment = interpolateCoords(
        coords[i],
        coords[i + 1],
        stepsPerSegment
      );

      for (const coord of segment) {
        cameraRef.current?.flyTo(coord, stepDuration);
        setMarkerCoord(coord as [number, number]);
        await sleep(stepDuration);
      }
    }
  };

  const navigateRoute = async () => {
    const coords = await beginTrip();

    const direction =
      coords[0][0] === routeGeoJSON.features[0].geometry.coordinates[0][0]
        ? 'forward'
        : 'backward';

    console.log('🚀 Dirección actual:', direction);
    await new Promise((res) => setTimeout(res, 100));

    // 3️⃣ Ejecutar el viaje
    await rideTrip(coords);

    // 4️⃣ Finalizar viaje
    await endTrip(coords);
  };

  const validateCoordinates = (event: any) => {
    let coords: [number, number] | null = null;

    if (
      event.geometry &&
      event.geometry.type !== 'GeometryCollection' &&
      'coordinates' in event.geometry
    ) {
      coords = event.geometry.coordinates as [number, number];
      console.log('🚀 ~ handlePress ~ coords:', coords);
    }

    if (coords) {
      return coords;
    }
  };

  const handleLongPress = async (feature: any) => {
    console.log('Evento de LongPress en:', feature.geometry.coordinates);
    const coords = validateCoordinates(feature);

    // 2. Usar la referencia para obtener el zoom
    if (mapRef.current && coords) {
      try {
        // MapLibreGL.MapView.getZoom() es un método asíncrono
        const zoomLevel = await mapRef.current.getZoom();

        console.log('✅ Nivel de Zoom Actual:', zoomLevel);
        // Puedes guardarlo en el estado si necesitas usarlo en el UI
        setZoom(zoomLevel);
        setHome(coords);
      } catch (error) {
        console.error('Error al obtener el nivel de zoom:', error);
      }
    }
  };

  const handlePresentSuscribeModal = () => {
    bottomSheetRef.current?.present();
  };

  const handlePress = (event: any) => {
    const coords = validateCoordinates(event);
    if (coords) {
      setSelectedCoords(coords);
      setHome(coords);
      handlePresentSuscribeModal();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          ref={mapRef}
          onLongPress={handleLongPress}
          onPress={handlePress}
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

          {showCuts && (
            <ShapeSource id='source-geojson' shape={geojson}>
              <LineLayer
                id='line-geojson'
                style={{
                  lineColor: '#ff0000',
                  lineWidth: 4,
                }}
              />

              <FillLayer
                id='fill-geojson'
                style={{
                  fillColor: 'rgba(255,0,0,0.3)',
                }}
              />
            </ShapeSource>
          )}

          <MarkerView id='marker' coordinate={markerCoord!}>
            <View style={styles.touchableContainer}>
              <TouchableOpacity style={styles.touchable}>
                <FontAwesome6 name='car' size={26} color={LIGHT_YELLOW} />
              </TouchableOpacity>
            </View>
          </MarkerView>
        </MapView>

        <SimpleAnimatedButton
          tripActive={tripActive}
          navigateRoute={navigateRoute}
          setTripActive={setTripActive}
          style={[
            styles.button,
            styles.buttonTravel,
            tripActive && styles.backgroundActionButton,
          ]}
        ></SimpleAnimatedButton>
        <FloatingMenu
          onToggleStyle={toggleMapStyle}
          onToggleMode={toggleMapMode}
          onTogglePitch={togglePitch}
          onLoadCuts={toggleCuts}
          pitch={pitch}
          darkMode={darkMode}
          mapStyle={mapStyle}
          showCuts={showCuts}
          onToggleRoute={() => {
            centerCameraOnMiddleTrip();
            setShowRoute((r) => !r);
          }}
          onZoomIn={() => setZoom((z) => Math.min(z + 1, 20))}
          onZoomOut={() => setZoom((z) => Math.max(z - 1, 3))}
        />
        <LocationBottomSheet
          darkMode={darkMode}
          onSetDarkMode={toggleMapMode}
          energyCuts={showCuts}
          onSetEnergyCuts={toggleCuts}
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
  buttonTravel: {
    top: 50,
    left: 20,
  },
  backgroundActionButton: {
    backgroundColor: LIGHT_YELLOW,
  },
  touchableContainer: {
    borderColor: 'black',
    borderWidth: 1.0,
    width: 60,
  },
  touchable: {
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
