import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { fetchMovieDetails, type Movie } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Loading } from '../components/Loading';
import { FailureView } from '../components/FailureView';

const { height, width } = Dimensions.get('window');

type ApiStatus = 'initial' | 'loading' | 'success' | 'failure';

type Props = NativeStackScreenProps<any, 'MovieDetails'>;

export const MovieDetailsScreen = ({ route }: Props) => {
  const { movieId } = route.params as { movieId: string };
  const { jwtToken } = useAuth();
  const [status, setStatus] = useState<ApiStatus>('initial');
  const [movie, setMovie] = useState<Movie | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!jwtToken) return;
    setStatus('loading');
    try {
      const data = await fetchMovieDetails(jwtToken, movieId);
      setMovie(data);
      setStatus('success');
    } catch (error) {
      setStatus('failure');
    }
  }, [jwtToken, movieId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failure') {
    return <FailureView onRetry={fetchDetails} />;
  }

  if (!movie) {
    return null;
  }

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: movie.backdropPath }}
        style={styles.backdrop}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)', '#000000']}
          style={styles.backdropGradient}
        >
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{formatRuntime(movie.runtime)}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>
              {movie.adult ? 'A' : 'U/A'}
            </Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>
              {movie.releaseDate?.split('-')[0] || 'N/A'}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        {movie.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        )}

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Release Date</Text>
            <Text style={styles.detailValue}>{formatDate(movie.releaseDate)}</Text>
          </View>

          {movie.budget && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Budget</Text>
              <Text style={styles.detailValue}>{movie.budget}</Text>
            </View>
          )}

          {movie.voteAverage !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rating</Text>
              <Text style={styles.detailValue}>
                {movie.voteAverage.toFixed(1)} / 10
              </Text>
            </View>
          )}

          {movie.voteCount !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Vote Count</Text>
              <Text style={styles.detailValue}>
                {movie.voteCount.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {movie.genres && movie.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.languagesText}>
              {movie.spokenLanguages.map((lang) => lang.englishName).join(', ')}
            </Text>
          </View>
        )}

        {movie.similarMovies && movie.similarMovies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Like This</Text>
            <FlatList
              data={movie.similarMovies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <MovieCard movie={item} size="small" />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarList}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backdrop: {
    height: height * 0.45,
  },
  backdropGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#cccccc',
    fontSize: 14,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 8,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  overview: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 16,
  },
  detailItem: {
    width: (width - 48) / 2,
  },
  detailLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
  },
  languagesText: {
    color: '#cccccc',
    fontSize: 14,
  },
  similarList: {
    paddingRight: 16,
  },
});
