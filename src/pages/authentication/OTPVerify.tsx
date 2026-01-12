import React, { useEffect, useRef, useState } from 'react';
// import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/Logo.svg';
import { SESSION_PATHS } from '../../routes/paths';
import { useFormik } from 'formik';
import useAuth from '../../hooks/useAuth';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import LoaderButton from '../../components/LoaderButton';

const initialValues = { otp: ['', '', '', ''] };

const validationSchema = Yup.object({
  otp: Yup.array().of(Yup.string().matches(/^\d$/, 'Each OTP digit must be a single number (0-9).').required('Required')).min(4, 'Please enter all 4 digits of the OTP.'),
});

const OTPVerify: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(intervalId);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      const newOtp = [...formik.values.otp];
      newOtp[index] = value;
      formik.setFieldValue('otp', newOtp);
      if (value && index < newOtp.length - 1) {
        document.getElementsByName(`otp${index + 2}`)[0].focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !formik.values.otp[index]) {
      if (index > 0) {
        document.getElementsByName(`otp${index}`)[0].focus();
      }
    }
  };

  const formik = useFormik({
    initialValues: { otp: initialValues.otp },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        email: localStorage.getItem('email'),
        otp: values.otp.join(''),
      };

      try {
        await verifyOtp(payload);
        enqueueSnackbar('OTP Verified Successfully', { variant: 'success' });
        navigate(SESSION_PATHS.RESET_PASSWORD);
      } catch (error) {
        enqueueSnackbar((error as { message?: string })?.message || 'An unexpected error occurred. Please try again.', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    if (canResend) {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          enqueueSnackbar('Email not found in local storage.', { variant: 'error' });
          return;
        }
        await resendOtp(email);
        enqueueSnackbar('OTP has been resent successfully. Please check your email.', { variant: 'success' });
        setTimer(60);
        setCanResend(false);
      } catch (error) {
        enqueueSnackbar((error as { message?: string })?.message || 'An unexpected error occurred. Please try again.', {
          variant: 'error',
        });
      }
    } else {
      enqueueSnackbar(`You can resend OTP in ${timer} seconds`, { variant: 'info' });
    }
  };

  return (
    <div className='auth-container d-flex align-items-center justify-content-center'>
      <div className='auth-card'>
        <div className='text-center'>
          <div className='w-100 d-flex justify-content-center mb-4 auth-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt='Website Logo' className='auth-logo' />
          </div>
          <h3 className='mb-2'>Enter OTP?</h3>
          <p className='text-muted mb-4'>We have sent an OTP to your email</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className='otp-input-group d-flex justify-content-center gap-2 mb-3'>
            {formik.values.otp.map((digit, index) => (
              <input
                key={index}
                type='text'
                id={`otp-${index}`}
                name={`otp${index + 1}`}
                className='otp-input form-control text-center'
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                placeholder='-'
                ref={(el) => (inputsRef.current[index] = el)}
                required
              />
            ))}
          </div>
          <LoaderButton type='submit' loading={loading} loadingText='Loading...' className='w-100 btn-loader-lg'>
            Verify OTP
          </LoaderButton>
        </form>

        <div className='resend-otp-link text-center mt-3'>
          <button className='btn btn-link' onClick={handleResendOtp} disabled={!canResend || timer > 0}>
            Resend OTP {timer > 0 && `(${timer}s)`}
          </button>
        </div>

        {/* <div className='signup-link text-center mt-3'>
          <Link to={'/login'}>Sign in</Link>
        </div> */}
      </div>
    </div>
  );
};

export default OTPVerify;
