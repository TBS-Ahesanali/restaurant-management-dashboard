import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PartnerLoginStart from './PartnerLoginStart';
import PartnerVerifyOtp from './PartnerVerifyOtp';
import { SESSION_PATHS } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';

interface RegisterResponse {
  status?: number;
  otp?: boolean;
  message?: string;
}

const PartnerLoginPage: React.FC = () => {
  const { registerRestaurant } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'start' | 'otp'>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the registration API to send OTP to email
      const response = (await registerRestaurant(email)) as RegisterResponse;
      if (response.status === 200) {
        enqueueSnackbar(response?.message || 'OTP sent successfully', { variant: 'success' });
        setStep('otp');
      }
    } catch (err: any) {
      enqueueSnackbar(err.response?.message || 'Failed to send OTP. Please try again.', { variant: 'error' });
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = () => {
    navigate(SESSION_PATHS.RESTAURANT_INFORMATION);
  };

  return (
    <div className='auth-container d-flex align-items-center justify-content-center'>
      <div className='partner-login'>
        <div className='partner-login__overlay' />
        <div className='partner-login__container'>
          {/* Left Section */}
          <div className='partner-login__left'>
            <p className='partner-login__tagline-sub'>PARTNER WITH SWIGGY</p>
            <h1 className='partner-login__tagline-main'>Increase your online orders</h1>
          </div>

          {/* Right Section */}
          <div className='partner-login__right'>
            {step === 'start' && <PartnerLoginStart email={email} setEmail={setEmail} handleSubmit={handleSubmit} isLoading={isLoading} error={error} />}
            {step === 'otp' && (
              <PartnerVerifyOtp
                email={email}
                onVerified={handleOtpVerified}
                // onBack={() => setStep('start')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginPage;
