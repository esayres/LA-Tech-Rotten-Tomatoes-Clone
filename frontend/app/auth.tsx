import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAppStore(state => state.login);
  const router = useRouter();

  const handleLogin = () => {
    if (email && password) {
      login(email);
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Decor */}
      <View style={styles.bgDecor1} />
      <View style={styles.bgDecor2} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboard}
        >
          <TouchableOpacity 
            style={styles.closeBtn}
            onPress={() => router.back()}
          >
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Feather name="film" size={32} color="#fff" />
            </View>
            <Text style={styles.appName}>MovieRate</Text>
            <Text style={styles.tagline}>The elite community for cinematic discourse.</Text>
          </View>

          <BlurView tint="dark" intensity={90} style={styles.glassCard}>
            <View style={styles.tabs}>
              <View style={styles.tab}>
                <Text style={[styles.tabText, styles.activeTab]}>Sign In</Text>
                <View style={styles.activeIndicator} />
              </View>
              <View style={styles.tab}>
                <Text style={styles.tabText}>Sign Up</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={16} color="rgba(255,255,255,0.2)" />
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={16} color="rgba(255,255,255,0.2)" />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.cta}
                onPress={handleLogin}
              >
                <Text style={styles.ctaText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          <Text style={styles.footer}>
            By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text>.
          </Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06080d',
  },
  bgDecor1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(76, 110, 245, 0.15)',
  },
  bgDecor2: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(32, 201, 151, 0.1)',
  },
  safe: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 24,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#4c6ef5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4c6ef5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f0f2f7',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#7a8899',
    textAlign: 'center',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.32)',
  },
  activeTab: {
    color: '#f0f2f7',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 2,
    backgroundColor: '#4c6ef5',
    borderRadius: 1,
    shadowColor: '#4c6ef5',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7a8899',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#f0f2f7',
    fontSize: 15,
  },
  cta: {
    backgroundColor: '#4c6ef5',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#4c6ef5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#4c6ef5',
  },
});
