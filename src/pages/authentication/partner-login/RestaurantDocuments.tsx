import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import axiosInstance from '../utils/axios';

export interface RestaurantDocumentsRef {
  submitForm: () => void;
}

const validationSchema = Yup.object({
  ownerName: Yup.string().trim().required("Owner's full name is required"),
  restaurantName: Yup.string().trim().required('Restaurant name is required'),
  address: Yup.string().trim().required('Address is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
  whatsappSame: Yup.boolean(),
  whatsappNumber: Yup.string().when('whatsappSame', {
    is: false,
    then: (schema) => schema.matches(/^[6-9]\d{9}$/, 'Enter a valid WhatsApp number').required('WhatsApp number is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  pan: Yup.string()
    .trim()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN number (e.g., ABCDE1234F)')
    .required('PAN number is required'),
  gstin: Yup.string()
    .trim()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Enter a valid GSTIN')
    .required('GSTIN is required'),
  fssai: Yup.string()
    .trim()
    .matches(/^[0-9]{14}$/, 'Enter a valid 14-digit FSSAI number')
    .required('FSSAI number is required'),
  ifsc: Yup.string()
    .trim()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code (e.g., SBIN0001234)')
    .required('IFSC code is required'),
  accountNumber: Yup.string()
    .trim()
    .matches(/^[0-9]{9,18}$/, 'Enter a valid account number (9-18 digits)')
    .required('Account number is required'),
});

const RestaurantDocuments = forwardRef<any, any>((props, ref) => {
  const formik = useFormik({
    initialValues: {
      ownerName: '',
      restaurantName: '',
      address: '',
      email: '',
      mobile: '',
      whatsappSame: true,
      whatsappNumber: '',
      pan: '',
      gstin: '',
      fssai: '',
      ifsc: '',
      accountNumber: '',
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: () => {},
  });

  // Fetch data on mount
  // useEffect(() => {
  //   fetchRestaurantData();
  // }, []);

  // const fetchRestaurantData = async () => {
  //   try {
  //     const response = await axiosInstance.get('/admin_control/restaurant-creation');

  //     if (response.data) {
  //       const data = response.data;

  //       formik.setValues({
  //         ownerName: data.owner_full_name || '',
  //         restaurantName: data.restaurant_name || '',
  //         address: data.address || '',
  //         email: data.owner_email || '',
  //         mobile: data.owner_phone_number?.toString() || '',
  //         whatsappSame: data.owner_phone_number === data.whatsapp_number,
  //         whatsappNumber: data.whatsapp_number?.toString() || '',
  //         pan: data.pan || '',
  //         gstin: data.gstin || '',
  //         fssai: data.fssai || '',
  //         ifsc: data.ifsc_code || '',
  //         accountNumber: data.account_number || '',
  //       });
  //     }
  //   } catch (error) {
  //     console.log('Error fetching data:', error);
  //   }
  // };

  useImperativeHandle(ref, () => ({
    submit: formik.submitForm,
    isValid: formik.isValid,
    values: formik.values,
  }));

  const showError = (name: keyof typeof formik.values) => formik.touched[name] && formik.errors[name];

  return (
    <>
      <p className='text-muted mb-3 small'>FSSAI, PAN, GST and Bank account.</p>

      {/* Previous Step Data (Read-only) */}
      <div className='mb-4 p-3 bg-light rounded'>
        <h6 className='mb-3'>Restaurant Information</h6>
        <div className='row'>
          <div className='col-md-6 mb-2'>
            <small className='text-muted'>Owner Name:</small>
            <div className='fw-bold'>{formik.values.ownerName || '-'}</div>
          </div>
          <div className='col-md-6 mb-2'>
            <small className='text-muted'>Restaurant Name:</small>
            <div className='fw-bold'>{formik.values.restaurantName || '-'}</div>
          </div>
          <div className='col-12 mb-2'>
            <small className='text-muted'>Address:</small>
            <div className='fw-bold'>{formik.values.address || '-'}</div>
          </div>
          <div className='col-md-6 mb-2'>
            <small className='text-muted'>Email:</small>
            <div className='fw-bold'>{formik.values.email || '-'}</div>
          </div>
          <div className='col-md-6 mb-2'>
            <small className='text-muted'>Mobile:</small>
            <div className='fw-bold'>{formik.values.mobile || '-'}</div>
          </div>
        </div>
      </div>

      {/* FSSAI & PAN */}
      <div className='mb-4'>
        <label className='form-label'>FSSAI Number*</label>
        <input type='text' className={`form-control mb-1 ${showError('fssai') ? 'is-invalid' : ''}`} {...formik.getFieldProps('fssai')} placeholder='Enter 14-digit FSSAI number' />
        {showError('fssai') && <div className='invalid-feedback'>{formik.errors.fssai}</div>}

        <label className='form-label mt-3'>PAN Number*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('pan') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('pan')}
          placeholder='e.g., ABCDE1234F'
          style={{ textTransform: 'uppercase' }}
        />
        {showError('pan') && <div className='invalid-feedback'>{formik.errors.pan}</div>}

        <label className='form-label mt-3'>GSTIN*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('gstin') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('gstin')}
          placeholder='e.g., 22ABCDE1234F1Z5'
          style={{ textTransform: 'uppercase' }}
        />
        {showError('gstin') && <div className='invalid-feedback'>{formik.errors.gstin}</div>}
      </div>

      {/* Bank Details */}
      <div className='mb-4'>
        <label className='form-label'>IFSC Code*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('ifsc') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('ifsc')}
          placeholder='e.g., SBIN0001234'
          style={{ textTransform: 'uppercase' }}
        />
        {showError('ifsc') && <div className='invalid-feedback'>{formik.errors.ifsc}</div>}

        <label className='form-label mt-3'>Bank Account Number*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('accountNumber') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('accountNumber')}
          placeholder='Enter bank account number'
        />
        {showError('accountNumber') && <div className='invalid-feedback'>{formik.errors.accountNumber}</div>}

        <small className='text-muted d-block mt-2'>Please ensure your bank account details are correct</small>
      </div>
    </>
  );
});

export default RestaurantDocuments;
