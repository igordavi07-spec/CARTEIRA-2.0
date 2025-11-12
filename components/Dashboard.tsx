import React from 'react';

interface DashboardProps {
  balance: number;
  income: number;
  expenses: number;
  budget: number;
}

const StatCard: React.FC<{ title: string; amount: number; colorClass: string }> = ({ title, amount, colorClass }) => (
  <div className="bg-brand-surface p-6 rounded-xl shadow-md flex-1 transition-colors duration-300">
    <h3 className="text-sm font-medium text-brand-text-secondary">{title}</h3>
    <p className={`text-2xl font-bold ${colorClass}`}>
      {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </p>
  </div>
);

const BudgetTracker: React.FC<{ budget: number; expenses: number }> = ({ budget, expenses }) => {
  const percentage = budget > 0 ? Math.min((expenses / budget) * 100, 100) : 0;
  const progressColor = percentage > 80 ? 'bg-brand-red' : 'bg-brand-primary';

  return (
    <div className="bg-brand-surface p-6 rounded-xl shadow-md col-span-1 sm:col-span-2 lg:col-span-1 transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-brand-text-secondary">Orçamento Mensal</h3>
        <span className="text-sm font-semibold text-brand-text-primary">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
       <p className="text-xs text-brand-text-secondary mt-2">
        Utilizado: {expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de {budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ balance, income, expenses, budget }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Saldo Atual" amount={balance} colorClass="text-brand-text-primary" />
      <StatCard title="Entradas" amount={income} colorClass="text-brand-green" />
      <StatCard title="Saídas" amount={expenses} colorClass="text-brand-red" />
      <BudgetTracker budget={budget} expenses={expenses} />
    </div>
  );
};

export default Dashboard;