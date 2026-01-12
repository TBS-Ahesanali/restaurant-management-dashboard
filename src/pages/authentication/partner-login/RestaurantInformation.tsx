import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import axiosInstance from '../utils/axios';

export interface RestaurantInfoRef {
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
});

const RestaurantInformationStep = forwardRef<any, any>((props, ref) => {
  const formik = useFormik({
    initialValues: {
      ownerName: '',
      restaurantName: '',
      address: '',
      email: '',
      mobile: '',
      whatsappSame: true,
      whatsappNumber: '',
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
      <p className='text-muted mb-3 small'>Location, Owner details, Open & Close hrs.</p>

      {/* Owner & Restaurant */}
      <div className='mb-4'>
        <label className='form-label'>Owner's Full Name*</label>
        <input type='text' className={`form-control mb-1 ${showError('ownerName') ? 'is-invalid' : ''}`} {...formik.getFieldProps('ownerName')} />
        {showError('ownerName') && <div className='invalid-feedback'>{formik.errors.ownerName}</div>}

        <label className='form-label mt-3'>Restaurant Name*</label>
        <input type='text' className={`form-control mb-1 ${showError('restaurantName') ? 'is-invalid' : ''}`} {...formik.getFieldProps('restaurantName')} />
        {showError('restaurantName') && <div className='invalid-feedback'>{formik.errors.restaurantName}</div>}

        <label className='form-label mt-3'>Address*</label>
        <input type='text' className={`form-control mb-1 ${showError('address') ? 'is-invalid' : ''}`} {...formik.getFieldProps('address')} />
        {showError('address') && <div className='invalid-feedback'>{formik.errors.address}</div>}
      </div>

      {/* Contact Details */}
      <div className='mb-4'>
        <label className='form-label'>Email Address*</label>
        <input type='email' className={`form-control mb-1 ${showError('email') ? 'is-invalid' : ''}`} {...formik.getFieldProps('email')} />
        {showError('email') && <div className='invalid-feedback'>{formik.errors.email}</div>}

        <label className='form-label mt-3'>Mobile Number*</label>
        <input type='tel' className={`form-control mb-1 ${showError('mobile') ? 'is-invalid' : ''}`} {...formik.getFieldProps('mobile')} />
        {showError('mobile') && <div className='invalid-feedback'>{formik.errors.mobile}</div>}

        <small className='text-muted d-block mt-2'>You will receive a verification mail on this ID</small>

        {/* WhatsApp */}
        <label className='form-label d-block mt-3'>WhatsApp Number</label>

        <div className='form-check'>
          <input
            className='form-check-input'
            type='radio'
            id='whatsappSameYes'
            name='whatsappSame'
            checked={formik.values.whatsappSame}
            onChange={() => formik.setFieldValue('whatsappSame', true)}
          />
          <label className='form-check-label cursor-pointer' htmlFor='whatsappSameYes'>
            My WhatsApp number is same as above
          </label>
        </div>

        <div className='form-check'>
          <input
            className='form-check-input'
            type='radio'
            id='whatsappSameNo'
            name='whatsappSame'
            checked={!formik.values.whatsappSame}
            onChange={() => formik.setFieldValue('whatsappSame', false)}
          />
          <label className='form-check-label cursor-pointer' htmlFor='whatsappSameNo'>
            I have a different WhatsApp number
          </label>
        </div>

        {!formik.values.whatsappSame && (
          <>
            <input
              type='tel'
              className={`form-control mt-2 ${showError('whatsappNumber') ? 'is-invalid' : ''}`}
              {...formik.getFieldProps('whatsappNumber')}
              placeholder='Enter WhatsApp number'
            />
            {showError('whatsappNumber') && <div className='invalid-feedback'>{formik.errors.whatsappNumber}</div>}
          </>
        )}
      </div>
    </>
  );
});

export default RestaurantInformationStep;
