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
          }),
        );

        if (response?.status === 200) {
          enqueueSnackbar(response.message || 'Password changed successfully', {
            variant: 'success',
          });
          resetForm();
          navigate(PATHS.DASHBOARD);
        } else {
          enqueueSnackbar(response?.message || 'Failed to change password', {
            variant: 'error',
          });
        }
      } catch {
        enqueueSnackbar('An unexpected error occurred', {
          variant: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className='p-6'>
      <div className='max-w-xl mx-auto'>
        {/* CARD */}
        <div className='bg-white border border-gray-200 rounded-2xl p-6'>
          {/* HEADER */}
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 rounded-xl bg-[#ff4d4d]/10 text-[#ff4d4d] flex items-center justify-center'>
              <Lock size={22} />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>Change Password</h2>
              <p className='text-sm text-gray-500'>Update your account password</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={formik.handleSubmit} className='space-y-5'>
            {/* Current Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Current Password</label>
              <div className='relative'>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name='old_password'
                  value={formik.values.old_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-[#ff4d4d]
                    ${formik.touched.old_password && formik.errors.old_password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type='button' onClick={() => setShowCurrent(!showCurrent)} className='absolute inset-y-0 right-3 flex items-center text-gray-400'>
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.old_password && formik.errors.old_password && <p className='text-xs text-red-600 mt-1'>{formik.errors.old_password}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
              <div className='relative'>
                <input
                  type={showNew ? 'text' : 'password'}
                  name='new_password'
                  value={formik.values.new_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-[#ff4d4d]
                    ${formik.touched.new_password && formik.errors.new_password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type='button' onClick={() => setShowNew(!showNew)} className='absolute inset-y-0 right-3 flex items-center text-gray-400'>
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.new_password && formik.errors.new_password && <p className='text-xs text-red-600 mt-1'>{formik.errors.new_password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
              <div className='relative'>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name='confirm_password'
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 focus:ring-2 focus:ring-[#ff4d4d]
                    ${formik.touched.confirm_password && formik.errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type='button' onClick={() => setShowConfirm(!showConfirm)} className='absolute inset-y-0 right-3 flex items-center text-gray-400'>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formik.touched.confirm_password && formik.errors.confirm_password && <p className='text-xs text-red-600 mt-1'>{formik.errors.confirm_password}</p>}
            </div>

            {/* ACTION */}
            <div className='pt-4 border-t flex justify-end'>
              <button
                type='submit'
                disabled={formik.isSubmitting || !formik.isValid}
                className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-6 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                {formik.isSubmitting ? 'Changing Password...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
