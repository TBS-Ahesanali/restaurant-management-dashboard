import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface RestaurantDocumentsProps {
  initialData?: any;
}

const validationSchema = Yup.object({
  pan_number: Yup.string()
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
  ifsc_code: Yup.string()
    .trim()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code (e.g., SBIN0001234)')
    .required('IFSC code is required'),
  accountNumber: Yup.string()
    .trim()
    .matches(/^[0-9]{9,18}$/, 'Enter a valid account number (9-18 digits)')
    .required('Account number is required'),
});

const RestaurantDocuments = forwardRef<any, RestaurantDocumentsProps>(({ initialData }, ref) => {
  const formik = useFormik({
    initialValues: {
      bank_name: '',
      pan_number: '',
      gstin: '',
      fssai: '',
      ifsc_code: '',
      accountNumber: '',
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: () => {},
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      formik.setValues({
        bank_name: initialData.bank_name || '',
        pan_number: initialData.pan_number || '',
        gstin: initialData.gstin || '',
        fssai: initialData.fssai || '',
        ifsc_code: initialData.ifsc_code || '',
        accountNumber: initialData.account_number || '',
      });
    }
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    submit: formik.submitForm,
    isValid: formik.isValid,
    values: formik.values,
  }));

  const showError = (name: keyof typeof formik.values) => formik.touched[name] && formik.errors[name];

  return (
    <>
      <p className='text-muted mb-3 small'>Bank account and FSSAI, PAN, GST.</p>

      {/* Previous Step Data (Read-only) */}
      {/* {initialData && (
        <div className='mb-4 p-3 bg-light rounded'>
          <h6 className='mb-3'>Restaurant Information</h6>
          <div className='row'>
            <div className='col-md-6 mb-2'>
              <small className='text-muted'>Owner Name:</small>
              <div className='fw-bold'>{initialData.owner_full_name || '-'}</div>
            </div>
            <div className='col-md-6 mb-2'>
              <small className='text-muted'>Restaurant Name:</small>
              <div className='fw-bold'>{initialData.restaurant_name || '-'}</div>
            </div>
            <div className='col-12 mb-2'>
              <small className='text-muted'>Address:</small>
              <div className='fw-bold'>{initialData.address || '-'}</div>
            </div>
            <div className='col-md-6 mb-2'>
              <small className='text-muted'>Email:</small>
              <div className='fw-bold'>{initialData.owner_email || '-'}</div>
            </div>
            <div className='col-md-6 mb-2'>
              <small className='text-muted'>Mobile:</small>
              <div className='fw-bold'>{initialData.owner_phone_number || '-'}</div>
            </div>
          </div>
        </div>
      )} */}

      {/* FSSAI & PAN */}
      <div className='mb-2'>
        <label className='form-label'>Bank Name*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('bank_name') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('bank_name')}
          placeholder='Enter 14-digit FSSAI number'
        />
        {showError('bank_name') && <div className='invalid-feedback'>{formik.errors.bank_name}</div>}
        <label className='form-label'>IFSC Code*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('ifsc_code') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('ifsc_code')}
          placeholder='e.g., SBIN0001234'
          style={{ textTransform: 'uppercase' }}
        />
        {showError('ifsc_code') && <div className='invalid-feedback'>{formik.errors.ifsc_code}</div>}

        <label className='form-label'>Bank Account Number*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('accountNumber') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('accountNumber')}
          placeholder='Enter bank account number'
        />
        {showError('accountNumber') && <div className='invalid-feedback'>{formik.errors.accountNumber}</div>}
        <small className='text-muted d-block mt-2'>Please ensure your bank account details are correct</small>
      </div>

      {/* Bank Details */}
      <div className='mb-4'>
        <label className='form-label mt-2'>PAN Number*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('pan_number') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('pan_number')}
          placeholder='e.g., ABCDE1234F'
          style={{ textTransform: 'uppercase' }}
        />
        {showError('pan_number') && <div className='invalid-feedback'>{formik.errors.pan_number}</div>}

        <label className='form-label'>GSTIN*</label>
        <input
          type='text'
          className={`form-control mb-1 ${showError('gstin') ? 'is-invalid' : ''}`}
          {...formik.getFieldProps('gstin')}
          placeholder='e.g., 22ABCDE1234F1Z5'
          style={{ textTransform: 'uppercase' }}
        />
        {showError('gstin') && <div className='invalid-feedback'>{formik.errors.gstin}</div>}
        <label className='form-label'>FSSAI Number*</label>
        <input type='text' className={`form-control mb-1 ${showError('fssai') ? 'is-invalid' : ''}`} {...formik.getFieldProps('fssai')} placeholder='Enter 14-digit FSSAI number' />
        {showError('fssai') && <div className='invalid-feedback'>{formik.errors.fssai}</div>}
      </div>
    </>
  );
});

RestaurantDocuments.displayName = 'RestaurantDocuments';

export default RestaurantDocuments;
