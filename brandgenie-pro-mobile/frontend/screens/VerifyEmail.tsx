// mobile/screens/VerifyEmail.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png';

export default function VerifyEmail() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [bounceAnim]);

  useEffect(() => {
    AsyncStorage.getItem('verifyEmail').then((e) => {
      if (!e) {
        Alert.alert('Error', 'No email found. Please sign up again.', [
          { text: 'OK', onPress: () => navigation.navigate('Signup') },
        ]);
      } else {
        setEmail(e);
      }
    });
  }, [navigation]);

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    if (!email) return;
    setLoading(true);
    try {
      await axios.post('http://192.168.2.217:5000/api/verify-email', { email, code });
      await AsyncStorage.removeItem('verifyEmail');
      Alert.alert('Success', 'Email verified successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Verification failed. Please try again.';
      setError(msg);
      Alert.alert('Error', msg);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await axios.post(`http://192.168.2.217:5000/api/send-verification-code?email=${email}`);
      Alert.alert('Success', 'Verification code resent!');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to resend code. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setResending(false);
    }
  };

  const { width } = Dimensions.get('window');

  return (
    <LinearGradient
      colors={['#4f46e5', '#3b82f6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <BlurView intensity={50} tint="light" style={styles.card}>
        <Animated.Image
          source={logo}
          style={[
            styles.logo,
            { width: width * 0.25, height: width * 0.25, transform: [{ translateY: bounceAnim }] },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Verify Your Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          placeholderTextColor="rgba(0,0,0,0.5)"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Verify Email</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resending}>
          <Text style={styles.resendText}>{resending ? 'Resending...' : 'Resend Code'}</Text>
        </TouchableOpacity>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#F6E05E',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendText: {
    color: '#fff',
    marginTop: 16,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  errorText: {
    color: '#f87171',
    marginBottom: 8,
  },
});
