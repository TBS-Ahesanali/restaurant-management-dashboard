import React, { useState, useRef } from 'react';
import { Camera, Mail, Building, Save } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { updateUserProfile } from '../../redux/slices/userProfileSlice';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required.')
    .matches(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed.'),
  phone_number: Yup.string()
    .required('Phone number is required.')
    .matches(/^\+?\d{9,15}$/, 'Phone number must be 9-15 digits.'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  address: Yup.string().required('Address is required'),
});

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { initialize, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const formik = useFormik({
    initialValues: {
      name: user?.full_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      address: user?.address || '',
      restaurant: user?.restaurant || '',
      user_role: user?.user_role || '',
      profile_picture: user?.profile_picture || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', String(values.name));
        formData.append('email', String(values.email));
        formData.append('phone_number', String(values.phone_number));
        formData.append('address', String(values.address));
        formData.append('restaurant', String(values.restaurant));
        formData.append('user_role', String(values.user_role));
        if (avatarFile) formData.append('profile_picture', avatarFile);

        const response = await dispatch(updateUserProfile(formData));

        if (response?.status === 200) {
          await initialize();
          enqueueSnackbar(String(response?.data?.message || 'Profile updated successfully!'), { variant: 'success' });
        } else {
          enqueueSnackbar(String(response?.data?.message || 'Failed to update profile'), { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Failed to update profile', { variant: 'error' });
      }
    },
  });

  return (
    <div className='p-6'>
      <div className='max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* ================= LEFT PROFILE CARD ================= */}
        <div className='space-y-6'>
          {/* Avatar Card */}
          <div className='bg-white border border-gray-200 rounded-2xl p-6 text-center'>
            <div className='relative inline-block'>
              <img src={String(previewAvatar || formik.values.profile_picture)} className='w-28 h-28 rounded-full object-cover mx-auto' />
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center shadow'
              >
                <Camera size={16} />
              </button>
              <input ref={fileInputRef} type='file' className='hidden' accept='image/*' onChange={handleAvatarChange} />
            </div>

            <h2 className='mt-4 text-lg font-semibold text-gray-900'>{formik.values.name}</h2>
            <p className='text-sm text-gray-500'>{formik.values.user_role}</p>
          </div>

          {/* Account Info */}
          <div className='bg-white border border-gray-200 rounded-2xl p-6'>
            <h3 className='text-sm font-semibold text-gray-900 mb-4'>Account Information</h3>

            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 rounded-xl bg-[#ff4d4d]/10 text-[#ff4d4d] flex items-center justify-center'>
                <Building size={18} />
              </div>
              <div>
                <p className='text-xs text-gray-500'>Role</p>
                <p className='text-sm font-medium'>{formik.values.user_role}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-[#ff4d4d]/10 text-[#ff4d4d] flex items-center justify-center'>
                <Mail size={18} />
              </div>
              <div>
                <p className='text-xs text-gray-500'>Email</p>
                <p className='text-sm font-medium'>{formik.values.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className='lg:col-span-2'>
          <div className='bg-white border border-gray-200 rounded-2xl p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-6'>Profile Details</h2>

            <form onSubmit={formik.handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Full Name */}
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>Full Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-[#ff4d4d] ${
                      formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && <p className='text-xs text-red-600 mt-1'>{formik.errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>Email</label>
                  <input type='email' name='email' value={formik.values.email} disabled className='w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500' />
                </div>

                {/* Phone */}
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>Phone Number</label>
                  <input
                    type='tel'
                    name='phone_number'
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-[#ff4d4d] ${
                      formik.touched.phone_number && formik.errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.phone_number && formik.errors.phone_number && <p className='text-xs text-red-600 mt-1'>{formik.errors.phone_number}</p>}
                </div>

                {/* Address */}
                <div className='md:col-span-2'>
                  <label className='text-sm font-medium text-gray-700 mb-1 block'>Address</label>
                  <textarea
                    name='address'
                    rows={3}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    className={`w-full rounded-lg border px-3 py-2 resize-none focus:ring-2 focus:ring-[#ff4d4d] ${
                      formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.address && formik.errors.address && <p className='text-xs text-red-600 mt-1'>{formik.errors.address}</p>}
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className='flex justify-end'>
                <button type='submit' className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg flex items-center gap-2'>
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
