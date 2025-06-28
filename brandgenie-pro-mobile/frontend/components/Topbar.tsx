// mobile/components/Topbar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';

export default function Topbar() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome, {user?.name ?? 'User'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937', // gray-800
  },
});
