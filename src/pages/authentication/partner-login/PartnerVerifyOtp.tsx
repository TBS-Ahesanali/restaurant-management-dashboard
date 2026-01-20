import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { PATHS, SESSION_PATHS } from '../../../routes/paths';
import { useNavigate } from 'react-router-dom';

interface PartnerVerifyOtpProps {
  email: string;
}

interface OtpResponse {
  data?: {
    tokens?: {
      access?: string;
    };
    user?: any;
    restaurant_status?: string;
    next_step?: number;
  };
  status?: number;
  otp?: boolean;
  message?: string;
}

const OTP_LENGTH = 6;
const RESEND_TIMER = 30; // 30 seconds

const PartnerVerifyOtp: React.FC<PartnerVerifyOtpProps> = ({ email }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp, resendOtp, fetchRestaurantData } = useAuth();

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

    try {
      const response = (await verifyOtp({ email, otp: finalOtp })) as OtpResponse;

      if (response.status === 200) {
        const token = response?.data?.tokens?.access;

        if (token) {
          const restaurantStatus = response?.data?.restaurant_status;
          await fetchRestaurantData(token);

          enqueueSnackbar(response?.message || 'OTP verified successfully', { variant: 'success' });

          // Navigate based on restaurant status with replace to prevent back navigation
          if (restaurantStatus === 'Draft') {
            navigate(SESSION_PATHS.RESTAURANT_INFORMATION, {
              state: { email, token },
              replace: true,
            });
          } else if (restaurantStatus === 'Pending') {
            navigate(SESSION_PATHS.RESTAURANT_PENDING, { replace: true });
          } else if (restaurantStatus === 'Complete' || restaurantStatus === 'Approved') {
            navigate(PATHS.DASHBOARD, { replace: true });
          } else {
            navigate(SESSION_PATHS.RESTAURANT_INFORMATION, {
              state: { email, token },
              replace: true,
            });
          }
        } else {
          enqueueSnackbar('Token not received. Please try again.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar(response?.message || 'Failed to verify OTP. Please try again.', { variant: 'error' });
      }
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'Invalid OTP. Please try again.', { variant: 'error' });
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);

    try {
      const response = (await resendOtp(email)) as OtpResponse;

      if (response.status === 200) {
        enqueueSnackbar(response?.message || 'OTP sent successfully', { variant: 'success' });
        setTimer(RESEND_TIMER);
        setCanResend(false);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        enqueueSnackbar(response?.message || 'Failed to resend OTP.', { variant: 'error' });
      }
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'Failed to resend OTP. Please try again.', { variant: 'error' });
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
