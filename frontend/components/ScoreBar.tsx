import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

interface ScoreBarProps {
  score: number;
  showText?: boolean;
  height?: number;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ 
  score, 
  showText = true, 
  height = 4 
}) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(score, { duration: 1000 });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const getColors = () => {
    if (score >= 80) return ['#00ffc3', '#00d2ff']; // Neon Teal/Blue
    if (score >= 60) return ['#ffd700', '#ff8c00']; // Vivid Gold/Orange
    return ['#ff0055', '#ff5500']; // Hot Pink/Red
  };

  const getTextColor = () => {
    if (score >= 80) return '#20c997';
    if (score >= 60) return '#fab005';
    return '#fa5252';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fillWrapper, animatedStyle]}>
          <LinearGradient
            colors={getColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      {showText && (
        <Text style={[styles.pct, { color: getTextColor() }]}>
          {score}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fillWrapper: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  pct: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'right',
  },
});
