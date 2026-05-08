import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MovieCard } from './MovieCard';
import { FailureView } from './FailureView';
import type { Movie } from '../services/api';

type ApiStatus = 'initial' | 'loading' | 'success' | 'failure';

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  status: ApiStatus;
  onRetry: () => void;
}

export const MovieSlider = ({ title, movies, status, onRetry }: MovieSliderProps) => {
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#e50914" />
          </View>
        );
      case 'failure':
        return (
          <View style={styles.failureContainer}>
            <FailureView onRetry={onRetry} />
          </View>
        );
      case 'success':
        return (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MovieCard movie={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  loaderContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  failureContainer: {
    height: 200,
  },
});
