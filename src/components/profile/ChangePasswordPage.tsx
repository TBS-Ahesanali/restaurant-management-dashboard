import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { useSnackbar } from 'notistack';
import { changeUserPassword } from '../../redux/slices/userProfileSlice';
import { PATHS } from '../../routes/paths';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validationSchema = Yup.object({
    old_password: Yup.string().required('Old password is required'),
    new_password: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('new_password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await dispatch(
          changeUserPassword({
            old_password: values.old_password,
            new_password: values.new_password,
            confirm_password: values.confirm_password,
          })
        );

        console.log('response: ', response);
        if (response) {
          if (response.status === 200) {
            enqueueSnackbar(response.message || 'Password changed successfully', {
              variant: 'success',
            });
            resetForm();
            navigate(PATHS.DASHBOARD);
          } else if (response.status === 403) {
            enqueueSnackbar(response.message || 'Incorrect current password', {
              variant: 'error',
            });
          } else {
            enqueueSnackbar(response.message || 'Failed to change password', {
              variant: 'error',
            });
          }
        }
      } catch (error) {
        enqueueSnackbar('An unexpected error occurred', {
          variant: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrent((prev) => !prev);
        break;
      case 'new':
        setShowNew((prev) => !prev);
        break;
      case 'confirm':
        setShowConfirm((prev) => !prev);
        break;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-8'>
        <div className='mb-8'>
          <div className='flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4'>
            <Lock className='w-6 h-6 text-blue-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 text-center'>Change Password</h2>
          <p className='mt-2 text-sm text-gray-600 text-center'>Ensure your account is using a strong password to stay secure</p>
        </div>

        <form onSubmit={formik.handleSubmit} className='space-y-6'>
          {/* Current Password */}
          <div>
            <label htmlFor='old_password' className='block text-sm font-medium text-gray-700 mb-2'>
              Current Password
            </label>
            <div className='relative'>
              <input
                id='old_password'
                name='old_password'
                type={showCurrent ? 'text' : 'password'}
                value={formik.values.old_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              <button type='button' onClick={() => togglePasswordVisibility('current')} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                {showCurrent ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
              </button>
            </div>
            {formik.touched.old_password && formik.errors.old_password && <p className='mt-2 text-sm text-red-600'>{formik.errors.old_password}</p>}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor='new_password' className='block text-sm font-medium text-gray-700 mb-2'>
              New Password
            </label>
            <div className='relative'>
              <input
                id='new_password'
                name='new_password'
                type={showNew ? 'text' : 'password'}
                value={formik.values.new_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              <button type='button' onClick={() => togglePasswordVisibility('new')} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                {showNew ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
              </button>
            </div>
            {formik.touched.new_password && formik.errors.new_password && <p className='mt-2 text-sm text-red-600'>{formik.errors.new_password}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor='confirm_password' className='block text-sm font-medium text-gray-700 mb-2'>
              Confirm New Password
            </label>
            <div className='relative'>
              <input
                id='confirm_password'
                name='confirm_password'
                type={showConfirm ? 'text' : 'password'}
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              <button type='button' onClick={() => togglePasswordVisibility('confirm')} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                {showConfirm ? <EyeOff className='h-5 w-5 text-gray-400' /> : <Eye className='h-5 w-5 text-gray-400' />}
              </button>
            </div>
            {formik.touched.confirm_password && formik.errors.confirm_password && <p className='mt-2 text-sm text-red-600'>{formik.errors.confirm_password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={formik.isSubmitting || !formik.isValid}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {formik.isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
