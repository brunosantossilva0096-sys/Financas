
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export enum UserProfile {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
  STUDENT = 'STUDENT',
  FREELANCER = 'FREELANCER'
}

export interface UserConfig {
  name: string;
  profile: UserProfile;
  monthlyIncomeGoal: number;
  currency: string;
}

export interface AIInsight {
  title: string;
  message: string;
  type: 'tip' | 'warning' | 'prediction';
}
