import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const OneButtonApp = () => {
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setMessage('🚀 The team is currently working on interviews for the app.\nCome back in May!');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image
        source={require('../images/logo.png')} // Make sure this path is correct
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>BrandGenie Pro</Text>

      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.buttonText}>Click Me</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

export default OneButtonApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B21B6', // deep purple background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    height: 64,
    width: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FACC15', // yellow
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    paddingHorizontal: 12,
  },
});
