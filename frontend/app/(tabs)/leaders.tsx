import React, { useState, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  View, 
  Text, 
  SafeAreaView,
  Pressable
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { BlurView } from 'expo-blur';
import { LeaderboardMovieRow } from '../../components/LeaderboardMovieRow';
import { LeaderboardUserRow } from '../../components/LeaderboardUserRow';

// Mock User Data
const TOP_USERS = [
  { id: 1, name: 'Alex Rivera', votes: 1240, level: 'Elite Critic', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 2, name: 'Sarah Chen', votes: 982, level: 'Master Cinephile', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 3, name: 'Marcus Bell', votes: 845, level: 'Gold Reviewer', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 4, name: 'Elena Vance', votes: 621, level: 'Dedicated Fan', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: 5, name: 'Jordan Hayes', votes: 432, level: 'Active Voter', avatar: 'https://i.pravatar.cc/150?u=jordan' },
];

export default function LeadersScreen() {
  const movies = useAppStore(state => state.movies);
  const [activeTab, setActiveTab] = useState<'movies' | 'users'>('movies');
  
  const sortedMovies = useMemo(() => 
    [...movies].sort((a, b) => b.score - a.score),
    [movies]
  );

  const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
    if (activeTab === 'movies') {
      return <LeaderboardMovieRow item={item} index={index} />;
    }
    return <LeaderboardUserRow item={item} index={index} />;
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <BlurView tint="dark" intensity={80} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Leaderboard</Text>
          </View>
          
          <View style={styles.tabBar}>
            <Pressable 
              onPress={() => setActiveTab('movies')}
              style={[styles.tab, activeTab === 'movies' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'movies' && styles.activeTabText]}>Top Movies</Text>
              {activeTab === 'movies' && <View style={styles.tabUnderline} />}
            </Pressable>
            
            <Pressable 
              onPress={() => setActiveTab('users')}
              style={[styles.tab, activeTab === 'users' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Top Users</Text>
              {activeTab === 'users' && <View style={styles.tabUnderline} />}
            </Pressable>
          </View>
        </SafeAreaView>
      </BlurView>

      <FlatList
        data={activeTab === 'movies' ? sortedMovies : TOP_USERS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
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
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f0f2f7',
    letterSpacing: -0.5,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7a8899',
  },
  activeTabText: {
    color: '#f0f2f7',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 6,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: '#4c6ef5',
    borderRadius: 1,
    shadowColor: '#4c6ef5',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
