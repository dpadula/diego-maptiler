import { FontAwesome6 } from '@expo/vector-icons';
import { MarkerView } from '@maplibre/maplibre-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LIGHT_YELLOW } from '../data/Colors';

interface CarMarkerProps {
  coordinate: [number, number];
}

export default function CarMarker({ coordinate }: CarMarkerProps) {
  return (
    <MarkerView id='car' coordinate={coordinate}>
      <View style={styles.touchableContainer}>
        <TouchableOpacity style={styles.touchable}>
          <FontAwesome6 name='car' size={26} color={LIGHT_YELLOW} />
        </TouchableOpacity>
      </View>
    </MarkerView>
  );
}

const styles = StyleSheet.create({
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
