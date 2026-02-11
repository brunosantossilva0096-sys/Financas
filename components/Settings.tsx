
import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { 
  User, 
  CreditCard, 
  Tags, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Download, 
  Upload, 
  Database,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { 
    userConfig, 
    setUserConfig, 
    categories, 
    addCategory, 
    deleteCategory, 
    updateCategory,
    transactions,
    goals
  } = useFinance();

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  
  const [importError, setImportError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserConfig({ ...userConfig, profile: e.target.value as UserProfile });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserConfig({ ...userConfig, [name]: name === 'monthlyIncomeGoal' ? parseFloat(value) : value });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      id: crypto.randomUUID(),
      name: newCatName.trim(),
      color: newCatColor
    });
    setNewCatName('');
  };

  const startEditing = (id: string, name: string, color: string) => {
    setEditingId(id);
    setEditName(name);
    setEditColor(color);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateCategory(editingId, { name: editName.trim(), color: editColor });
      setEditingId(null);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // --- DATABASE / BACKUP LOGIC ---
  
  const exportDatabase = () => {
    if (!user) return;
    setIsProcessing(true);
    
    try {
      const backupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        userId: user.id,
        data: {
          transactions,
          goals,
          categories,
          userConfig
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `smartfinance_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast("Backup exportado com sucesso! Verifique sua pasta de downloads.");
    } catch (err) {
      setImportError("Erro ao exportar os dados.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const importDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsProcessing(true);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        if (!json.data || !json.data.transactions || !json.data.categories) {
          throw new Error("Arquivo de backup inválido.");
        }

        const uid = user.id;
        localStorage.setItem(`${uid}_transactions`, JSON.stringify(json.data.transactions));
        localStorage.setItem(`${uid}_goals`, JSON.stringify(json.data.goals || []));
        localStorage.setItem(`${uid}_categories`, JSON.stringify(json.data.categories));
        localStorage.setItem(`${uid}_userConfig`, JSON.stringify(json.data.userConfig));

        showToast("Backup importado com sucesso! Reiniciando o sistema em 2 segundos...");
        
        // Delay reload to allow user to see the success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (err) {
        setImportError("Erro ao importar: O arquivo não é um backup válido do SmartFinance.");
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setImportError("Erro na leitura do arquivo.");
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 relative">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-500/20 backdrop-blur-sm">
            <CheckCircle2 size={20} className="text-emerald-100" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-slate-800">Ajustes da Conta</h1>

      <div className="space-y-6">
        {/* Backup & Database Section */}
        <section className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Database size={80} />
          </div>
          
          <div className="flex items-center space-x-3 mb-6">
            <Database className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Gestão de Dados e Backup</h2>
          </div>
          
          <p className="text-sm text-slate-500 mb-6">
            Para garantir que você nunca perca seus dados (mesmo se limpar o navegador), 
            recomendamos exportar um backup regularmente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={exportDatabase}
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 bg-slate-800 text-white px-4 py-3 rounded-xl hover:bg-black transition-all shadow-md font-medium disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              <span>{isProcessing ? 'Processando...' : 'Exportar Banco de Dados'}</span>
            </button>
            
            <button 
              onClick={handleImportClick}
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 bg-white border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all font-medium disabled:opacity-50"
            >
              <Upload size={18} />
              <span>Importar Backup</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={importDatabase} 
            />
          </div>

          {importError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-2 text-rose-600 text-xs">
              <AlertCircle size={16} />
              <span>{importError}</span>
            </div>
          )}
        </section>

        {/* Profile Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <User className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Informações Pessoais</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Seu Nome</label>
              <input 
                type="text" 
                name="name"
                value={userConfig.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Perfil de Investidor/Gasto</label>
              <select 
                value={userConfig.profile}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black font-medium"
              >
                <option value={UserProfile.CONSERVATIVE}>Conservador (Foco em Poupar)</option>
                <option value={UserProfile.MODERATE}>Moderado (Equilíbrio)</option>
                <option value={UserProfile.AGGRESSIVE}>Agressivo (Foco em Crescimento)</option>
                <option value={UserProfile.STUDENT}>Estudante</option>
                <option value={UserProfile.FREELANCER}>Autônomo (Renda Variável)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Tags className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Categorias de Gastos</h2>
          </div>
          
          <div className="space-y-3 mb-6">
            {categories.map(cat => (
              <div key={cat.id} className="group flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                {editingId === cat.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="color" 
                      className="w-8 h-8 p-0.5 bg-white border rounded cursor-pointer"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-black font-semibold">{cat.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => startEditing(cat.id, cat.name, cat.color)}
                        className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteCategory(cat.id)}
                        disabled={categories.length <= 1}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <input 
              type="text" 
              placeholder="Nome da Nova Categoria"
              className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                className="w-10 h-10 p-1 bg-white border rounded-xl cursor-pointer"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
              />
              <button 
                type="submit"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 whitespace-nowrap"
              >
                <Plus size={20} />
                <span>Nova Categoria</span>
              </button>
            </div>
          </form>
        </section>

        {/* Financial Prefs */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Preferências Financeiras</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Moeda</label>
              <input 
                type="text" 
                name="currency"
                value={userConfig.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium"
                placeholder="R$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta de Renda Mensal</label>
              <input 
                type="number" 
                name="monthlyIncomeGoal"
                value={userConfig.monthlyIncomeGoal}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white font-medium"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
