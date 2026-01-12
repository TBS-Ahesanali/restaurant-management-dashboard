import React, { useState, useRef } from 'react';
import { Camera, Mail, Building, Save } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { updateUserProfile } from '../../redux/slices/userProfileSlice';
// import { PATHS } from '../../routes/paths';

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
  // const navigate = useNavigate();
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
        formData.append('name', values.name.toString());
        formData.append('email', values.email.toString());
        formData.append('phone_number', values.phone_number.toString());
        formData.append('address', values.address.toString());
        formData.append('restaurant', values.restaurant.toString());
        formData.append('user_role', values.user_role.toString());
        if (avatarFile) {
          formData.append('profile_picture', avatarFile);
        }
        const response = await dispatch(updateUserProfile(formData));

        if (response?.status === 200) {
          await initialize();
          enqueueSnackbar(typeof response?.data?.message === 'string' && response.data.message.trim() !== '' ? response.data.message : 'Profile updated successfully!', {
            variant: 'success',
          });

          // navigate(PATHS.DASHBOARD);
        } else {
          enqueueSnackbar(typeof response?.data?.message === 'string' && response.data.message.trim() !== '' ? response.data.message : 'Failed to update profile', {
            variant: 'error',
          });
        }
      } catch (err) {
        console.log('err: ', err);
        enqueueSnackbar('Failed to update profile', { variant: 'error' });
      }
    },
  });
  console.log(formik, 'formik');
  return (
    <div className='container-fluid p-4'>
      <div className='row'>
        <div className='col-lg-4'>
          <div className='card mb-4'>
            <div className='card-body text-center'>
              <div className='avatar-wrapper position-relative d-inline-block mb-4' onClick={handleAvatarClick}>
                <img src={String(previewAvatar || formik.values.profile_picture)} alt={String(formik.values.profile_picture)} className='profile-avatar rounded-circle' />

                <div className='avatar-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center'>
                  <Camera size={30} className='text-white' />
                </div>

                <input ref={fileInputRef} type='file' className='d-none' accept='image/*' onChange={handleAvatarChange} />
              </div>
              <h5 className='mb-1'>{formik.values.name}</h5>
              <p className='text-muted mb-3'>{formik.values.user_role}</p>
            </div>
          </div>

          <div className='card'>
            <div className='card-body'>
              <h6 className='card-title mb-4'>Account Information</h6>
              <div className='d-flex align-items-center mb-3'>
                <div className='bg-primary bg-opacity-10 text-primary rounded p-2 me-3'>
                  <Building size={20} />
                </div>
                <div>
                  <small className='text-muted d-block'>Role</small>
                  <span>{formik.values.user_role}</span>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='bg-primary bg-opacity-10 text-primary rounded p-2 me-3'>
                  <Mail size={20} />
                </div>
                <div>
                  <small className='text-muted d-block'>Email</small>
                  <span>{formik.values.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-lg-8'>
          <div className='card'>
            <div className='card-body'>
              <h6 className='card-title mb-4 text-2xl'>Profile Details</h6>
              <form onSubmit={formik.handleSubmit}>
                <div className='row g-4'>
                  <div className='col-md-6'>
                    <label className='form-label'>Full Name</label>
                    <input
                      type='text'
                      className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && <div className='invalid-feedback'>{formik.errors.name}</div>}
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Email</label>
                    <input
                      type='email'
                      className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                      name='email'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      disabled
                    />
                    {formik.touched.email && formik.errors.email && <div className='invalid-feedback'>{formik.errors.email}</div>}
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Phone Number</label>
                    <input
                      type='tel'
                      className={`form-control ${formik.touched.phone_number && formik.errors.phone_number ? 'is-invalid' : ''}`}
                      name='phone_number'
                      value={formik.values.phone_number}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone_number && formik.errors.phone_number && <div className='invalid-feedback'>{formik.errors.phone_number}</div>}
                  </div>

                  <div className='col-12'>
                    <label className='form-label'>Address</label>
                    <input
                      type='text'
                      className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                      name='address'
                      value={formik.values.address}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.address && formik.errors.address && <div className='invalid-feedback'>{formik.errors.address}</div>}
                  </div>
                </div>
                <div className='d-flex justify-content-end gap-2'>
                  <button type='submit' className='btn btn-success d-flex align-items-center gap-2 mt-4'>
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
