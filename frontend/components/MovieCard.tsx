import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ScoreBar } from './ScoreBar';
import { VoteButtons } from './VoteButtons';
import { HydratedMovie } from '../utils/movieMapper';
import { useRouter } from 'expo-router';

interface MovieCardProps {
  movie: HydratedMovie;
  userVote: 'up' | 'down' | null;
  onVote: (type: 'up' | 'down') => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  userVote, 
  onVote 
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <Pressable 
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.inner}>
        {/* Placeholder for Movie Poster/Icon */}
        <View style={[styles.poster, { backgroundColor: movie.color }]}>
          <Text style={styles.emoji}>{movie.emoji}</Text>
        </View>

        <View style={styles.info}>
          <View>
            <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.genre} • {movie.year}</Text>
          </View>
          
          <ScoreBar score={movie.score} />
          
          <View style={styles.footer}>
            <Text style={styles.duration}>{movie.duration}</Text>
            <VoteButtons 
              movieId={movie.id} 
              userVote={userVote} 
              onVote={onVote} 
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#141720',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 4,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  inner: {
    flexDirection: 'row',
    padding: 14,
    gap: 14,
    minHeight: 110,
  },
  poster: {
    width: 80,
    height: 110,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#eef0f6',
    letterSpacing: -0.01,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#7a8899',
    fontWeight: '400',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  duration: {
    fontSize: 11,
    color: '#7a8899',
    fontWeight: '500',
  },
});
