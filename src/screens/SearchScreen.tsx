import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Keyboard,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { searchMovies, type Movie } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Loading } from '../components/Loading';
import { FailureView } from '../components/FailureView';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 3;
const CARD_WIDTH = (width - 48) / NUM_COLUMNS;

type ApiStatus = 'initial' | 'loading' | 'success' | 'failure';

export const SearchScreen = () => {
  const { jwtToken } = useAuth();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ApiStatus>('initial');
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !jwtToken) return;
    Keyboard.dismiss();
    setStatus('loading');
    try {
      const data = await searchMovies(jwtToken, query);
      setMovies(data);
      setStatus('success');
    } catch (error) {
      setStatus('failure');
    }
  }, [jwtToken, query]);

  const clearSearch = () => {
    setQuery('');
    setMovies([]);
    setStatus('initial');
  };

  const renderEmptyState = () => {
    if (status === 'initial') {
      return (
        <View style={styles.emptyState}>
          <Search color="#666" size={64} />
          <Text style={styles.emptyStateText}>
            Search for your favorite movies
          </Text>
        </View>
      );
    }

    if (status === 'success' && movies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426934/not-found_wfzpfk.png',
            }}
            style={styles.noResultsImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyStateText}>
            No movies found for "{query}"
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#666" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies..."
            placeholderTextColor="#666"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X color="#666" size={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' ? (
        <Loading />
      ) : status === 'failure' ? (
        <FailureView onRetry={handleSearch} />
      ) : movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <MovieCard movie={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  noResultsImage: {
    width: 200,
    height: 150,
  },
});
