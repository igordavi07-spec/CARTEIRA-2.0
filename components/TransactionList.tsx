import React, { useState } from 'react';
import { Transaction } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { TrashIcon } from './icons/TrashIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: () => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-brand-green' : 'text-brand-red';
  const sign = isIncome ? '+' : '-';

  return (
    <li className="flex items-center justify-between py-3">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-10 rounded-full ${isIncome ? 'bg-brand-green' : 'bg-brand-red'}`}></div>
        <div>
          <p className="font-semibold text-brand-text-primary">{transaction.name}</p>
          <p className="text-sm text-brand-text-secondary">{transaction.category} - {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className={`font-bold ${amountColor}`}>
          {sign} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <button onClick={onDelete} className="text-gray-400 dark:text-gray-500 hover:text-brand-red transition-colors">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};


const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTransactionToDelete(null);
  };

  return (
    <div className="bg-brand-surface p-6 rounded-xl shadow-md h-full transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4">Transações do Mês</h2>
      {transactions.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map(t => (
            <TransactionItem key={t.id} transaction={t} onDelete={() => handleDeleteClick(t)} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-brand-text-secondary py-8">Nenhuma transação este mês.</p>
      )}

      {transactionToDelete && (
        <ConfirmationModal
          title="Excluir Transação"
          message={`Tem certeza que deseja excluir a transação "${transactionToDelete.name}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TransactionList;