
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Plus, Trash2, CheckCircle2, Calendar } from 'lucide-react';

export const Goals: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoal, userConfig } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    addGoal({
      id: crypto.randomUUID(),
      name,
      targetAmount: parseFloat(target),
      currentAmount: 0,
      deadline
    });
    setName('');
    setTarget('');
    setDeadline('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Minhas Metas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Goal Form - Left Side */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Target size={18} />
              </div>
              <h3 className="font-semibold text-slate-800">Nova Meta Financeira</h3>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">O que você quer conquistar?</label>
                <input 
                  type="text" 
                  placeholder="Ex: Viagem, Carro, Reserva"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Alvo ({userConfig.currency})</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium transition-all"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prazo Estimado (Opcional)</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium transition-all"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2">
                <Plus size={20} />
                <span>Criar Meta</span>
              </button>
            </form>
          </div>
        </div>

        {/* List of Goals - Right Side */}
        <div className="lg:col-span-2">
          {goals.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-600">Nenhuma meta ainda</h3>
              <p className="text-slate-400 max-w-xs mx-auto mt-2">Defina seus objetivos para que a SmartFinance ajude você a chegar lá.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map(goal => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Target size={20} />
                      </div>
                      <button 
                        onClick={() => deleteGoal(goal.id)} 
                        className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                        title="Excluir meta"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{goal.name}</h3>
                    <div className="flex items-center text-xs text-slate-400 mb-6 space-x-1">
                      <Calendar size={14} />
                      <span>Prazo: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Não definido'}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-black">{userConfig.currency} {goal.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className="text-slate-500">de {userConfig.currency} {goal.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-700 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center pt-4">
                        <div className="relative">
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">Já Poupado</label>
                          <input 
                            type="number" 
                            placeholder="Atualizar..."
                            className="w-28 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white font-medium"
                            defaultValue={goal.currentAmount}
                            onBlur={(e) => updateGoal(goal.id, parseFloat(e.target.value) || 0)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateGoal(goal.id, parseFloat((e.target as HTMLInputElement).value) || 0);
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                          />
                        </div>
                        <div className="text-right">
                           <span className={`text-sm font-black ${progress === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                             {progress.toFixed(0)}%
                           </span>
                        </div>
                      </div>
                    </div>

                    {progress === 100 && (
                      <div className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-300 z-10">
                        <CheckCircle2 size={48} className="mb-4 animate-bounce" />
                        <h4 className="text-xl font-bold">Meta Concluída!</h4>
                        <p className="text-center text-emerald-50 text-sm mt-2">Sensacional! Você atingiu seu objetivo financeiro.</p>
                        <button 
                          onClick={() => deleteGoal(goal.id)} 
                          className="mt-6 bg-white text-emerald-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-all shadow-lg"
                        >
                          Arquivar Meta
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
