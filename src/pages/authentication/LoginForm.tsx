import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS, SESSION_PATHS } from '../../routes/paths';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import LoaderButton from '../../components/LoaderButton';
import logo from '../../assets/icons/Logo.svg';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    remember: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem('rememberEmail') || '',
      password: localStorage.getItem('rememberPassword') || '',
      remember: !!localStorage.getItem('rememberEmail'),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await login(values.email.trim(), values.password);

        if (values.remember) {
          localStorage.setItem('rememberEmail', values.email);
          localStorage.setItem('rememberPassword', values.password);
        } else {
          localStorage.removeItem('rememberEmail');
          localStorage.removeItem('rememberPassword');
        }

        enqueueSnackbar('Login successful', { variant: 'success' });
        navigate(PATHS.DASHBOARD);
      } catch (error) {
        enqueueSnackbar((error as { message?: string })?.message || 'An unexpected error occurred. Please try again.', {
          variant: 'error',
        });
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
          <h2 className='mb-2'>Welcome back</h2>
          <p className='text-muted mb-4'>Please enter your details to sign in</p>
        </div>

        <div className='social-buttons d-flex gap-3 mb-3'>
          <button className='social-btn'>
            <img src='https://www.google.com/favicon.ico' alt='Google' />
            Google
          </button>
          <button className='social-btn'>
            <img src='https://www.apple.com/favicon.ico' alt='Apple' />
            Apple
          </button>
        </div>

        <div className='divider'>
          <span>or</span>
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

          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className='form-control'
                id='password'
                placeholder='Enter new password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && <div className='text-danger mt-1'>{formik.errors.password}</div>}
          </div>

          <div className='remember-forgot'>
            <div className='form-check'>
              <input type='checkbox' className='form-check-input' id='rememberMe' name='remember' checked={formik.values.remember} onChange={formik.handleChange} />
              <label className='form-check-label' htmlFor='rememberMe'>
                Remember me
              </label>
            </div>
            <Link to={SESSION_PATHS.FORGOT_PASSWORD} className='text-primary text-decoration-none'>
              Forgot password?
            </Link>
          </div>

          <LoaderButton type='submit' loading={loading} loadingText='Loading...' className='w-100 btn-loader-lg'>
            Login
          </LoaderButton>
        </form>

        {/* <div className='signup-link'>
          Don't have an account? <Link to={SESSION_PATHS.SIGNUP}>Sign up</Link>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;
