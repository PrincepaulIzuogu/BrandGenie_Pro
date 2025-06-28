// mobile/screens/SignupCompany.tsx

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
  ScrollView,
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
import logo from '../assets/logo.png';

export default function SignupCompany() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    owner_full_name: '',
    email: '',
    company_name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const bounceAnim = useRef(new Animated.Value(0)).current;
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

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        company_name: form.company_name,
        email: form.email,
        password: form.password,
        owner_full_name: form.owner_full_name,
      };

      // 1️⃣ Register company
      const response = await axios.post(
        'http://192.168.2.217:5000/api/register/company',
        payload
      );
      const companyCode = response.data.company_code;

      // 2️⃣ Send verification code
      await axios.post(
        `http://192.168.2.217:5000/api/send-verification-code?email=${form.email}`
      );

      // 3️⃣ Save email and code
      await AsyncStorage.setItem('verifyEmail', form.email);
      await AsyncStorage.setItem('companyCode', companyCode);

      // 4️⃣ Alert then navigate
      Alert.alert(
        'Success',
        '🎉 Company registered! Check your email for the code.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VerifyEmailCompany'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      const msg =
        error?.response?.data?.detail || 'Registration failed. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const { width } = Dimensions.get('window');
  const logoSize = width * 0.25;

  return (
    <LinearGradient
      colors={['#6B21A8', '#2563EB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <BlurView intensity={60} tint="light" style={styles.card}>
          <Animated.Image
            source={logo}
            style={[
              styles.logo,
              { width: logoSize, height: logoSize, transform: [{ translateY: bounceAnim }] },
            ]}
            resizeMode="contain"
          />
          <Text style={styles.heading}>Register as a Company</Text>

          <TextInput
            style={styles.input}
            placeholder="Your Full Name"
            placeholderTextColor="rgba(255,255,255,0.8)"
            value={form.owner_full_name}
            onChangeText={(t) => handleChange('owner_full_name', t)}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            placeholderTextColor="rgba(255,255,255,0.8)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => handleChange('email', t)}
          />
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor="rgba(255,255,255,0.8)"
            value={form.company_name}
            onChangeText={(t) => handleChange('company_name', t)}
          />
          <TextInput
            style={styles.input}
            placeholder="Create a Password"
            placeholderTextColor="rgba(255,255,255,0.8)"
            secureTextEntry
            value={form.password}
            onChangeText={(t) => handleChange('password', t)}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Registering...' : 'Register Company'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              Login here
            </Text>
          </Text>
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  logo: {
    marginBottom: 24,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: '#fff',
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
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
