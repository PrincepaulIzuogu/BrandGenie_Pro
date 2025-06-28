// mobile/screens/ForgotPassword.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png';
import { Feather } from '@expo/vector-icons';

const ACCOUNT_OPTIONS = [
  { label: 'User (Independent/Company User)', value: 'user' },
  { label: 'Company', value: 'company' },
];

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState<'user' | 'company' | ''>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Bounce animation for logo
  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 500, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [bounceAnim]);

  const handleSubmit = async () => {
    if (!email || !accountType) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const endpoint =
        accountType === 'company'
          ? 'http://192.168.2.217:5000/api/forgot-password/company'
          : 'http://192.168.2.217:5000/api/forgot-password/user';
      await axios.post(endpoint, { email });
      await AsyncStorage.setItem('resetEmail', email);
      await AsyncStorage.setItem('resetAccountType', accountType);
      navigation.navigate('ResetPassword');
      Alert.alert('Success', '📧 Reset code sent to your email!');
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Failed to send reset code.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const { width } = Dimensions.get('window');

  const selectedLabel =
    ACCOUNT_OPTIONS.find(opt => opt.value === accountType)?.label || 'Select Account Type';

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
            style={{ width: width * 0.25, height: width * 0.25, transform: [{ translateY: bounceAnim }], marginBottom: 24 }}
            resizeMode="contain"
          />
          <Text style={styles.heading}>Forgot Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your registered email"
            placeholderTextColor="rgba(0,0,0,0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={[styles.dropdownText, !accountType && styles.placeholderText]}>
              {selectedLabel}
            </Text>
            <Feather name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>

      {showDropdown && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDropdown(false)}
          />
          <View style={styles.modalContent}>
            {ACCOUNT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={styles.modalItem}
                onPress={() => {
                  setAccountType(opt.value as any);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.modalItemText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dropdown: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dropdownText: { fontSize: 16, color: '#000' },
  placeholderText: { color: 'rgba(0,0,0,0.5)' },
  button: {
    width: '100%',
    backgroundColor: '#F6E05E',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.6 },
  linkText: { color: '#fff', textDecorationLine: 'underline', fontSize: 14 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
});
