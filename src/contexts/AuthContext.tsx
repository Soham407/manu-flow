import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { hashPassword, verifyPassword } from '@/utils/password';
import bcryptjs from 'bcryptjs';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, superAdminPassword?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  canSeeHiddenTransactions: boolean;
  showPasswordChangeModal: boolean;
  setShowPasswordChangeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [canSeeHiddenTransactions, setCanSeeHiddenTransactions] = useState(() => {
    // Try to restore hidden transactions state from localStorage
    return localStorage.getItem('canSeeHiddenTransactions') === 'true';
  });

  // Save user and hidden transactions state to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    localStorage.setItem('canSeeHiddenTransactions', String(canSeeHiddenTransactions));
  }, [user, canSeeHiddenTransactions]);

  // Set loading to false after initial load
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check for super admin login
      if (email === 'admin@themediatree.co.in' && password === 'admin123') {
        const userData: User = {
          id: 'super-admin',
          email: 'admin@themediatree.co.in',
          name: 'Super Admin',
          role: 'super_admin' as const,
          roles: ['super_admin'],
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      // Normal user login
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${email},name.eq.${email}`)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user:', userError);
        return false;
      }

      if (!userData) {
        console.log('No user found with email:', email);
        return false;
      }

      if (!userData.is_active) {
        console.log('User account is inactive');
        return false;
      }

      // Verify password
      const isValid = await bcryptjs.compare(password, userData.password_hash);
      if (!isValid) {
        console.log('Invalid password');
        return false;
      }

      // Set user data
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        roles: [userData.role],
        isActive: userData.is_active,
        createdAt: userData.created_at || new Date().toISOString()
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Check if user needs to change password
      if (userData.needs_password_change) {
        setShowPasswordChangeModal(true);
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: User['role']): Promise<{ success: boolean; message: string }> => {
    try {
      // First, check if trying to create admin or superadmin
      if (role === 'admin' || role === 'super_admin') {
        // Only allow if current user is superadmin
        if (!user || user.role !== 'super_admin') {
          return { 
            success: false, 
            message: 'Only superadmin users can create admin or superadmin accounts.' 
          };
        }
      }

      // Check if email already exists using auth API
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUserError) {
        console.error('Error checking existing user:', existingUserError);
        return { success: false, message: 'Error checking existing user.' };
      }

      if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Create new user in the database
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          role,
          password_hash: passwordHash,
          is_active: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return { success: false, message: 'Error creating user account.' };
      }

      if (!newUser) {
        return { success: false, message: 'Failed to create user account.' };
      }

      // Auto login after registration
      setUser(newUser);
      setCanSeeHiddenTransactions(false);
      
      return { success: true, message: 'Registration successful!' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'An error occurred during registration.' };
    }
  };

  const logout = () => {
    setUser(null);
    setCanSeeHiddenTransactions(false);
    // Clear localStorage on logout
    localStorage.removeItem('user');
    localStorage.removeItem('canSeeHiddenTransactions');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      canSeeHiddenTransactions,
      showPasswordChangeModal,
      setShowPasswordChangeModal
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
