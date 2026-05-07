import React, { useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function ProfileScreen() {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  const userVotes = useAppStore(state => state.userVotes);
  const movies = useAppStore(state => state.movies);
  const router = useRouter();

  const stats = useMemo(() => {
    const votedIds = Object.keys(userVotes).filter(id => userVotes[id] !== null);
    const upCount = Object.values(userVotes).filter(v => v === 'up').length;
    const downCount = Object.values(userVotes).filter(v => v === 'down').length;
    return { votedIds, upCount, downCount };
  }, [userVotes]);

  const recentHistory = useMemo(() => {
    return stats.votedIds.map(id => {
      const movie = movies.find(m => String(m.id) === String(id));
      if (movie) return { ...movie, vote: userVotes[id] };
      
      // Fallback for movies not currently in the home feed list
      return { 
        id, 
        title: `Movie #${id}`, 
        vote: userVotes[id],
        displayGenre: 'Voted',
        displayYear: 'History',
        color: '#141720',
        emoji: '🎬'
      };
    }).filter(Boolean);
  }, [stats.votedIds, movies, userVotes]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <Feather name="user" size={64} color="rgba(255,255,255,0.05)" />
          <Text style={styles.loginTitle}>Join MovieRate</Text>
          <Text style={styles.loginSubtitle}>Sign in to vote on your favorite movies and track your history.</Text>
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.loginBtnText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.avatar }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.votedIds.length}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
          <View style={[styles.statCard]}>
            <Text style={[styles.statValue, { color: '#20c997' }]}>{stats.upCount}</Text>
            <Text style={styles.statLabel}>Upvotes</Text>
          </View>
          <View style={[styles.statCard]}>
            <Text style={[styles.statValue, { color: '#4c6ef5' }]}>{stats.downCount}</Text>
            <Text style={styles.statLabel}>Downvotes</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent History</Text>
          {recentHistory.length === 0 ? (
            <Text style={styles.emptyText}>You haven't voted on any movies yet.</Text>
          ) : (
            recentHistory.map((item: any) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={[styles.historyIcon, { backgroundColor: item.color }]}>
                  {item.posterUrl ? (
                    <Image 
                      source={{ uri: item.posterUrl }} 
                      style={StyleSheet.absoluteFill}
                      contentFit="cover"
                    />
                  ) : (
                    <Text>{item.emoji}</Text>
                  )}
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyMeta}>{item.displayGenre} • {item.displayYear}</Text>
                </View>
                <View style={[
                  styles.voteBadge, 
                  item.vote === 'up' ? styles.badgeUp : styles.badgeDown
                ]}>
                  <Feather 
                    name={item.vote === 'up' ? "thumbs-up" : "thumbs-down"} 
                    size={14} 
                    color={item.vote === 'up' ? '#20c997' : '#4c6ef5'} 
                  />
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Feather name="log-out" size={18} color="#fa5252" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06080d',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f0f2f7',
    marginTop: 20,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#7a8899',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  loginBtn: {
    backgroundColor: '#4c6ef5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#4c6ef5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f0f2f7',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7a8899',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#141720',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f0f2f7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7a8899',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f0f2f7',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141720',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    color: '#eef0f6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyMeta: {
    color: '#7a8899',
    fontSize: 12,
  },
  voteBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeUp: {
    backgroundColor: 'rgba(32, 201, 151, 0.1)',
    borderColor: 'rgba(32, 201, 151, 0.3)',
  },
  badgeDown: {
    backgroundColor: 'rgba(76, 110, 245, 0.1)',
    borderColor: 'rgba(76, 110, 245, 0.3)',
  },
  emptyText: {
    color: '#7a8899',
    fontSize: 14,
    fontStyle: 'italic',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250, 82, 82, 0.2)',
  },
  logoutBtnText: {
    color: '#fa5252',
    fontWeight: '600',
  },
});
