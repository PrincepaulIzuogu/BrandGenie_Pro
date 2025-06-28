// mobile/components/Layout.tsx

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <View style={styles.main}>
          {/* Topbar */}
          <Topbar />

          {/* Page Content */}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6', // match main background
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
