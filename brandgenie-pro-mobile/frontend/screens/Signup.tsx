// mobile/screens/Signup.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png';

export default function Signup() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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

  const logoSize = width * 0.3;

  return (
    <LinearGradient
      colors={['#4f46e5', '#ec4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <BlurView intensity={60} tint="light" style={styles.card}>
        <Animated.Image
          source={logo}
          style={[
            styles.logo,
            { width: logoSize, height: logoSize, transform: [{ translateY: bounceAnim }] },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Sign Up</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.companyButton]}
            onPress={() => navigation.navigate('SignupCompany')}
          >
            <Text style={[styles.buttonText, styles.companyText]}>Register as a Company</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.userButton]}
            onPress={() => navigation.navigate('SignupUser')}
          >
            <Text style={[styles.buttonText, styles.userText]}>Register as a User</Text>
          </TouchableOpacity>
        </View>

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
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  companyButton: {
    backgroundColor: '#F6E05E',
  },
  userButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  companyText: {
    color: '#000',
  },
  userText: {
    color: '#3b82f6',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
