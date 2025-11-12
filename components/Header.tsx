import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { CogIcon } from './icons/CogIcon';
import { PaletteIcon } from './icons/PaletteIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import ThemeSwitcher from './ThemeSwitcher';
import { Theme, ColorScheme } from '../types';

interface HeaderProps {
  onAddTransaction: () => void;
  onManageBudget: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddTransaction, 
  onManageBudget, 
  theme, 
  setTheme, 
  colorScheme, 
  setColorScheme,
  selectedDate,
  onPreviousMonth,
  onNextMonth
}) => {
  const [isThemeSwitcherOpen, setIsThemeSwitcherOpen] = useState(false);
  
  const formattedDate = selectedDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="bg-brand-surface shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-brand-text-primary">
              Carteira
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onPreviousMonth} aria-label="Mês anterior" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg w-36 text-center capitalize">{formattedDate}</span>
            <button onClick={onNextMonth} aria-label="Próximo mês" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 relative">
             <button
              onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
              className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 text-brand-text-secondary rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              aria-label="Alternar modo claro/escuro"
            >
              {colorScheme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsThemeSwitcherOpen(prev => !prev)}
              className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 text-brand-text-secondary rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              aria-label="Personalizar cor da carteira"
            >
              <PaletteIcon className="w-5 h-5" />
            </button>
            
            {isThemeSwitcherOpen && (
              <ThemeSwitcher theme={theme} setTheme={setTheme} onClose={() => setIsThemeSwitcherOpen(false)} />
            )}

            <button
              onClick={onManageBudget}
              className="hidden md:flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-brand-text-secondary rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              aria-label="Gerenciar Orçamento"
            >
              <CogIcon className="w-5 h-5" />
              <span className="hidden sm:block">Orçamento</span>
            </button>
            <button
              onClick={onAddTransaction}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:block">Transação</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;