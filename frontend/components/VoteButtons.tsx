import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { useAppStore } from '../store/useAppStore';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface VoteButtonsProps {
  movieId: string | number;
  userVote: 'up' | 'down' | null;
  onVote: (type: 'up' | 'down') => void;
  size?: 'small' | 'large';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const VoteButtons: React.FC<VoteButtonsProps> = ({ 
  movieId, 
  userVote, 
  onVote,
  size = 'small'
}) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  const router = useRouter();
  const upScale = useSharedValue(1);
  const downScale = useSharedValue(1);

  const handlePress = (type: 'up' | 'down') => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const scale = type === 'up' ? upScale : downScale;
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
    onVote(type);
  };

  const upStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upScale.value }],
  }));

  const downStyle = useAnimatedStyle(() => ({
    transform: [{ scale: downScale.value }],
  }));

  const isSmall = size === 'small';

  return (
    <View style={styles.container}>
      <AnimatedTouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress('up')}
        style={[
          styles.btn,
          isSmall ? styles.btnSmall : styles.btnLarge,
          userVote === 'up' && styles.upVoted,
          upStyle,
        ]}
      >
        <Feather 
          name="thumbs-up" 
          size={isSmall ? 16 : 20} 
          color={userVote === 'up' ? '#20c997' : 'rgba(255,255,255,0.45)'} 
        />
      </AnimatedTouchableOpacity>

      <AnimatedTouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress('down')}
        style={[
          styles.btn,
          isSmall ? styles.btnSmall : styles.btnLarge,
          userVote === 'down' && styles.downVoted,
          downStyle,
        ]}
      >
        <Feather 
          name="thumbs-down" 
          size={isSmall ? 16 : 20} 
          color={userVote === 'down' ? '#4c6ef5' : 'rgba(255,255,255,0.45)'} 
        />
      </AnimatedTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  btnSmall: {
    width: 40,
    height: 40,
  },
  btnLarge: {
    flex: 1,
    height: 48,
    borderRadius: 14,
  },
  upVoted: {
    borderColor: 'rgba(32, 201, 151, 0.5)',
    backgroundColor: 'rgba(32, 201, 151, 0.12)',
    shadowColor: '#20c997',
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  downVoted: {
    borderColor: 'rgba(76, 110, 245, 0.5)',
    backgroundColor: 'rgba(76, 110, 245, 0.12)',
    shadowColor: '#4c6ef5',
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
});
