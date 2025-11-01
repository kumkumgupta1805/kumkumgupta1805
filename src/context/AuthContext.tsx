/**
 * Authentication Context
 * Manages global auth state and persists session via AsyncStorage
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/firebaseConfig';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../utils/constants';

export type UserRole = 'patient' | 'doctor';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Firestore
  const loadUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email || '',
          role: data.role || 'patient',
          name: data.name || '',
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Persist user data to AsyncStorage
  const persistUserData = async (data: UserData | null) => {
    try {
      if (data) {
        await AsyncStorage.setItem(constants.storage.USER_DATA, JSON.stringify(data));
      } else {
        await AsyncStorage.removeItem(constants.storage.USER_DATA);
      }
    } catch (error) {
      console.error('Error persisting user data:', error);
    }
  };

  // Load persisted user data on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(constants.storage.USER_DATA);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };
    loadPersistedData();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const data = await loadUserData(firebaseUser.uid);
        setUserData(data);
        if (data) {
          await persistUserData(data);
        }
      } else {
        setUserData(null);
        await persistUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const data = await loadUserData(userCredential.user.uid);
      
      if (!data) {
        throw new Error('User data not found. Please contact support.');
      }
      
      setUserData(data);
      await persistUserData(data);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login. Please check your credentials.');
    }
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userDataDoc = {
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userDataDoc);
      
      const data = await loadUserData(userCredential.user.uid);
      if (data) {
        setUserData(data);
        await persistUserData(data);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  };

  const signout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      await persistUserData(null);
    } catch (error: any) {
      console.error('Signout error:', error);
      throw new Error(error.message || 'Failed to sign out.');
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    login,
    signup,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

