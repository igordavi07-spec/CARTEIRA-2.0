import React, { useMemo } from 'react';
import { Transaction, CategoryBudgets } from '../types';

interface CategoryProgressProps {
  transactions: Transaction[];
  categoryBudgets: CategoryBudgets;
}

const CategoryProgressBar: React.FC<{ category: string; spent: number; budget: number; }> = ({ category, spent, budget }) => {
    const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
    const progressColor = percentage > 90 ? 'bg-brand-red' : percentage > 70 ? 'bg-yellow-500' : 'bg-brand-primary';
    const remaining = budget - spent;

    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-semibold text-brand-text-primary">{category}</span>
                <span className="text-brand-text-secondary">
                    {spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-right text-brand-text-secondary">
                Restante: {remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
    );
}

const CategoryProgress: React.FC<CategoryProgressProps> = ({ transactions, categoryBudgets }) => {
  const expensesByCategory = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });
  }, [transactions]);

  const sortedBudgetCategories = useMemo(() => {
    return Object.keys(categoryBudgets).sort();
  }, [categoryBudgets]);

  return (
    <div className="bg-brand-surface p-6 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4">Acompanhamento por Categoria</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {sortedBudgetCategories.map(category => (
          <CategoryProgressBar 
            key={category}
            category={category}
            spent={expensesByCategory[category] || 0}
            budget={categoryBudgets[category]}
          />
        ))}
        {sortedBudgetCategories.length === 0 && (
            <p className="text-center text-brand-text-secondary py-8 col-span-full">Nenhuma categoria de orçamento definida. Adicione categorias em "Gerenciar Orçamento".</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProgress;