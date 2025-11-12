import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-brand-surface p-6 rounded-xl shadow-2xl w-full max-w-sm m-4 transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-brand-text-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-brand-text-primary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;