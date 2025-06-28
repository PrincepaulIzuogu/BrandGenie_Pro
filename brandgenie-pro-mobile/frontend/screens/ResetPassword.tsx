// mobile/screens/ResetPassword.tsx

import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  useNavigation,
  NavigationProp
} from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png';

export default function ResetPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    AsyncStorage.multiGet(['resetEmail', 'resetAccountType']).then((pairs) => {
      const e = pairs.find(([key]) => key === 'resetEmail')?.[1] || null;
      const t = pairs.find(([key]) => key === 'resetAccountType')?.[1] || null;
      if (!e || !t) {
        Alert.alert('Error', 'Missing reset info. Please start again.', [
          { text: 'OK', onPress: () => navigation.navigate('ForgotPassword') },
        ]);
      } else {
        setEmail(e);
        setAccountType(t);
      }
    });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!email || !accountType) return;

    setLoading(true);
    try {
      const endpoint =
        accountType === 'company'
          ? 'http://192.168.2.217:5000/api/reset-password/company'
          : 'http://192.168.2.217:5000/api/reset-password/user';

      await axios.post(endpoint, {
        email,
        code,
        new_password: newPassword,
      });

      await AsyncStorage.multiRemove(['resetEmail', 'resetAccountType']);

      Alert.alert('Success', 'Password reset successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to reset password.';
      Alert.alert('Error', msg);
      setLoading(false);
    }
  };

  const { width } = Dimensions.get('window');

  return (
    <LinearGradient
      colors={['#2563EB', '#805AD5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BlurView intensity={50} tint="light" style={styles.card}>
          <Animated.Image
            source={logo}
            style={{
              width: width * 0.25,
              height: width * 0.25,
              marginBottom: 24,
              transform: [{ translateY: bounceAnim }],
            }}
            resizeMode="contain"
          />
          <Text style={styles.heading}>Reset Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter reset code"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={code}
            onChangeText={setCode}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#F6E05E',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 8,
  },
});
