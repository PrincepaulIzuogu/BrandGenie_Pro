import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const words = ['Design.', 'Strategy.', 'Content.', 'AI.'];

const Home = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [showWord, setShowWord] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1000);

    const timeout = setTimeout(() => {
      setShowWord(false);
      // @ts-ignore
      navigation.navigate('OneButtonApp');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6', '#d946ef']} // indigo-500 to fuchsia-500
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require('../images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {showWord && <Text style={styles.word}>{words[currentWord]}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  word: {
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#FFD700',
    marginTop: 10,
  },
});

export default Home;
