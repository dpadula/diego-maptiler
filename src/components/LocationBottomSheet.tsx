// src/components/LocationBottomSheet.tsx
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
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
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../data/Colors';

type LocationBottomSheetProps = {
  coordinates: [number, number] | null;
  darkMode: boolean;
  onSetDarkMode: () => void;
};

const LocationBottomSheet = forwardRef<
  BottomSheetModal,
  LocationBottomSheetProps
>(({ coordinates, onSetDarkMode, darkMode }, ref) => {
  const [tags, setTags] = useState([
    'zona A',
    'checkpoint',
    'punto de interés',
  ]);
  const snapPoints = useMemo(() => ['50%'], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();

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
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.modalBtns}>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name='close' size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>
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
              <Switch
                style={styles.switch}
                value={darkMode}
                //   onChange={() => setDark(!dark)}
                onValueChange={onSetDarkMode}
                trackColor={{ false: '#030303ff', true: '#81b0ff' }}
                thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </>
        ) : (
          <Text style={styles.title}>Tocá en el mapa para ver coordenadas</Text>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

LocationBottomSheet.displayName = 'LocationBottomSheet'; // 👈 Solución al warning

export default LocationBottomSheet;

const styles = StyleSheet.create({
  content: { flex: 1, zIndex: 100, backgroundColor: 'white', padding: 20 },
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
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  switch: { marginLeft: 10 },
});
