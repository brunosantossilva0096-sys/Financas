
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { UserProfile } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { setUserConfig } = useFinance();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    profile: UserProfile.MODERATE,
    monthlyIncomeGoal: 0,
    currency: 'R$'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserConfig(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-blue-300/30" size={64} />
          <h2 className="text-2xl font-bold mb-2">Bem-vindo ao SmartFinance</h2>
          <p className="text-blue-100">Vamos personalizar sua experiência financeira inteligente.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
              <h3 className="text-xl font-bold text-slate-800">Como podemos te chamar?</h3>
              <input 
                autoFocus
                type="text" 
                placeholder="Seu nome"
                className="w-full px-4 py-3 border-2 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-0 outline-none text-lg text-black bg-white font-medium shadow-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => formData.name && setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-200"
              >
                <span>Continuar</span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
              <h3 className="text-xl font-bold text-slate-800 text-center">Qual o seu perfil financeiro?</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: UserProfile.CONSERVATIVE, label: 'Conservador', desc: 'Foco em poupar e segurança' },
                  { id: UserProfile.MODERATE, label: 'Moderado', desc: 'Equilíbrio entre lazer e metas' },
                  { id: UserProfile.AGGRESSIVE, label: 'Agressivo', desc: 'Foco em investimentos e risco' },
                  { id: UserProfile.STUDENT, label: 'Estudante', desc: 'Controlando os primeiros passos' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({...formData, profile: p.id})}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      formData.profile === p.id 
                        ? 'border-blue-600 bg-blue-50 shadow-sm' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <span className="block font-bold text-black">{p.label}</span>
                    <span className="text-sm text-slate-500">{p.desc}</span>
                  </button>
                ))}
              </div>
              <div className="pt-4 flex gap-4">
                 <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-slate-100 bg-white text-slate-500 font-bold py-3 rounded-2xl hover:bg-slate-50"
                >
                  Voltar
                </button>
                <button 
                  type="submit"
                  className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-blue-200"
                >
                  Finalizar Setup
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
