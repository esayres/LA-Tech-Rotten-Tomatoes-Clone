import React, { useCallback } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text, 
  SafeAreaView, 
  RefreshControl 
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { MovieCard } from '../../components/MovieCard';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const movies = useAppStore(state => state.movies);
  const isLoading = useAppStore(state => state.isLoading);
  const fetchMovies = useAppStore(state => state.fetchMovies);
  const userVotes = useAppStore(state => state.userVotes);
  const toggleVote = useAppStore(state => state.toggleVote);
  const idToken = useAppStore(state => state.idToken);

  React.useEffect(() => {
    fetchMovies();
  }, [idToken]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <MovieCard 
      movie={item} 
      userVote={userVotes[item.id] || null}
      onVote={(type) => toggleVote(item.id, type)}
    />
  ), [userVotes, toggleVote]);

  return (
    <View style={styles.container}>
      <BlurView tint="dark" intensity={80} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.title}>MovieRate</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BETA</Text>
            </View>
          </View>
        </SafeAreaView>
      </BlurView>

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchMovies} 
            tintColor="#4c6ef5"
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No movies found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06080d',
  },
  header: {
    paddingTop: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f0f2f7',
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: 'rgba(76, 110, 245, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(76, 110, 245, 0.3)',
  },
  badgeText: {
    color: '#4c6ef5',
    fontSize: 10,
    fontWeight: '800',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100, // Space for tab bar
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#7a8899',
    fontSize: 16,
  },
});
