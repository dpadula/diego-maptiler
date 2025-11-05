// src/components/FloatingActionMenu.tsx
import {
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LIGHT_YELLOW } from '../data/Colors';

type FloatingMenuProps = {
  onToggleStyle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleRoute: () => void;
  onToggleMode: () => void;
  onTogglePitch?: () => void;
  mapStyle?: string;
  pitch?: number;
  darkMode?: boolean;
};

const FloatingMenu = ({
  onToggleStyle,
  onZoomIn,
  onZoomOut,
  onToggleRoute,
  onToggleMode,
  onTogglePitch,
  mapStyle,
  pitch,
  darkMode,
}: FloatingMenuProps) => {
  const [open, setOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    setOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        // Si se abre → animación con spring
        animation.value = withSpring(1, { damping: 15 });
      } else {
        // Si se cierra → sin animación
        animation.value = 0;
      }
      return newValue;
    });
  };

  const animatedStyle = (index: number) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY: withTiming(animation.value ? -(index + 1) * 65 : 0, {
            duration: 300,
          }),
        },
        {
          scale: withTiming(animation.value ? 1 : 0, { duration: 200 }),
        },
      ],
      opacity: withTiming(animation.value ? 1 : 0, { duration: 200 }),
    }));

  const buttons = [
    {
      icon: mapStyle!.includes('streets') ? (
        // <FontAwesome name='map' size={22} color='black' />
        <MaterialIcons name='terrain' size={24} color='black' />
      ) : (
        <FontAwesome name='map-o' size={22} color='black' />
      ),
      onPress: onToggleStyle,
    },
    {
      icon: <FontAwesome6 name='plus' size={22} color='black' />,
      onPress: onZoomIn,
    },
    {
      icon: <FontAwesome6 name='minus' size={22} color='black' />,
      onPress: onZoomOut,
    },
    {
      icon: <MaterialIcons name='alt-route' size={22} color='black' />,
      onPress: onToggleRoute,
    },
    {
      icon: darkMode ? (
        <Ionicons name='sunny' size={22} color='black' />
      ) : (
        <Ionicons name='moon' size={22} color='black' />
      ),
      onPress: onToggleMode,
    },
    {
      icon: pitch ? (
        <Ionicons name='compass-outline' size={28} color='black' />
      ) : (
        <Ionicons name='compass' size={28} color='black' />
      ),
      onPress: onTogglePitch,
    },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => {
        const style = animatedStyle(index);
        return (
          <Animated.View key={index} style={[styles.buttonContainer, style]}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                btn.onPress();
                toggleMenu();
              }}
            >
              {btn.icon}
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Botón principal */}
      <TouchableOpacity
        style={[styles.button, styles.mainButton]}
        onPress={toggleMenu}
      >
        {open ? (
          <Ionicons name='close' size={24} color='#000' />
        ) : (
          <MaterialIcons name='menu' size={24} color='black' />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FloatingMenu;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  mainButton: {
    backgroundColor: LIGHT_YELLOW,
  },
});
