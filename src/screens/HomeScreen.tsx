import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { fetchTrendingMovies, fetchOriginalMovies, type Movie } from '../services/api';
import { MovieSlider } from '../components/MovieSlider';
import { Loading } from '../components/Loading';

const { height } = Dimensions.get('window');

export const HomeScreen = () => {
  const { jwtToken } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [originalMovies, setOriginalMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!jwtToken) return;
    setStatus('loading');
    try {
      const [trending, originals] = await Promise.all([
        fetchTrendingMovies(jwtToken),
        fetchOriginalMovies(jwtToken),
      ]);
      setTrendingMovies(trending);
      setOriginalMovies(originals);
      setStatus('success');
    } catch {
      setStatus('failure');
    }
  };

  useEffect(() => {
    loadData();
  }, [jwtToken]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();   // ✅ now updates state
    setRefreshing(false);
  }, [jwtToken]);

  const randomMovie = useMemo(() => {
    if (!trendingMovies.length) return null;
    return trendingMovies[Math.floor(Math.random() * trendingMovies.length)];
  }, [trendingMovies, refreshing]);   // ✅ re-compute on refresh

  if (status === 'loading') return <Loading />;

  return (
    <FlatList
      style={styles.container}
      data={[{ key: 'content' }]}
      renderItem={() => (
        <View style={styles.sectionsContainer}>
          <MovieSlider title="Trending Now" movies={trendingMovies} status={status} onRetry={loadData} />
          <MovieSlider title="Originals" movies={originalMovies} status={status} onRetry={loadData} />
        </View>
      )}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={
        randomMovie && (
          <ImageBackground source={{ uri: randomMovie.backdropPath }} style={styles.heroContainer}>
            <View style={styles.overlay} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)', '#000']} style={styles.heroGradient}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{randomMovie.title}</Text>
                {randomMovie.overview && (
                  <Text style={styles.heroOverview} numberOfLines={3}>
                    {randomMovie.overview}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => navigation.navigate('MovieDetails', { movieId: randomMovie.id })}
                >
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        )
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e50914" />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heroContainer: { height: height * 0.55 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  heroGradient: { flex: 1, justifyContent: 'flex-end', padding: 16 },
  heroContent: { marginBottom: 20 },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  heroOverview: { color: '#ccc', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  playButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  playButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionsContainer: { paddingTop: 20, paddingBottom: 40 },
});
