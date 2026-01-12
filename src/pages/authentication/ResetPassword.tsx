import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SESSION_PATHS } from '../../routes/paths';
import logo from '../../assets/icons/Logo.svg';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import useAuth from '../../hooks/useAuth';
import LoaderButton from '../../components/LoaderButton';

// Validation schema for form fields
const validationSchema = Yup.object().shape({
  password: Yup.string().required('New Password is required.').min(6, 'Password must be at least 6 characters.'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required.')
    .oneOf([Yup.ref('password')], 'Passwords must match.'),
});

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          email: localStorage.getItem('email'),
          new_password: values.password,
          confirm_password: values.confirmPassword,
        };
        await resetPassword(payload);
        enqueueSnackbar('Password reset successfully', { variant: 'success' });
        navigate(SESSION_PATHS.SIGNIN);
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
          <h2 className='mb-2'>Reset Password</h2>
          <p className='text-muted mb-4'>Enter your new password</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* New Password Field */}
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              New Password
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && <div className='text-danger mt-1'>{formik.errors.password}</div>}
          </div>

          {/* Confirm Password Field */}
          <div className='mb-3'>
            <label htmlFor='confirmPassword' className='form-label'>
              Confirm Password
            </label>
            <div className='input-group'>
              <span className='input-group-text'>
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className='form-control'
                id='confirmPassword'
                placeholder='Confirm new password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className='text-danger mt-1'>{formik.errors.confirmPassword}</div>}
          </div>

          <LoaderButton type='submit' loading={loading} loadingText='Loading...' className='w-100 btn-loader-lg'>
            Reset Password
          </LoaderButton>
        </form>

        <div className='signup-link'>
          Back to <Link to={SESSION_PATHS.SIGNIN}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
