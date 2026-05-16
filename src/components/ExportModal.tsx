import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconLoader2, IconFileDescription } from '@tabler/icons-react';

interface ExportModalProps {
  onConfirm: (name: string) => Promise<void>;
  onCancel: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onConfirm, onCancel }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGenerating) onCancel();
      if (e.key === 'Enter' && !isGenerating && name.trim()) handleConfirm();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel, isGenerating, name]);

  const handleConfirm = async () => {
    const validName = name.trim() || 'Fan';
    setIsGenerating(true);
    try {
      await onConfirm(validName);
    } finally {
      setIsGenerating(false);
    }
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="dialog-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isGenerating) onCancel(); }}>
      <div className="dialog-content">
        <div className="dialog-icon dialog-icon--primary">
          <IconFileDescription size={32} stroke={1.5} />
        </div>
        <h3 className="dialog-title">Експорт результатів</h3>
        <p className="dialog-desc">Введіть ваше ім'я, щоб додати його до заголовка PDF файлу.</p>
        <input
          type="text"
          className="dialog-input"
          placeholder="Ваше ім'я..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoFocus
          disabled={isGenerating}
        />
        <div className="dialog-actions">
          <button className="dialog-btn dialog-btn--cancel" onClick={onCancel} disabled={isGenerating}>
            Скасувати
          </button>
          <button className="dialog-btn dialog-btn--primary" onClick={handleConfirm} disabled={isGenerating}>
            {isGenerating ? <IconLoader2 className="animate-spin" size={18} /> : 'Завантажити PDF'}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};