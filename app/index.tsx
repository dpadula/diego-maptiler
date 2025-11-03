import { StyleSheet, View } from 'react-native';

import { Camera, MapView } from '@maplibre/maplibre-react-native';

export default function Index() {
  const MAPTILER_API_KEY = 'cVxKrO7kxSIAfQTy4QJP';

  return (
    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView
          onPress={(feature) => console.log('pressed', feature)}
          style={styles.map}
          mapStyle={`https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_API_KEY}`}
          logoEnabled={false}
          attributionPosition={{ bottom: 8, right: 8 }}
        >
          <Camera
            centerCoordinate={[-60.688798780339226, -31.635692179155193]}
            zoomLevel={18}
            animationDuration={2000}
            animationMode='easeTo'
          />
        </MapView>
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
