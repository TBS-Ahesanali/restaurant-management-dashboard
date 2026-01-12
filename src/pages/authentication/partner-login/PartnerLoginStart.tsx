import React from 'react';

interface Props {
  email: string;
  setEmail: (value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  error?: string;
}

const PartnerLoginStart: React.FC<Props> = ({ email, setEmail, handleSubmit, isLoading = false, error = '' }) => {
  return (
    <div className='partner-login__card'>
      <h4 className='fw-bold mb-2'>Get Started</h4>
      <p className='text-muted mb-3 small'>Enter your email to continue</p>

      {error && (
        <div className='alert alert-danger small' role='alert'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type='email'
          className='form-control mb-3'
          placeholder='Enter your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type='submit' className='partner-login__btn' disabled={isLoading}>
          {isLoading ? 'Sending OTP...' : 'Continue'}
        </button>
      </form>
      <p className='text-muted mt-3 small text-center'>
        By logging in, I agree to Swiggy's{' '}
        <a href='#' className='text-decoration-underline'>
          terms & conditions
        </a>
      </p>
    </div>
  );
};

export default PartnerLoginStart;
