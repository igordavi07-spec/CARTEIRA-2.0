export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

export type CategoryBudgets = {
  [category: string]: number;
};

export type Theme = 'blue' | 'green' | 'purple' | 'orange';

export type ColorScheme = 'light' | 'dark';
