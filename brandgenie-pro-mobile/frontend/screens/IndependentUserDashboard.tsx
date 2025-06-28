// mobile/screens/IndependentUserDashboard.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function IndependentUserDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Independent User Dashboard</Text>
      <Text style={styles.paragraph}>
        Manage your personal groups, tools, and work independently here.
      </Text>
      {/* TODO: Add personal tools, group management, etc. */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937', // gray-800
  },
  paragraph: {
    fontSize: 16,
    color: '#4b5563', // gray-700
  },
});
