import React, { useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { ScoreBar } from '../../components/ScoreBar';
import { VoteButtons } from '../../components/VoteButtons';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const movies = useAppStore(state => state.movies);
  const userVotes = useAppStore(state => state.userVotes);
  const toggleVote = useAppStore(state => state.toggleVote);

  const movie = useMemo(() => 
    movies.find(m => String(m.id) === String(id)),
    [movies, id]
  );

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Movie not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Visual */}
        <View style={[styles.hero, { backgroundColor: movie.color }]}>
          <Text style={styles.heroEmoji}>{movie.emoji}</Text>
          <BlurView tint="dark" intensity={20} style={styles.overlay} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>
            {movie.year} • {movie.genre} • {movie.duration}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AUDIENCE SCORE</Text>
            <View style={styles.ratingCard}>
              <View style={styles.scoreRow}>
                <Text style={[styles.bigScore, { color: movie.score >= 60 ? '#20c997' : '#fa5252' }]}>
                  {movie.score}%
                </Text>
                <Text style={styles.scoreLabel}>Voter Approval</Text>
              </View>
              <ScoreBar score={movie.score} height={8} showText={false} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR VOTE</Text>
            <VoteButtons 
              movieId={movie.id} 
              userVote={userVotes[movie.id] || null} 
              onVote={(type) => toggleVote(movie.id, type)}
              size="large"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <View style={styles.descCard}>
              <Text style={styles.descText}>{movie.desc}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Back Button */}
      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => router.back()}
      >
        <BlurView tint="dark" intensity={80} style={styles.backBlur}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06080d',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -40,
    backgroundColor: '#06080d',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f0f2f7',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  meta: {
    fontSize: 14,
    color: '#7a8899',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7a8899',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ratingCard: {
    backgroundColor: '#141720',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  bigScore: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7a8899',
    fontWeight: '500',
  },
  descCard: {
    backgroundColor: '#141720',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  descText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#a0aec0',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06080d',
  },
  errorText: {
    color: '#7a8899',
    fontSize: 16,
    marginBottom: 16,
  },
  backLink: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
});
