// mobile/screens/VerifyEmailCompany.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png';

export default function VerifyEmailCompany() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [companyCode, setCompanyCode] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

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
          { text: 'OK', onPress: () => navigation.navigate('SignupCompany') },
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

      const resp = await axios.get(`http://192.168.2.217:5000/api/get-company-code?email=${email}`);
      setCompanyCode(resp.data.company_code);

      await AsyncStorage.removeItem('verifyEmail');
      setShowModal(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Verification failed. Please try again.';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
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

  const handleCloseModal = () => {
    setShowModal(false);
    navigation.navigate('Login');
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
          style={{ width: width * 0.2, height: width * 0.2, transform: [{ translateY: bounceAnim }] }}
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

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Company Code</Text>
            <Text style={styles.modalCode}>{companyCode}</Text>
            <Text style={styles.modalSubtitle}>
              Please keep this code safe and give it to your workers to register.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 400, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24, padding: 32, alignItems: 'center' },
  heading: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 12 },
  button: { width: '100%', backgroundColor: '#F6E05E', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.6 },
  resendText: { color: '#fff', marginTop: 16, textDecorationLine: 'underline', fontSize: 14 },
  errorText: { color: '#f87171', marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  modalCode: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
  modalSubtitle: { textAlign: 'center', marginBottom: 24, color: '#555' },
  modalButton: { backgroundColor: '#4f46e5', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
