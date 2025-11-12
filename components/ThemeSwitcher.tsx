import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onClose: () => void;
}

const themeOptions: { name: Theme; color: string; label: string }[] = [
  { name: 'blue', color: '#3B82F6', label: 'Azul Céu' },
  { name: 'green', color: '#10B981', label: 'Verde Esmeralda' },
  { name: 'purple', color: '#8B5CF6', label: 'Violeta Suave' },
  { name: 'orange', color: '#F97316', label: 'Laranja Fogo' },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={popoverRef} className="absolute top-14 right-0 mt-2 w-52 bg-brand-surface rounded-lg shadow-xl z-50 p-2 border border-brand-border transition-colors duration-300">
      <p className="text-sm font-semibold text-brand-text-primary px-2 py-1">Escolha um Tema</p>
      <div className="mt-2 space-y-1">
        {themeOptions.map(option => (
          <button
            key={option.name}
            onClick={() => {
              setTheme(option.name);
              onClose();
            }}
            className={`w-full text-left px-2 py-1.5 rounded-md flex items-center gap-3 text-sm transition-colors ${
              theme === option.name ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }}></span>
            <span className="text-brand-text-primary" style={{ color: theme === option.name ? option.color : 'var(--color-text-primary)'}}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;