import React, { useState } from 'react';
import { Transaction } from '../types';
import { XIcon } from './icons/XIcon';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category || !date) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onAdd({
      name,
      amount: parseFloat(amount),
      category,
      date,
      type,
    });
  };
  
  const defaultCategories = type === 'expense' ? 
    ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Contas', 'Outros'] :
    ['Salário', 'Freelance', 'Investimentos', 'Outros'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-brand-surface p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Adicionar Transação</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Tipo</label>
            <div className="flex gap-4 mt-1">
              <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-md transition-colors ${type === 'expense' ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Despesa</button>
              <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-md transition-colors ${type === 'income' ? 'bg-brand-green text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Receita</button>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary">Nome</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-brand-border dark:bg-gray-700 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2" />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-brand-text-secondary">Valor</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-brand-border dark:bg-gray-700 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-brand-text-secondary">Categoria</label>
            <input list="categories" id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-brand-border dark:bg-gray-700 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2" />
            <datalist id="categories">
                {defaultCategories.map(cat => <option key={cat} value={cat} />)}
            </datalist>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-brand-text-secondary">Data</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-brand-border dark:bg-gray-700 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-brand-text-primary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;