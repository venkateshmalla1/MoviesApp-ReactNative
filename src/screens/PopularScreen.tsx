import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchPopularMovies, type Movie } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Loading } from '../components/Loading';
import { FailureView } from '../components/FailureView';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

type ApiStatus = 'initial' | 'loading' | 'success' | 'failure';

export const PopularScreen = () => {
  const { jwtToken } = useAuth();
  const [status, setStatus] = useState<ApiStatus>('initial');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMovies = useCallback(async () => {
    if (!jwtToken) return;
    setStatus('loading');
    try {
      const data = await fetchPopularMovies(jwtToken);
      setMovies(data);
      setStatus('success');
    } catch (error) {
      setStatus('failure');
    }
  }, [jwtToken]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  }, [fetchMovies]);

  if (status === 'loading' && movies.length === 0) {
    return <Loading />;
  }

  if (status === 'failure') {
    return <FailureView onRetry={fetchMovies} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
            <MovieCard movie={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e50914" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between', // distributes columns and creates consistent gaps
    marginBottom: GAP,
  },
  cardContainer: {
    // width is set dynamically in renderItem using CARD_WIDTH
    height: CARD_WIDTH * 1.5, // keep consistent height if needed
  },
}); 
