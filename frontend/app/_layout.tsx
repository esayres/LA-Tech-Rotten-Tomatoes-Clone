import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAppStore } from '../store/useAppStore';
import { useEffect } from 'react';

export default function RootLayout() {
  const fetchMovies = useAppStore(state => state.fetchMovies);

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="movie/[id]" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
