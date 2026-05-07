import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  TextInput 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { ScoreBar } from '../../components/ScoreBar';
import { VoteButtons } from '../../components/VoteButtons';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import services from '../../scripts/services';

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

  const [reviews, setReviews] = React.useState<any[]>([]);
  const [detailedScore, setDetailedScore] = React.useState<any>(null);
  const [reviewText, setReviewText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const idToken = useAppStore(state => state.idToken);

  React.useEffect(() => {
    if (id) {
      services.movies.getReviews(Number(id)).then(setReviews);
      services.movies.getMovieScore(Number(id)).then(setDetailedScore);
    }
  }, [id]);

  const handlePostReview = async () => {
    if (!reviewText.trim() || !id) return;
    setIsSubmitting(true);
    try {
      await services.movies.postUserReview(Number(id), reviewText);
      setReviewText('');
      const [scoreData, reviewsData] = await Promise.all([
        services.movies.getMovieScore(Number(id)),
        services.movies.getReviews(Number(id))
      ]);
      setReviews(reviewsData);
      setDetailedScore(scoreData);
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {movie.backdropUrl ? (
            <Image 
              source={{ uri: movie.backdropUrl }} 
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={500}
            />
          ) : (
            <Text style={styles.heroEmoji}>{movie.emoji}</Text>
          )}
          <BlurView tint="dark" intensity={20} style={styles.overlay} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>
            {movie.displayYear} • {movie.displayGenre} • {movie.duration}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AUDIENCE SCORE</Text>
            <View style={styles.ratingCard}>
              <View style={styles.scoreRow}>
                <Text style={[styles.bigScore, { color: movie.score >= 60 ? '#20c997' : '#fa5252' }]}>
                  {movie.score}%
                </Text>
                <View>
                  <Text style={styles.scoreLabel}>Voter Approval</Text>
                  {detailedScore && (
                    <Text style={styles.scoreSubLabel}>
                      {detailedScore.totalLikes} Likes • {detailedScore.totalDislikes} Dislikes
                    </Text>
                  )}
                </View>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REVIEWS ({reviews.length})</Text>
            
            {idToken && (
              <View style={styles.writeReview}>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Write a review..."
                  placeholderTextColor="#4a5568"
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                />
                <TouchableOpacity 
                  style={[styles.postBtn, (!reviewText.trim() || isSubmitting) && styles.postBtnDisabled]}
                  onPress={handlePostReview}
                  disabled={!reviewText.trim() || isSubmitting}
                >
                  <Text style={styles.postBtnText}>{isSubmitting ? '...' : 'Post'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {(!Array.isArray(reviews) || reviews.length === 0) ? (
              <View style={styles.emptyReviews}>
                <Feather name="message-square" size={24} color="rgba(255,255,255,0.05)" />
                <Text style={styles.emptyReviewsText}>No reviews yet. Be the first to write one!</Text>
              </View>
            ) : (
              reviews.map((rev, idx) => (
                <View key={idx} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.userIcon}>
                      <Feather name="user" size={12} color="#7a8899" />
                    </View>
                    <Text style={styles.userId}>User {rev.userId?.slice(0, 6)}...</Text>
                  </View>
                  <Text style={styles.reviewText}>{rev.review}</Text>
                </View>
              ))
            )}
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
  scoreSubLabel: {
    fontSize: 12,
    color: '#5a6879',
    marginTop: 2,
  },
  reviewCard: {
    backgroundColor: '#141720',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  userIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userId: {
    fontSize: 11,
    color: '#7a8899',
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  emptyReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyReviewsText: {
    color: '#4a5568',
    fontSize: 14,
  },
  writeReview: {
    flexDirection: 'row',
    backgroundColor: '#141720',
    borderRadius: 16,
    padding: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'flex-end',
    gap: 8,
  },
  reviewInput: {
    flex: 1,
    color: '#f0f2f7',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 40,
    maxHeight: 120,
  },
  postBtn: {
    backgroundColor: '#4c6ef5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#2a3a5a',
  },
  postBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
