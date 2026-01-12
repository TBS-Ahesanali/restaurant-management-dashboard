import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';

interface PartnerVerifyOtpProps {
  email: string;
  onVerified: () => void;
}

interface OtpResponse {
  status?: number;
  otp?: boolean;
  message?: string;
}

const OTP_LENGTH = 6;
const RESEND_TIMER = 30; // 30 seconds

const PartnerVerifyOtp: React.FC<PartnerVerifyOtpProps> = ({ email, onVerified }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, resendOtp } = useAuth();

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setError(''); // Clear error on input

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  const handleSubmit = async () => {
    if (!isOtpComplete || isLoading) return;

    const finalOtp = otp.join('');
    setIsLoading(true);
    setError('');

    try {
      const response = (await verifyOtp({ email, otp: finalOtp })) as OtpResponse;
      console.log('response: ', response);
      if (response.status === 200) {
        enqueueSnackbar(response?.message || 'OTP sent successfully', { variant: 'success' });
        onVerified();
      } else {
        enqueueSnackbar(response?.message || 'Failed to send OTP. Please try again.', { variant: 'error' });
      }
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'Invalid OTP. Please try again.', { variant: 'error' });
      console.error('Registration error:', err);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = (await resendOtp(email)) as OtpResponse;
      console.log('response: ', response);
      if (response.status === 200) {
        enqueueSnackbar(response?.message || 'OTP sent successfully', { variant: 'success' });
        setTimer(RESEND_TIMER);
        setCanResend(false);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.message || 'Failed to resend OTP. Please try again.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='partner-otp-card'>
      <h4 className='partner-otp-title'>Enter OTP</h4>
      <p className='partner-otp-subtitle'>Enter OTP sent for Email: {email}</p>

      {error && (
        <div className='alert alert-danger small mb-3' role='alert'>
          {error}
        </div>
      )}

      <div className='partner-otp-inputs'>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className='partner-otp-input'
            inputMode='numeric'
            autoComplete='one-time-code'
            disabled={isLoading}
          />
        ))}
      </div>

      <p
        className={`partner-otp-resend ${canResend ? 'partner-otp-resend--active' : ''}`}
        onClick={handleResendOtp}
        style={{
          cursor: canResend && !isLoading ? 'pointer' : 'default',
          color: canResend && !isLoading ? '#007bff' : '#6c757d',
        }}
      >
        {canResend ? 'Resend OTP' : `Resend OTP (${formatTime(timer)})`}
      </p>

      <button
        type='button'
        onClick={handleSubmit}
        className={`partner-otp-btn ${isOtpComplete && !isLoading ? '' : 'partner-otp-btn--disabled'}`}
        disabled={!isOtpComplete || isLoading}
      >
        {isLoading ? 'Verifying...' : 'Continue'}
      </button>

      <p className='partner-otp-terms'>
        By logging in, I agree to Swiggy's{' '}
        <a href='#' className='partner-otp-link'>
          terms & conditions
        </a>
      </p>
    </div>
  );
};

export default PartnerVerifyOtp;
