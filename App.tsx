import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, CategoryBudgets, Theme, ColorScheme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import AddTransactionModal from './components/AddTransactionModal';
import ManageBudgetModal from './components/ManageBudgetModal';
import CategoryProgress from './components/CategoryProgress';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', [
    // Current Month
    { id: '1', name: 'Salário', category: 'Salário', amount: 6200, date: new Date().toISOString().slice(0, 10), type: 'income' },
    { id: '2', name: 'Aluguel', category: 'Moradia', amount: 1500, date: new Date(new Date().setDate(5)).toISOString().slice(0, 10), type: 'expense' },
    { id: '3', name: 'Supermercado', category: 'Alimentação', amount: 450, date: new Date(new Date().setDate(10)).toISOString().slice(0, 10), type: 'expense' },
    { id: '4', name: 'Internet', category: 'Contas', amount: 100, date: new Date(new Date().setDate(12)).toISOString().slice(0, 10), type: 'expense' },
    { id: '5', name: 'Restaurante', category: 'Lazer', amount: 120, date: new Date(new Date().setDate(15)).toISOString().slice(0, 10), type: 'expense' },
    // Previous Month
    { id: '6', name: 'Salário', category: 'Salário', amount: 6200, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10), type: 'income' },
    { id: '7', name: 'Aluguel', category: 'Moradia', amount: 1500, date: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(5)).toISOString().slice(0, 10), type: 'expense' },
    { id: '8', name: 'Viagem', category: 'Lazer', amount: 800, date: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(20)).toISOString().slice(0, 10), type: 'expense' },
    // Two Months Ago
    { id: '9', name: 'Salário', category: 'Salário', amount: 6000, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().slice(0, 10), type: 'income' },
    { id: '10', name: 'Presente', category: 'Outros', amount: 250, date: new Date(new Date(new Date().setMonth(new Date().getMonth() - 2)).setDate(18)).toISOString().slice(0, 10), type: 'expense' },
  ]);
  
  const [categoryBudgets, setCategoryBudgets] = useLocalStorage<CategoryBudgets>('categoryBudgets', {
    'Moradia': 1500,
    'Alimentação': 800,
    'Contas': 300,
    'Lazer': 400,
    'Transporte': 250,
    'Saúde': 200,
    'Outros': 300,
  });

  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'blue');
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>('colorScheme', 'light');
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  const themes = useMemo(() => ({
    blue: { primary: '#3B82F6' },
    green: { primary: '#10B981' },
    purple: { primary: '#8B5CF6' },
    orange: { primary: '#F97316' },
  }), []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', themes[theme].primary);
  }, [theme, themes]);

  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorScheme]);

  const handlePreviousMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const totalMonthlyBudget = useMemo(() => Object.values(categoryBudgets).reduce((sum, budget) => sum + budget, 0), [categoryBudgets]);

  const { totalIncome, totalExpenses } = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      // Adding 1 to getMonth() for user-facing month, but internally it's 0-11
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();
      return transactionMonth === selectedMonth && transactionYear === selectedYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { totalIncome, totalExpenses };
  }, [transactions, selectedDate]);

  const currentBalance = useMemo(() => {
    const endOfSelectedMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    
    const relevantTransactions = transactions.filter(t => new Date(t.date) <= endOfSelectedMonth);
    
    return relevantTransactions.reduce((balance, t) => {
        return t.type === 'income' ? balance + t.amount : balance - t.amount;
    }, 0);
  }, [transactions, selectedDate]);


  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() }]);
    // Set view to the month of the newly added transaction
    setSelectedDate(new Date(transaction.date));
    setIsAddTransactionModalOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const displayedTransactions = useMemo(() => {
     const selectedMonth = selectedDate.getMonth();
     const selectedYear = selectedDate.getFullYear();
     return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === selectedMonth && transactionDate.getFullYear() === selectedYear;
     }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedDate]);

  const primaryColor = themes[theme].primary;

  return (
    <div className="bg-brand-background min-h-screen font-sans text-brand-text-primary transition-colors duration-300">
      <Header 
        onAddTransaction={() => setIsAddTransactionModalOpen(true)} 
        onManageBudget={() => setIsBudgetModalOpen(true)}
        theme={theme}
        setTheme={setTheme}
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        selectedDate={selectedDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <Dashboard 
              balance={currentBalance}
              income={totalIncome}
              expenses={totalExpenses}
              budget={totalMonthlyBudget}
            />
            <CategoryProgress transactions={displayedTransactions} categoryBudgets={categoryBudgets} />
            <Charts transactions={displayedTransactions} primaryColor={primaryColor} colorScheme={colorScheme} />
          </div>
          <div className="lg:col-span-1">
            <TransactionList transactions={displayedTransactions} onDelete={deleteTransaction} />
          </div>
        </div>
      </main>
      {isAddTransactionModalOpen && (
        <AddTransactionModal 
          onClose={() => setIsAddTransactionModalOpen(false)} 
          onAdd={addTransaction} 
        />
      )}
      {isBudgetModalOpen && (
        <ManageBudgetModal
          currentBudgets={categoryBudgets}
          totalIncome={totalIncome}
          onSave={setCategoryBudgets}
          onClose={() => setIsBudgetModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;