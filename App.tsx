
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Goals } from './components/Goals';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isConfigured } = useFinance();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (!isConfigured) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FinanceProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </FinanceProvider>
    </AuthProvider>
  );
};

export default App;
