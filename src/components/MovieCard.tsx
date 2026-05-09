import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Movie } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

export const MovieCard = ({ movie, size = 'medium' }: MovieCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [imageError, setImageError] = useState(false);

  const cardWidth = size === 'small' ? CARD_WIDTH * 0.8 : size === 'large' ? CARD_WIDTH * 1.5 : CARD_WIDTH;
  const cardHeight = cardWidth * 1.5;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        {!imageError && movie.posterPath ? (
          <Image
            source={{ uri: movie.posterPath }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          // fallback: empty black box with subtle overlay (keeps UI consistent)
          <View style={styles.fallback} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000', // prevents white flash while loading
  },
  fallback: {
    flex: 1,
    backgroundColor: '#111',
  },
});
