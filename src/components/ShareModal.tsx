import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconShare, IconCopy, IconCheck } from '@tabler/icons-react';

interface ShareModalProps {
  onGenerate: (name: string) => string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onGenerate, onClose }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && !link && name.trim()) handleGenerate();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, link, name]);

  const handleGenerate = () => {
    const validName = name.trim() || 'Єврофан';
    const generatedLink = onGenerate(validName);
    setLink(generatedLink);
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Не вдалося скопіювати посилання', err);
    }
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="dialog-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog-content">
        <div className="dialog-icon dialog-icon--primary">
          <IconShare size={32} stroke={1.5} />
        </div>
        <h3 className="dialog-title">Поділитися результатами</h3>
        
        {!link ? (
          <>
            <p className="dialog-desc">Введіть ваше ім'я, щоб друзі знали, чий це рейтинг.</p>
            <input
              type="text"
              className="dialog-input"
              placeholder="Ваше ім'я..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              autoFocus
            />
            <div className="dialog-actions">
              <button className="dialog-btn dialog-btn--cancel" onClick={onClose}>
                Скасувати
              </button>
              <button 
                className="dialog-btn dialog-btn--primary" 
                onClick={handleGenerate}
                disabled={!name.trim()}
              >
                Згенерувати лінк
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="dialog-desc">Ваше посилання готове! Надішліть його друзям.</p>
            <div className="share-link-box">
              <input type="text" readOnly value={link} className="share-link-input" />
              <button 
                className={`share-link-btn ${copied ? 'share-link-btn--success' : ''}`} 
                onClick={handleCopy}
                aria-label="Скопіювати посилання"
              >
                {copied ? <IconCheck size={20} /> : <IconCopy size={20} />}
              </button>
            </div>
            <div className="dialog-actions" style={{ marginTop: '24px' }}>
              <button className="dialog-btn dialog-btn--primary" onClick={onClose}>
                Готово
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    modalRoot
  );
};