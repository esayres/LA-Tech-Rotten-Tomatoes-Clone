import React, { useState, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  TextInput, 
  SafeAreaView,
  Text
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { MovieCard } from '../../components/MovieCard';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function SearchScreen() {
  const movies = useAppStore(state => state.movies);
  const userVotes = useAppStore(state => state.userVotes);
  const toggleVote = useAppStore(state => state.toggleVote);
  const [query, setQuery] = useState('');

  const filteredMovies = useMemo(() => 
    movies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase())
    ),
    [movies, query]
  );

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
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="rgba(255,255,255,0.3)" />
              <TextInput
                placeholder="Search movies or genres..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
              />
              {query.length > 0 && (
                <Feather 
                  name="x" 
                  size={18} 
                  color="rgba(255,255,255,0.3)" 
                  onPress={() => setQuery('')}
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      </BlurView>

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={48} color="rgba(255,255,255,0.05)" />
            <Text style={styles.emptyText}>
              {query ? 'No movies match your search.' : 'Type to start searching...'}
            </Text>
          </View>
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
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141720',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#f0f2f7',
    fontSize: 15,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 16,
  },
  emptyText: {
    color: '#7a8899',
    fontSize: 14,
  },
});
