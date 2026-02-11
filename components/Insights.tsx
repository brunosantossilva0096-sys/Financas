
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getFinancialInsights } from '../services/geminiService';
import { AIInsight } from '../types';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp, RefreshCcw } from 'lucide-react';

export const Insights: React.FC = () => {
  const { transactions, userConfig, goals } = useFinance();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const data = await getFinancialInsights(transactions, userConfig, goals);
    setInsights(data);
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0) {
      fetchInsights();
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="text-amber-500" />;
      case 'warning': return <AlertTriangle className="text-rose-500" />;
      case 'prediction': return <TrendingUp className="text-blue-500" />;
      default: return <Sparkles className="text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Insights Inteligentes <Sparkles className="text-blue-600" />
          </h1>
          <p className="text-slate-500 text-sm">Análise baseada em IA para o seu perfil: {userConfig.profile}</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Atualizar Análise</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
              <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4" />
              <div className="h-6 bg-slate-100 rounded-md w-3/4 mb-2" />
              <div className="h-4 bg-slate-100 rounded-md w-full mb-1" />
              <div className="h-4 bg-slate-100 rounded-md w-2/3" />
            </div>
          ))
        ) : insights.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sem dados suficientes</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Adicione algumas transações para que a IA possa analisar seu comportamento financeiro.</p>
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${
                  insight.type === 'tip' ? 'bg-amber-50' : 
                  insight.type === 'warning' ? 'bg-rose-50' : 'bg-blue-50'
                }`}>
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{insight.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{insight.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && insights.length > 0 && (
        <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-2">Acelerador de Metas 🚀</h2>
              <p className="text-blue-100">Com base nos seus gastos com <strong>{transactions[0]?.category || 'Geral'}</strong>, se você economizar 15%, poderá atingir sua meta mais próxima {goals[0] ? `"${goals[0].name}"` : ''} 2 meses antes do previsto!</p>
            </div>
            <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
              Ver Plano Detalhado
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      )}
    </div>
  );
};
