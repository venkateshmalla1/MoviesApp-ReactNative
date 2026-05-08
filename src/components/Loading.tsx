import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
}

export const Loading = ({ size = 'large' }: LoadingProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#e50914" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});
