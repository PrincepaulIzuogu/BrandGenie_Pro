// mobile/screens/LoginCompany.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';

export default function LoginCompany() {
  // Typed navigation prop
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  const handleChange = (key: 'email' | 'password', value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const { data: loginData } = await axios.post(
        'http://192.168.2.217:5000/api/login/company',
        {
          email: form.email,
          password: form.password,
        }
      );
      const { access_token } = loginData;
      await AsyncStorage.setItem('token', access_token);

      const { data: companyProfile } = await axios.get(
        'http://192.168.2.217:5000/api/company/me',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      setUser({
        id: companyProfile.id,
        name: companyProfile.company_name,
        role: 'company',
      });

      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('CompanyDashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const msg =
        error?.response?.data?.detail || 'Login failed. Please try again.';
      Alert.alert('Login Error', msg);
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#805ad5', '#3b82f6']}
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
        <Text style={styles.heading}>Login as Company</Text>

        <TextInput
          style={styles.input}
          placeholder="Company Email"
          placeholderTextColor="rgba(0,0,0,0.5)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(0,0,0,0.5)"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
        />

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Forgot password?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Reset
          </Text>
        </Text>
        <Text style={styles.footerText}>
          New company?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Signup')}
          >
            Sign up here
          </Text>
        </Text>
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#F6E05E', // yellow-400
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
