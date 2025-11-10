"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signin, signup, forgotPassword, verifyResetCode, User } from '@/services/clientApi';
import { checkLocalAdminCredentials, getLocalAdminUser, generateLocalAdminToken } from '@/services/localAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (resetCode: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  checkTokenValidity: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const currentUser = JSON.parse(userData);
        setUser(currentUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const result = !!(token && userData && user);
    return result;
  };

  const getIsAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return !!(token && userData && user);
  };

  const checkTokenValidity = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return !!(token && userData);
  };

  const login = async (email: string, password: string) => {
    try {
      // Check local admin credentials first (for local development)
      if (checkLocalAdminCredentials(email, password)) {
        console.log('AuthProvider: Using local admin credentials');
        const user = getLocalAdminUser();
        const token = generateLocalAdminToken();
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return;
      }
      
      // Use backend API for authentication
      const response = await signin({ email, password });
      
      // Handle different response structures
      let userData, authToken;
      
      if (response.status === 'success' && response.data) {
        userData = response.data.user || response.data;
        authToken = response.data.token || response.token;
      } else if (response.user && response.token) {
        userData = response.user;
        authToken = response.token;
      } else {
        throw new Error('Invalid response from server');
      }
      
      if (userData && authToken) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('AuthProvider: Login error:', error);
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    try {
      // Use backend API for registration
      const response = await signup({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        rePassword: userData.password,
        phone: userData.phone || ''
      });
      
      // Handle different response structures
      let registeredUser, authToken;
      
      if (response.status === 'success' && response.data) {
        registeredUser = response.data.user || response.data;
        authToken = response.data.token || response.token;
      } else if (response.user && response.token) {
        registeredUser = response.user;
        authToken = response.token;
      } else {
        throw new Error('Invalid response from server');
      }
      
      if (registeredUser && authToken) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(registeredUser));
        setUser(registeredUser);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('AuthProvider: Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyResetCode = async (resetCode: string) => {
    try {
      await verifyResetCode(resetCode);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      throw new Error('Reset password API not implemented yet');
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: getIsAuthenticated(),
      login,
      register,
      logout,
      forgotPassword: handleForgotPassword,
      verifyResetCode: handleVerifyResetCode,
      resetPassword,
      checkTokenValidity,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
