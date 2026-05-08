import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
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

  const cardWidth = size === 'small' ? CARD_WIDTH * 0.8 : size === 'large' ? CARD_WIDTH * 1.5 : CARD_WIDTH;
  const cardHeight = cardWidth * 1.5;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: movie.posterPath }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
