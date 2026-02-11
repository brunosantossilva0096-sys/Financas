
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, FinancialGoal, UserConfig, UserProfile, Category } from '../types';
import { useAuth } from './AuthContext';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', color: '#3b82f6' },
  { id: '2', name: 'Transporte', color: '#10b981' },
  { id: '3', name: 'Lazer', color: '#f59e0b' },
  { id: '4', name: 'Saúde', color: '#ef4444' },
  { id: '5', name: 'Educação', color: '#8b5cf6' },
  { id: '6', name: 'Moradia', color: '#ec4899' },
  { id: '7', name: 'Salário', color: '#059669' },
  { id: '8', name: 'Investimento', color: '#2563eb' },
  { id: '9', name: 'Outros', color: '#64748b' },
];

interface FinanceContextType {
  transactions: Transaction[];
  goals: FinancialGoal[];
  categories: Category[];
  userConfig: UserConfig;
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: FinancialGoal) => void;
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setUserConfig: (c: UserConfig) => void;
  isConfigured: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [userConfig, setUserConfigState] = useState<UserConfig>({
    name: '',
    profile: UserProfile.MODERATE,
    monthlyIncomeGoal: 0,
    currency: 'R$'
  });
  const [isConfigured, setIsConfigured] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      setCategories(DEFAULT_CATEGORIES);
      setIsConfigured(false);
      return;
    }

    const uid = user.id;
    const savedTransactions = localStorage.getItem(`${uid}_transactions`);
    const savedGoals = localStorage.getItem(`${uid}_goals`);
    const savedConfig = localStorage.getItem(`${uid}_userConfig`);
    const savedCategories = localStorage.getItem(`${uid}_categories`);

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    else setTransactions([]);

    if (savedGoals) setGoals(JSON.parse(savedGoals));
    else setGoals([]);

    if (savedCategories) setCategories(JSON.parse(savedCategories));
    else setCategories(DEFAULT_CATEGORIES);

    if (savedConfig) {
      setUserConfigState(JSON.parse(savedConfig));
      setIsConfigured(true);
    } else {
      setUserConfigState({ name: user.name, profile: UserProfile.MODERATE, monthlyIncomeGoal: 0, currency: 'R$' });
      setIsConfigured(false);
    }
  }, [user]);

  // Save data only if user is logged in
  useEffect(() => {
    if (user) localStorage.setItem(`${user.id}_transactions`, JSON.stringify(transactions));
  }, [transactions, user]);

  useEffect(() => {
    if (user) localStorage.setItem(`${user.id}_goals`, JSON.stringify(goals));
  }, [goals, user]);

  useEffect(() => {
    if (user) localStorage.setItem(`${user.id}_categories`, JSON.stringify(categories));
  }, [categories, user]);

  const setUserConfig = (config: UserConfig) => {
    if (!user) return;
    setUserConfigState(config);
    setIsConfigured(true);
    localStorage.setItem(`${user.id}_userConfig`, JSON.stringify(config));
  };

  const addTransaction = (t: Transaction) => setTransactions(prev => [...prev, t]);
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));
  
  const addGoal = (g: FinancialGoal) => setGoals(prev => [...prev, g]);
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));
  const updateGoal = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: amount } : g));
  };

  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  const deleteCategory = (id: string) => {
    if (categories.length <= 1) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      transactions, goals, userConfig, categories,
      addTransaction, deleteTransaction,
      addGoal, updateGoal, deleteGoal,
      addCategory, updateCategory, deleteCategory,
      setUserConfig, isConfigured
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
