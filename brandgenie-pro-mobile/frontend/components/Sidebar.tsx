// mobile/components/Sidebar.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { Feather } from '@expo/vector-icons';

interface NavLink {
  label: string;
  target: string;
  icon: React.ComponentProps<typeof Feather>['name'];
}

export default function Sidebar() {
  const { user, setUser } = useUser();
  const navigation: any = useNavigation();
  const [collapsed, setCollapsed] = useState(true);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      navigation.navigate('Login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const links: NavLink[] = [];
  if (user.role === 'company') {
    links.push(
      { label: 'Create Group', target: 'CreateGroup', icon: 'plus-square' },
      { label: 'View Users', target: 'ViewUsers', icon: 'users' },
      { label: 'View Groups', target: 'ViewGroups', icon: 'folder' }
    );
  } else if (user.role === 'company_user') {
    links.push({ label: 'My Groups', target: 'CompanyUserDashboard', icon: 'folder' });
  } else if (user.role === 'independent') {
    links.push(
      { label: 'My Groups', target: 'IndependentUserDashboard', icon: 'folder' },
      { label: 'My Tools', target: 'MyTools', icon: 'tool' }
    );
  }

  return (
    <View style={[styles.container, collapsed ? styles.collapsed : styles.expanded]}>
      <TouchableOpacity style={styles.toggle} onPress={() => setCollapsed(!collapsed)}>
        <Feather name={collapsed ? 'chevron-right' : 'chevron-left'} size={24} color="#fff" />
      </TouchableOpacity>
      <ScrollView style={styles.links}>
        {links.map(link => (
          <TouchableOpacity
            key={link.target}
            style={styles.linkContainer}
            onPress={() => navigation.navigate(link.target)}
          >
            <Feather name={link.icon} size={20} color="#fff" />
            {!collapsed && <Text style={styles.linkText}>{link.label}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#fff" />
        {!collapsed && <Text style={styles.logoutText}>Logout</Text>}
      </TouchableOpacity>
    </View>
  );
}

const sidebarWidth = 60;
const sidebarExpanded = 180;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  collapsed: {
    width: sidebarWidth,
  },
  expanded: {
    width: sidebarExpanded,
  },
  toggle: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  links: {
    flex: 1,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginVertical: 4,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: '#d9534f',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
  },
});
