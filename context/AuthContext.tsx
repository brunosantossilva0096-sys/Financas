
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('auth_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === pass);
    
    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      localStorage.setItem('auth_session', JSON.stringify(userWithoutPass));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (users.some(u => u.email === email)) return false;

    const newUser: User = { id: crypto.randomUUID(), name, email, password: pass };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
    
    // Log in immediately
    const { password, ...userWithoutPass } = newUser;
    setUser(userWithoutPass);
    localStorage.setItem('auth_session', JSON.stringify(userWithoutPass));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
