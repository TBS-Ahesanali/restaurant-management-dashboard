import React, { ReactNode } from 'react';

interface ModalProps {
  id: string;
  title: string;
  children: ReactNode; // Using `children` instead of `body`
  footer?: ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

const ModalComponent: React.FC<ModalProps> = ({ id, title, children, footer, size = 'lg' }) => {
  return (
    <div className='modal fade' id={id} tabIndex={-1} aria-hidden='true'>
      <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{title}</h5>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>{children}</div>
          {footer && <div className='modal-footer'>{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
