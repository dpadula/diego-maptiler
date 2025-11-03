import { StyleSheet } from 'react-native';

import { MapView } from '@maplibre/maplibre-react-native';

export default function Index() {
  const MAPTILER_API_KEY = 'cVxKrO7kxSIAfQTy4QJP';

  return <MapView style={{ flex: 1 }} />;
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
