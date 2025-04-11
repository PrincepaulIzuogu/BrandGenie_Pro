import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import OneButtonApp from './pages/OneButtonApp';

export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  Dashboard: undefined;
  OneButtonApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="OneButtonApp" component={OneButtonApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
