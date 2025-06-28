// mobile/App.tsx

import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';

// Export navigation types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  LoginCompany: undefined;
  LoginUser: undefined;
  Signup: undefined;
  SignupCompany: undefined;
  SignupUser: undefined;
  VerifyEmail: undefined;
  VerifyEmailCompany: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  ChooseUserRole: undefined;
  CompanyDashboard: undefined;
  CompanyUserDashboard: undefined;
  IndependentUserDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screens
import Home from './screens/Home';
import Login from './screens/Login';
import LoginCompany from './screens/LoginCompany';
import LoginUser from './screens/LoginUser';
import Signup from './screens/Signup';
import SignupCompany from './screens/SignupCompany';
import SignupUser from './screens/SignupUser';
import VerifyEmail from './screens/VerifyEmail';
import VerifyEmailCompany from './screens/VerifyEmailCompany';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import ChooseUserRole from './screens/ChooseUserRole';
import CompanyDashboard from './screens/CompanyDashboard';
import CompanyUserDashboard from './screens/CompanyUserDashboard';
import IndependentUserDashboard from './screens/IndependentUserDashboard';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          {/* Public screens */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="LoginCompany" component={LoginCompany} />
          <Stack.Screen name="LoginUser" component={LoginUser} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="SignupCompany" component={SignupCompany} />
          <Stack.Screen name="SignupUser" component={SignupUser} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
          <Stack.Screen name="VerifyEmailCompany" component={VerifyEmailCompany} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="ChooseUserRole" component={ChooseUserRole} />

          {/* Dashboard screens wrapped in Layout */}
          <Stack.Screen name="CompanyDashboard">
            {() => (
              <Layout>
                <CompanyDashboard />
              </Layout>
            )}
          </Stack.Screen>
          <Stack.Screen name="CompanyUserDashboard">
            {() => (
              <Layout>
                <CompanyUserDashboard />
              </Layout>
            )}
          </Stack.Screen>
          <Stack.Screen name="IndependentUserDashboard">
            {() => (
              <Layout>
                <IndependentUserDashboard />
              </Layout>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
