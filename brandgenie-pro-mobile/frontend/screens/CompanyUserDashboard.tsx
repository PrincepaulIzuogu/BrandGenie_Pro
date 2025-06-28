// mobile/screens/CompanyUserDashboard.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function CompanyUserDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Company User Dashboard</Text>
      <Text style={styles.paragraph}>
        Manage your assigned groups and collaborate with your team here.
      </Text>
      {/* TODO: Add group list, collaboration tools, etc. */}
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
