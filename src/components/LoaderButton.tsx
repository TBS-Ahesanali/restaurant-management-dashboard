// components/common/LoaderButton.tsx
import React, { forwardRef } from 'react';
import { Loader as SpinnerIcon } from 'lucide-react';

interface LoaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  spinnerSize?: number;
  children: React.ReactNode;
  loadingText?: string;
}

const LoaderButton = forwardRef<HTMLButtonElement, LoaderButtonProps>(
  ({ loading = false, spinnerSize = 18, children, className = '', loadingText = 'Loading...', disabled, ...props }, ref) => {
    return (
      <button ref={ref} className={`btn-loader d-flex align-items-center justify-content-center gap-2 ${className}`} disabled={loading || disabled} {...props}>
        {loading && <SpinnerIcon size={spinnerSize} className='spin-icon' />}
        {loading ? loadingText : children}
      </button>
    );
  }
);

export default LoaderButton;
