import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';

// Colores para la animación
const ANIMATION_COLORS = [
  'rgb(255, 99, 71)',
  'rgb(60, 179, 113)',
  'rgb(65, 105, 225)',
  'rgb(255, 215, 0)',
];
const DURATION = 4000; // Duración de un ciclo completo (4 segundos)

// Props
interface SimpleAnimatedButtonProps {
  tripActive: boolean;
  setTripActive: (active: boolean) => void;
  navigateRoute: () => void;
  style: any;
}

const SimpleAnimatedButton = ({
  tripActive,
  setTripActive,
  navigateRoute,
  style,
}: SimpleAnimatedButtonProps) => {
  // 1. Usar useRef para mantener el valor de animación
  const colorAnimation = useRef(new Animated.Value(0)).current;

  // 2. Definir la animación de loop
  const startAnimation = () => {
    colorAnimation.setValue(0); // Reinicia el valor
    Animated.loop(
      Animated.timing(colorAnimation, {
        toValue: 1, // El valor final
        duration: DURATION,
        easing: Easing.linear,
        useNativeDriver: false, // El color no soporta el Native Driver
      })
    ).start();
  };

  // 3. Controlar la animación con tripActive
  useEffect(() => {
    if (tripActive) {
      startAnimation();
    } else {
      colorAnimation.stopAnimation(); // Detiene la animación cuando tripActive es false
    }
    // Limpieza al desmontar o antes de un nuevo inicio
    return () => colorAnimation.stopAnimation();
  }, [tripActive]); // Se ejecuta cada vez que tripActive cambia

  // 4. Interpolación del color
  // Creamos los puntos para que la animación pase por todos los colores
  const inputRange = ANIMATION_COLORS.map(
    (_, index) => index / (ANIMATION_COLORS.length - 1)
  );

  const animatedBorderStyles = {
    borderColor: colorAnimation.interpolate({
      inputRange: inputRange,
      outputRange: ANIMATION_COLORS,
    }),
    borderWidth: 4, // Define el grosor del borde
    borderRadius: 50,
  };

  return (
    // Reemplazamos el TouchableOpacity por un Animated.View que envuelve
    // el TouchableOpacity real. Esto nos permite animar el borde.
    <Animated.View
      style={[
        styles.animatedWrapper,
        style,
        tripActive && animatedBorderStyles, // Aplica los estilos animados solo si tripActive es true
      ]}
    >
      <TouchableOpacity
        disabled={tripActive}
        // Aplica estilos base y el estilo de fondo si está activo
        style={[
          styles.button,
          styles.buttonTravel,
          tripActive && styles.backgroundActionButton,
        ]}
        onPress={() => {
          setTripActive(true);
          navigateRoute();
        }}
      >
        {/* Contenido del botón */}
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
    </Animated.View>
  );
};

// --- Estilos de ejemplo ---
const styles = StyleSheet.create({
  animatedWrapper: {
    // Espacio para que el Animated.View se vea como el borde
    padding: 4, // Debe ser al menos igual al borderWidth animado
    borderRadius: 50,
    // Asegura que el contenedor tenga un tamaño base si es necesario
  },
  button: {
    // Estilos del TouchableOpacity interior
    // height: 60, // Ajusta a tu tamaño deseado
    // width: 60, // Ajusta a tu tamaño deseado
    borderRadius: 30, // La mitad de height/width para hacerlo circular
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Color base del botón
  },
  buttonTravel: {
    // Estilos de posición o sombra que ya tenías
  },
  backgroundActionButton: {
    backgroundColor: 'yellow', // El color que quieres cuando está activo
  },
});

export default SimpleAnimatedButton;
