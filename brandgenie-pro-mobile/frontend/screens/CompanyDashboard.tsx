// mobile/screens/CompanyDashboard.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function CompanyDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Company Dashboard</Text>
      <Text style={styles.paragraph}>
        Welcome! Here you can manage your company, create groups, and view users and groups.
      </Text>
      {/* TODO: Add your company management components here */}
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
