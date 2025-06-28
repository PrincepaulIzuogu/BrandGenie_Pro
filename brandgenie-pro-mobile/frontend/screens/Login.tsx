// mobile/screens/Login.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png';

export default function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  const logoSize = width * 0.3;

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
            { width: logoSize, height: logoSize, transform: [{ translateY: bounceAnim }] },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Welcome to BrandGenie Pro</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.companyButton]}
            onPress={() => navigation.navigate('LoginCompany')}
          >
            <Text style={[styles.buttonText, styles.companyButtonText]}>Login as Company</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.userButton]}
            onPress={() => navigation.navigate('LoginUser')}
          >
            <Text style={[styles.buttonText, styles.userButtonText]}>Login as User</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Forgot your password?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Reset here
            </Text>
          </Text>
          <Text style={[styles.footerText, { marginTop: 8 }]}>
            New here?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Signup')}
            >
              Sign up
            </Text>
          </Text>
        </View>
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
    marginBottom: 12,
    alignItems: 'center',
  },
  companyButton: {
    backgroundColor: '#F6E05E', // yellow-400
  },
  userButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  companyButtonText: {
    color: '#000',
  },
  userButtonText: {
    color: '#3b82f6', // blue-500
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
