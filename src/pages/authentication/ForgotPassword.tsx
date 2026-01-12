import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SESSION_PATHS } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/icons/Logo.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import LoaderButton from '../../components/LoaderButton';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await forgotPassword(values.email.trim());
        localStorage.setItem('email', values.email);
        enqueueSnackbar('Password reset OTP sent to your email.', { variant: 'success' });
        navigate(SESSION_PATHS.VERIFY_OTP);
      } catch (error) {
        const errorMessage = (error as { message?: string })?.message || 'An unexpected error occurred. Please try again.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className='auth-container d-flex align-items-center justify-content-center'>
      <div className='auth-card'>
        <div className='text-center'>
          <div className='w-100 d-flex justify-content-center mb-4 auth-logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt='Website Logo' className='auth-logo' />
          </div>
          <h2 className='mb-2'>Forgot Password?</h2>
          <p className='text-muted mb-4'>Enter your email to reset your password</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <Mail size={18} />
              </span>
              <input
                type='email'
                className='form-control'
                id='email'
                placeholder='Enter your email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && <div className='text-danger mt-1'>{formik.errors.email}</div>}
          </div>

          <LoaderButton type='submit' loading={loading} loadingText='Loading...' className='w-100 btn-loader-lg'>
            Send Reset Link
          </LoaderButton>
        </form>

        <div className='signup-link'>
          Remembered your password? <Link to={SESSION_PATHS.SIGNIN}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
