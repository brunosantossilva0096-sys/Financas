
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType } from '../types';
import { Plus, Trash2, Search, Calendar as CalendarIcon } from 'lucide-react';

export const Transactions: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, userConfig, categories } = useFinance();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const selectedDate = new Date(date + 'T12:00:00Z');

    addTransaction({
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: selectedDate.toISOString()
    });

    setDescription('');
    setAmount('');
  };

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar transações..."
            className="pl-10 pr-4 py-2 border rounded-xl w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-black bg-white font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
            <h3 className="font-semibold text-slate-800 mb-6">Nova Entrada/Saída</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Receita
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black bg-white font-medium"
                  placeholder="Ex: Aluguel, Supermercado..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor ({userConfig.currency})</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black bg-white font-medium"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-black font-medium"
                >
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2">
                <Plus size={20} />
                <span>Adicionar Registro</span>
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Data & Descrição</th>
                    <th className="px-6 py-4 font-semibold">Categoria</th>
                    <th className="px-6 py-4 font-semibold">Valor</th>
                    <th className="px-6 py-4 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Sem transações encontradas.</td>
                    </tr>
                  ) : (
                    filtered.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3 text-black">
                            <div className="hidden sm:block text-center min-w-[50px]">
                              <p className="text-xs font-bold text-blue-600 uppercase">
                                {new Date(t.date).toLocaleDateString('pt-BR', { month: 'short' })}
                              </p>
                              <p className="text-lg font-bold">
                                {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit' })}
                              </p>
                            </div>
                            <div className="border-l sm:pl-3 border-slate-200">
                              <p className="font-semibold">{t.description}</p>
                              <p className="text-xs text-slate-400 sm:hidden">{new Date(t.date).toLocaleDateString()}</p>
                              <p className="text-xs text-slate-400 hidden sm:block">{new Date(t.date).getFullYear()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-black border border-slate-200">
                            {t.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-black'}`}>
                            {t.type === TransactionType.INCOME ? '+' : '-'} {userConfig.currency} {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                            title="Excluir transação"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
