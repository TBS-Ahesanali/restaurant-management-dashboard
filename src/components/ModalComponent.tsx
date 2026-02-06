import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalComponentProps {
  id: string;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ id, title, size = 'md', children, isOpen = false, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        setIsActive(true); // 👈 OPEN animation starts here
      }, 10);
    } else {
      setIsActive(false); // 👈 CLOSE animation

      setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isActive ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${sizeClasses[size]} mx-4
          transform transition-all duration-300 ease-out
          ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        `}
      >
        <div className='bg-white rounded-2xl shadow-2xl rounded-2xl overflow-hidden'>
          {/* HEADER */}
          <div className='flex items-center justify-between px-6 py-4 border-b'>
            <h3 className='text-xl font-semibold'>{title}</h3>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* BODY */}
          <div className='px-6 py-4 overflow-y-auto' style={{ maxHeight: '70vh' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
