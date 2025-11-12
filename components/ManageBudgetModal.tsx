import React, { useState, useMemo } from 'react';
import { CategoryBudgets } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ManageBudgetModalProps {
  currentBudgets: CategoryBudgets;
  totalIncome: number;
  onSave: (newBudgets: CategoryBudgets) => void;
  onClose: () => void;
}

const ManageBudgetModal: React.FC<ManageBudgetModalProps> = ({ currentBudgets, totalIncome, onSave, onClose }) => {
  const [budgets, setBudgets] = useState(
     Object.entries(currentBudgets).map(([category, amount], index) => ({ id: index, category, amount: amount.toString() }))
  );
  const [nextId, setNextId] = useState(Object.keys(currentBudgets).length);

  const handleBudgetChange = (id: number, field: 'category' | 'amount', value: string) => {
    setBudgets(prev =>
      prev.map(budget => (budget.id === id ? { ...budget, [field]: value } : budget))
    );
  };

  const addCategory = () => {
    setBudgets(prev => [...prev, { id: nextId, category: '', amount: '' }]);
    setNextId(prev => prev + 1);
  };

  const removeCategory = (id: number) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  const handleSave = () => {
    const newBudgets: CategoryBudgets = {};
    let hasError = false;
    for (const budget of budgets) {
      if (budget.category && budget.amount) {
        const amount = parseFloat(budget.amount);
        if (!isNaN(amount) && amount >= 0) {
          newBudgets[budget.category] = amount;
        } else {
          hasError = true;
        }
      } else if (budget.category || budget.amount) {
        // Only trigger error for partially filled rows
        hasError = true;
      }
    }
    if (hasError) {
        alert('Por favor, preencha todos os campos corretamente. As categorias não podem estar em branco e os valores devem ser números válidos.');
        return;
    }
    onSave(newBudgets);
    onClose();
  };
  
  const totalAllocated = useMemo(() => {
    return budgets.reduce((sum, budget) => {
        const amount = parseFloat(budget.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0)
  }, [budgets]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-brand-surface p-8 rounded-xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gerenciar Orçamento por Categoria</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
            {budgets.map((budget, index) => (
                <div key={budget.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                        <label className={`block text-sm font-medium text-brand-text-secondary ${index > 0 ? 'sr-only' : ''}`}>Categoria</label>
                        <input 
                            type="text" 
                            value={budget.category} 
                            onChange={e => handleBudgetChange(budget.id, 'category', e.target.value)}
                            placeholder="Ex: Alimentação"
                            className="mt-1 block w-full border-gray-300 dark:border-brand-border dark:bg-gray-700 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2" 
                        />
                    </div>
                     <div className="col-span-5">
                        <label className={`block text-sm font-medium text-brand-text-secondary ${index > 0 ? 'sr-only' : ''}`}>Orçamento (R$)</label>
                        <input 
                            type="number"
                            value={budget.amount}
                            onChange={e => handleBudgetChange(budget.id, 'amount', e.target.value)}
                            placeholder="Ex: 500.00"
                            className="mt-1 block w-full border-gray-300 dark:border-brand-border dark:bg-gray-700 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2" 
                        />
                    </div>
                    <div className="col-span-1 pt-6">
                         <button onClick={() => removeCategory(budget.id)} className="text-gray-400 dark:text-gray-500 hover:text-brand-red transition-colors p-2">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
            <button onClick={addCategory} className="flex items-center gap-2 text-sm text-brand-primary font-semibold mt-2">
                <PlusIcon className="w-4 h-4" />
                Adicionar Categoria
            </button>
        </div>
        
        <div className="border-t border-brand-border pt-4 mt-6">
            <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total Alocado:</span>
                <span className={totalAllocated > totalIncome ? 'text-brand-red' : 'text-brand-text-primary'}>
                    {totalAllocated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>
             <div className="flex justify-between items-center text-sm text-brand-text-secondary">
                <span>Renda Mensal:</span>
                <span>
                    {totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-brand-text-primary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90">Salvar Orçamento</button>
        </div>
      </div>
    </div>
  );
};

export default ManageBudgetModal;