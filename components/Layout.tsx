
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, active }: any) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumo', to: '/' },
    { icon: ArrowLeftRight, label: 'Transações', to: '/transactions' },
    { icon: Target, label: 'Metas', to: '/goals' },
    { icon: Sparkles, label: 'IA Insights', to: '/insights' },
    { icon: Settings, label: 'Ajustes', to: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className="font-bold text-slate-800">SmartFinance</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">SmartFinance</span>
          </div>

          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
              />
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center space-x-3 px-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <UserIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
