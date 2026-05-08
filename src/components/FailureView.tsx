import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface FailureViewProps {
  onRetry: () => void;
}

export const FailureView = ({ onRetry }: FailureViewProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426934/failure-image_dutyix.png',
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Something went wrong. Please try again</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
