// src/components/LocationBottomSheet.tsx
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LocationBottomSheetProps = {
  coordinates: [number, number] | null;
  darkMode: boolean;
  onSetDarkMode: () => void;
};

const LocationBottomSheet = forwardRef<BottomSheet, LocationBottomSheetProps>(
  ({ coordinates, onSetDarkMode, darkMode }, ref) => {
    const [tags, setTags] = useState([
      'zona A',
      'checkpoint',
      'punto de interés',
    ]);
    const snapPoints = useMemo(() => ['50%'], []);
    const [dark, setDark] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const { dismiss } = useBottomSheetModal();
    const { bottom } = useSafeAreaInsets();

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    useEffect(() => {
      console.log('🚀 ~ Index ~ darkMode:', darkMode);
      //   setDark(darkMode);
    }, [darkMode]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          opacity={0.6}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
          onPress={dismiss}
        />
      ),
      [dismiss]
    );
    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.content}>
          {coordinates ? (
            <>
              <Text style={styles.title}>📍 Ubicación seleccionada</Text>
              <Text style={styles.coord}>Lng: {coordinates[0].toFixed(5)}</Text>
              <Text style={styles.coord}>Lat: {coordinates[1].toFixed(5)}</Text>

              <Text style={styles.subtitle}>Etiquetas</Text>
              {tags.map((t, i) => (
                <Text key={i} style={styles.tag}>
                  • {t}
                </Text>
              ))}

              <View style={styles.switchContainer}>
                <Text>Modo oscuro</Text>
                {/* <Switch
                  value={dark}
                  //   onChange={() => setDark(!dark)}
                  onValueChange={() => setDark(!dark)}
                  trackColor={{ false: '#030303ff', true: '#81b0ff' }}
                  thumbColor={dark ? '#f5dd4b' : '#f4f3f4'}
                /> */}

                <TouchableOpacity style={styles.button} onPress={onSetDarkMode}>
                  <Ionicons name='moon' size={22} color='black' />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.title}>
              Tocá en el mapa para ver coordenadas
            </Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

LocationBottomSheet.displayName = 'LocationBottomSheet'; // 👈 Solución al warning

export default LocationBottomSheet;

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  subtitle: { marginTop: 15, fontWeight: '600' },
  coord: { fontSize: 14, color: '#555' },
  tag: { fontSize: 13, color: '#666' },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
