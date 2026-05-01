import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScoreBar } from './ScoreBar';
import { useRouter } from 'expo-router';

interface LeaderboardMovieRowProps {
  item: any;
  index: number;
}

const getRankStyle = (index: number) => {
  if (index === 0) return { colors: ['#c9952a', '#f0c040'] as const };
  if (index === 1) return { colors: ['#787878', '#b0b0b0'] as const };
  if (index === 2) return { colors: ['#9a5a2a', '#c87840'] as const };
  return null;
};

export const LeaderboardMovieRow = memo(({ item, index }: LeaderboardMovieRowProps) => {
  const router = useRouter();
  const rankStyle = getRankStyle(index);
  
  return (
    <Pressable 
      onPress={() => router.push(`/movie/${item.id}`)}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed
      ]}
    >
      <LinearGradient
        colors={[`${item.color}25`, '#141720']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardGlow}
      />
      
      <View style={styles.rankContainer}>
        {rankStyle ? (
          <LinearGradient
            colors={rankStyle.colors}
            style={styles.rankPodium}
          >
            <MaterialCommunityIcons name="crown" size={22} color="#fff" />
          </LinearGradient>
        ) : (
          <View style={styles.rankNormal}>
            <Text style={styles.rankTextNormal}>{index + 1}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
        <ScoreBar score={item.score} height={4} />
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreValue, { color: item.score >= 80 ? '#00ffc3' : '#ffd700' }]}>
          {item.score}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#141720',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  rowPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  rankContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankPodium: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rankNormal: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1c2030',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTextNormal: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 12,
    fontWeight: '700',
  },
  info: { 
    flex: 1, 
    gap: 4,
    zIndex: 1,
  },
  movieTitle: { 
    color: '#f0f2f7', 
    fontSize: 15, 
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
