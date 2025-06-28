// mobile/context/UserContext.tsx

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export interface User {
    id: string | number;
    name: string;
    role: 'company' | 'company_user' | 'independent';
  }
  
  interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => Promise<void>;
  }
  
  const UserContext = createContext<UserContextProps | undefined>(undefined);
  
  export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    // Load user from AsyncStorage on app start
    useEffect(() => {
      (async () => {
        try {
          const json = await AsyncStorage.getItem('user');
          if (json) {
            setUserState(JSON.parse(json));
          }
        } catch (err) {
          console.error('Failed to load user from storage:', err);
        } finally {
          setLoading(false);
        }
      })();
    }, []);
  
    // Custom setUser that also saves to AsyncStorage
    const setUser = async (newUser: User | null) => {
      try {
        if (newUser) {
          await AsyncStorage.setItem('user', JSON.stringify(newUser));
        } else {
          await AsyncStorage.removeItem('user');
        }
        setUserState(newUser);
      } catch (err) {
        console.error('Failed to save user to storage:', err);
      }
    };
  
    // While loading, render nothing (or a splash)
    if (loading) {
      return null;
    }
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  };
  
  export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
  