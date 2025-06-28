// mobile/screens/Home.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../App';
import logo from '../assets/logo.png'; // make sure logo.png exists

const words = ['Design.', 'Strategy.', 'Content.', 'AI.'];

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentWord, setCurrentWord] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotate words + fade in
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Redirect to Login after 4s
    const redirect = setTimeout(() => {
      navigation.navigate('Login');
    }, 4000);

    // Float animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Trigger initial fade
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    return () => {
      clearInterval(wordInterval);
      clearTimeout(redirect);
    };
  }, [navigation, fadeAnim, floatAnim]);

  return (
    <LinearGradient
      colors={['#4f46e5', '#9333ea', '#ec4899']}
      style={styles.container}
    >
      <Animated.Image
        source={logo}
        style={[styles.logo, { transform: [{ translateY: floatAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.word, { opacity: fadeAnim }]}>   
        {words[currentWord]}
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.8,
    height: 200,
    marginBottom: 24,
  },
  word: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#fbbf24', // approximate yellow-300
    textAlign: 'center',
  },
});
