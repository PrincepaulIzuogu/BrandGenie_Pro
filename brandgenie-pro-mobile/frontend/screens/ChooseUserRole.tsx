// mobile/screens/ChooseUserRole.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import logo from '../assets/logo.png';

// Define your app's root param list
import { RootStackParamList } from '../App';

export default function ChooseUserRole() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  // Bounce animation for the logo
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

  const handleRoleSelection = async (role: 'company' | 'independent') => {
    await AsyncStorage.setItem('userRole', role);
    setLoading(true);
    setTimeout(() => {
      // Use navigate for type safety
      if (role === 'company') {
        navigation.navigate('CompanyUserDashboard');
      } else {
        navigation.navigate('IndependentUserDashboard');
      }
    }, 1000);
  };

  const { width } = Dimensions.get('window');
  const styles = createStyles(width);

  return (
    <LinearGradient
      colors={['#1E3A8A', '#6B21A8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <BlurView intensity={50} tint="light" style={styles.card}>
        <Animated.Image
          source={logo}
          style={[styles.logo, { transform: [{ translateY: bounceAnim }] }]}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Choose how you want to continue</Text>

        {loading ? (
          <View style={styles.redirecting}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.redirectingText}>Redirecting…</Text>
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.companyButton]}
              onPress={() => handleRoleSelection('company')}
            >
              <Text style={[styles.buttonText, styles.companyText]}>
                Continue as Company User
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.userButton]}
              onPress={() => handleRoleSelection('independent')}
            >
              <Text style={[styles.buttonText, styles.userText]}>
                Continue as Independent User
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backText}>Not your account? Go back</Text>
        </TouchableOpacity>
      </BlurView>
    </LinearGradient>
  );
}

// Create styles using a width parameter
const createStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
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
    },
    logo: {
      width: width * 0.25,
      height: width * 0.25,
      marginBottom: 24,
    },
    heading: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 24,
    },
    buttonGroup: {
      width: '100%',
      marginBottom: 24,
    },
    button: {
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 16,
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
    companyText: {
      color: '#000',
    },
    userText: {
      color: '#3b82f6', // blue-500
    },
    redirecting: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    redirectingText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 12,
    },
    backText: {
      color: '#fff',
      textDecorationLine: 'underline',
      marginTop: 16,
    },
  });