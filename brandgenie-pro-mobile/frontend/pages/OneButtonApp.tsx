// brandgenie-pro-mobile/frontend/pages/OneButtonApp.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const OneButtonApp = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Please enter your name');
    try {
      const res = await axios.post(`${API_BASE_URL}/submit-name`, { name });
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>BrandGenie Pro</Text>

      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#ddd"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

export default OneButtonApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B21B6',
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
  input: {
    backgroundColor: '#7C3AED',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FACC15',
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
