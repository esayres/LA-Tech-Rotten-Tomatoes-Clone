import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

interface LeaderboardUserRowProps {
  item: any;
  index: number;
}

const getRankStyle = (index: number) => {
  if (index === 0) return { colors: ['#c9952a', '#f0c040'] as const };
  if (index === 1) return { colors: ['#787878', '#b0b0b0'] as const };
  if (index === 2) return { colors: ['#9a5a2a', '#c87840'] as const };
  return null;
};

export const LeaderboardUserRow = memo(({ item, index }: LeaderboardUserRowProps) => {
  const rankStyle = getRankStyle(index);

  return (
    <View style={styles.row}>
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

      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      
      <View style={styles.info}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userLevel}>{item.level}</Text>
      </View>

      <View style={styles.voteContainer}>
        <Text style={styles.voteCount}>{item.votes}</Text>
        <Text style={styles.voteLabel}>VOTES</Text>
      </View>
    </View>
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
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  info: { 
    flex: 1, 
    gap: 4,
    zIndex: 1,
  },
  userName: { 
    color: '#f0f2f7', 
    fontSize: 15, 
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  userLevel: {
    color: '#7a8899',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  voteContainer: {
    alignItems: 'flex-end',
  },
  voteCount: {
    color: '#f0f2f7',
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  voteLabel: {
    color: '#7a8899',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
