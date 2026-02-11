
import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight,
  Plus,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TransactionType } from '../types';
import { Link } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC = () => {
  const { transactions, userConfig, goals } = useFinance();

  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Pie Chart Data preparation (Expenses by Category)
  const categoryData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], curr) => {
      const existing = acc.find(a => a.name === curr.category);
      if (existing) existing.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  // Area Chart Data (Recent Flow - last 10)
  const historyData = transactions.slice(-10).map(t => ({
    name: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    amount: t.type === TransactionType.INCOME ? t.amount : -t.amount
  }));

  // Bar Chart Data (Monthly Evolution)
  const monthlyStats = transactions.reduce((acc: any[], t) => {
    const date = new Date(t.date);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    
    let monthEntry = acc.find(m => m.name === monthYear);
    if (!monthEntry) {
      monthEntry = { 
        name: monthYear, 
        receitas: 0, 
        despesas: 0, 
        timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime() 
      };
      acc.push(monthEntry);
    }

    if (t.type === TransactionType.INCOME) {
      monthEntry.receitas += t.amount;
    } else {
      monthEntry.despesas += t.amount;
    }
    return acc;
  }, []).sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, {userConfig.name}! 👋</h1>
          <p className="text-slate-500 text-sm">Bem-vindo ao seu painel financeiro.</p>
        </div>
        <Link 
          to="/transactions" 
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-100"
        >
          <Plus size={20} />
          <span>Nova Transação</span>
        </Link>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Total</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-slate-800">{userConfig.currency} {balance.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entradas</span>
          </div>
          <h3 className="text-3xl font-bold text-emerald-600">{userConfig.currency} {totalIncome.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saídas</span>
          </div>
          <h3 className="text-3xl font-bold text-rose-600">{userConfig.currency} {totalExpense.toLocaleString()}</h3>
        </div>
      </div>

      {/* New: Monthly Evolution Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <BarChartIcon size={20} className="text-blue-600" />
          <h4 className="text-slate-800 font-semibold">Evolução Financeira Mensal</h4>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                tickFormatter={(value) => `${userConfig.currency} ${value}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${userConfig.currency} ${value.toLocaleString()}`, '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar 
                name="Receitas" 
                dataKey="receitas" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
              <Bar 
                name="Despesas" 
                dataKey="despesas" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Flow Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-800 font-semibold mb-6">Fluxo Recente</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-800 font-semibold mb-6">Gastos por Categoria</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-slate-500">{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{userConfig.currency} {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-slate-800 font-semibold">Últimas Atividades</h4>
          <Link to="/transactions" className="text-blue-600 text-sm hover:underline font-medium">Ver tudo</Link>
        </div>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-slate-400 py-8">Nenhuma transação registrada.</p>
          ) : (
            transactions.slice(-5).reverse().map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {t.type === TransactionType.INCOME ? <ArrowUpRight size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{t.description}</p>
                    <p className="text-xs text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} {userConfig.currency} {t.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
