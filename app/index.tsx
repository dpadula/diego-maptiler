import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Camera, MapView } from '@maplibre/maplibre-react-native';
import { useState } from 'react';

export default function Index() {
  const MAPTILER_API_KEY = 'cVxKrO7kxSIAfQTy4QJP';
  const [layer, setLayer] = useState<string>(
    'https://api.maptiler.com/maps/satellite/'
  );
  const [zoom, setZoom] = useState(16);

  return (
    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          // onPress={(feature) => console.log('pressed', feature)}
          onLongPress={(feature) => console.log('pressed', feature)}
          style={styles.map}
          mapStyle={`${layer}style.json?key=${MAPTILER_API_KEY}`}
          // mapStyle={`https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_API_KEY}`}
          // mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`}
          logoEnabled={false}
          attributionPosition={{ bottom: 8, right: 8 }}
        >
          <Camera
            centerCoordinate={[-60.688798780339226, -31.635692179155193]}
            zoomLevel={zoom}
            animationDuration={1500}
            animationMode='easeTo'
          />
        </MapView>
        <Pressable
          style={{
            position: 'absolute',
            top: 50,
            zIndex: 1000,
            backgroundColor: 'white',
            padding: 20,
            marginHorizontal: 10,
            borderRadius: 5,
          }}
          onPress={() => {
            if (layer.includes('satellite')) {
              setLayer('https://api.maptiler.com/maps/openstreetmap/');
              // setLayer('https://api.maptiler.com/maps/streets-v4/');
            } else {
              setLayer('https://api.maptiler.com/maps/satellite/');
            }
          }}
        >
          <Text>Cambiar Satelite</Text>
        </Pressable>
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
