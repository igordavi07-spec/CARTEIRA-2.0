import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, ColorScheme } from '../types';

const SpendingPieChart: React.FC<{ data: { name: string; value: number }[]; colors: string[], textColor: string }> = ({ data, colors, textColor }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem' }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SpendingBarChart: React.FC<{ data: { name: string; Gastos: number }[]; primaryColor: string, gridColor: string, textColor: string }> = ({ data, primaryColor, gridColor, textColor }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor }} />
        <YAxis tickFormatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} tick={{ fill: textColor }} />
        <Tooltip 
          formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.75rem' }}
        />
        <Bar dataKey="Gastos" fill={primaryColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Charts: React.FC<{ transactions: Transaction[], primaryColor: string, colorScheme: ColorScheme }> = ({ transactions, primaryColor, colorScheme }) => {
  const expenses = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  const COLORS = useMemo(() => {
    // A modern, harmonious color palette for charts.
    const baseColors = ['#38BDF8', '#2DD4BF', '#FBBF24', '#F472B6', '#818CF8']; // sky-400, teal-400, amber-400, rose-400, indigo-400
    return [primaryColor, ...baseColors.filter(c => c.toLowerCase() !== primaryColor.toLowerCase())];
  }, [primaryColor]);

  const pieChartData = useMemo(() => {
    if (expenses.length === 0) return [];
    const spendingByCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const barChartData = useMemo(() => {
    if (expenses.length === 0) return [];
    const spendingByDay = expenses.reduce((acc, t) => {
      const day = new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
      acc[day] = (acc[day] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(spendingByDay).map(([name, Gastos]) => ({ name, Gastos })).sort((a,b) => a.name.localeCompare(b.name));

  }, [expenses]);
  
  const gridColor = colorScheme === 'dark' ? 'var(--color-border)' : 'var(--color-border)';
  const textColor = 'var(--color-text-secondary)';


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <div className="bg-brand-surface p-6 rounded-xl shadow-md transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4">Gastos por Categoria</h2>
        {pieChartData.length > 0 ? (
          <SpendingPieChart data={pieChartData} colors={COLORS} textColor={textColor} />
        ) : <p className="text-center text-brand-text-secondary py-8">Sem dados de gastos para exibir.</p>}
      </div>
      <div className="bg-brand-surface p-6 rounded-xl shadow-md transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4">Evolução dos Gastos</h2>
         {barChartData.length > 0 ? (
          <SpendingBarChart data={barChartData} primaryColor={primaryColor} gridColor={gridColor} textColor={textColor} />
        ) : <p className="text-center text-brand-text-secondary py-8">Sem dados de gastos para exibir.</p>}
      </div>
    </div>
  );
};

export default Charts;