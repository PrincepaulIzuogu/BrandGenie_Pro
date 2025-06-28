// mobile/screens/SignupUser.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
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

export default function SignupUser() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [role, setRole] = useState<'company' | 'independent' | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyCode: '',
    password: '',
    confirmPassword: '',
  });
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

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { fullName, email, password, confirmPassword, companyCode } = form;
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        role === 'company'
          ? 'http://192.168.2.217:5000/api/register-user/company'
          : 'http://192.168.2.217:5000/api/register-user/independent';

      const payload: any = { full_name: fullName, email, password };
      if (role === 'company') payload.company_code = companyCode;

      await axios.post(endpoint, payload);
      await axios.post(
        `http://192.168.2.217:5000/api/send-verification-code?email=${email}`
      );
      await AsyncStorage.setItem('verifyEmail', email);

      Alert.alert('Success', 'Registration successful! Check your email.', [
        { text: 'OK', onPress: () => navigation.navigate('VerifyEmail') },
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      const msg = error?.response?.data?.detail || 'Registration failed. Try again.';
      Alert.alert('Error', msg);
      setLoading(false);
    }
  };

  const { width } = Dimensions.get('window');
  const logoSize = width * 0.25;

  return (
    <LinearGradient
      colors={['#805ad5', '#3b82f6']}
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
          <Text style={styles.heading}>Sign Up as a User</Text>

          {!role ? (
            <View style={styles.choiceGroup}>
              <TouchableOpacity
                style={[styles.button, styles.companyButton]}
                onPress={() => setRole('company')}
              >
                <Text style={[styles.buttonText, styles.companyText]}>Company User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.userButton]}
                onPress={() => setRole('independent')}
              >
                <Text style={[styles.buttonText, styles.userText]}>Independent User</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="rgba(0,0,0,0.5)"
                value={form.fullName}
                onChangeText={t => handleChange('fullName', t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(0,0,0,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={t => handleChange('email', t)}
              />
              {role === 'company' && (
                <TextInput
                  style={styles.input}
                  placeholder="Company Code"
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  value={form.companyCode}
                  onChangeText={t => handleChange('companyCode', t)}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(0,0,0,0.5)"
                secureTextEntry
                value={form.password}
                onChangeText={t => handleChange('password', t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(0,0,0,0.5)"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={t => handleChange('confirmPassword', t)}
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={[styles.buttonText, styles.submitText]}>Register</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Login')}
                >
                  Login
                </Text>
              </Text>
            </>
          )}
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24, padding: 32, alignItems: 'center' },
  logo: { marginBottom: 24 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 24, textAlign: 'center' },
  choiceGroup: { width: '100%', marginBottom: 24 },
  button: { paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  companyButton: { backgroundColor: '#F6E05E' },
  userButton: { backgroundColor: '#fff' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  companyText: { color: '#000' },
  userText: { color: '#3b82f6' },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 16 },
  submitButton: { backgroundColor: '#F6E05E', width: '100%', marginTop: 8 },
  submitText: { color: '#000' },
  disabledButton: { opacity: 0.6 },
  footerText: { color: '#fff', fontSize: 14, marginTop: 24, textAlign: 'center' },
  link: { textDecorationLine: 'underline', fontWeight: '600' },
});
