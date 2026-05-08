import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { fetchTrendingMovies, fetchOriginalMovies, type Movie } from '../services/api';
import { MovieSlider } from '../components/MovieSlider';
import { Loading } from '../components/Loading';

const { height } = Dimensions.get('window');

type ApiStatus = 'initial' | 'loading' | 'success' | 'failure';

export const HomeScreen = () => {
  const { jwtToken } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [trendingStatus, setTrendingStatus] = useState<ApiStatus>('initial');
  const [originalsStatus, setOriginalsStatus] = useState<ApiStatus>('initial');
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [originalMovies, setOriginalMovies] = useState<Movie[]>([]);
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrending = useCallback(async () => {
    if (!jwtToken) return;
    setTrendingStatus('loading');
    try {
      const movies = await fetchTrendingMovies(jwtToken);
      setTrendingMovies(movies);
      if (movies.length > 0) {
        setRandomMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
      setTrendingStatus('success');
    } catch (error) {
      setTrendingStatus('failure');
    }
  }, [jwtToken]);

  const fetchOriginals = useCallback(async () => {
    if (!jwtToken) return;
    setOriginalsStatus('loading');
    try {
      const movies = await fetchOriginalMovies(jwtToken);
      setOriginalMovies(movies);
      setOriginalsStatus('success');
    } catch (error) {
      setOriginalsStatus('failure');
    }
  }, [jwtToken]);

  useEffect(() => {
    fetchTrending();
    fetchOriginals();
  }, [fetchTrending, fetchOriginals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchTrending(), fetchOriginals()]);
    setRefreshing(false);
  }, [fetchTrending, fetchOriginals]);

  if (trendingStatus === 'loading' && originalsStatus === 'loading') {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e50914" />
      }
    >
      {randomMovie && (
        <ImageBackground
          source={{ uri: randomMovie.backdropPath }}
          style={styles.heroContainer}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{randomMovie.title}</Text>
              {randomMovie.overview && (
                <Text style={styles.heroOverview} numberOfLines={3}>
                  {randomMovie.overview}
                </Text>
              )}
              <TouchableOpacity
                style={styles.playButton}
                onPress={() =>
                  navigation.navigate('MovieDetails', { movieId: randomMovie.id })
                }
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      )}

      <View style={styles.sectionsContainer}>
        <MovieSlider
          title="Trending Now"
          movies={trendingMovies}
          status={trendingStatus}
          onRetry={fetchTrending}
        />

        <MovieSlider
          title="Originals"
          movies={originalMovies}
          status={originalsStatus}
          onRetry={fetchOriginals}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  heroContainer: {
    height: height * 0.55,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroContent: {
    marginBottom: 20,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  heroOverview: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionsContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});
