import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type FloatingButtonProps = {
  onToggleStyle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleRoute: () => void;
};

const FloatingButtons = ({
  onToggleStyle,
  onZoomIn,
  onZoomOut,
  onToggleRoute,
}: FloatingButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onToggleStyle}>
        <FontAwesome name='map' size={22} color='black' />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onZoomIn}>
        <FontAwesome6 name='plus' size={22} color='black' />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onZoomOut}>
        {/* <Ionicons name='remove' size={22} color='black' style={styles.text} /> */}
        <FontAwesome6 name='minus' size={22} color='black' />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onToggleRoute}>
        <MaterialIcons name='alt-route' size={22} color='black' />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButtons;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    gap: 10,
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
  text: {
    fontSize: 20,
    color: '#000',
    fontWeight: 700,
  },
});
