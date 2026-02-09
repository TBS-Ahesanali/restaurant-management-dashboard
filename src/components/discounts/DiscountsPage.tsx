import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, List, Gift, Ticket } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent';
import {
  getRestaurantOffers,
  addRestaurantOffer,
  updateRestaurantOffer,
  deleteRestaurantOffer,
  clearOfferState,
  RestaurantOffer,
  StatusResponse,
} from '../../redux/slices/offerManagementSlice';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { useSnackbar } from 'notistack';

/* ================= VALIDATION SCHEMA ================= */

const offerValidationSchema = Yup.object({
  title: Yup.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters').required('Title is required'),
  discount_type: Yup.string().oneOf(['percent', 'flat'], 'Invalid discount type').required('Discount type is required'),
  discount_value: Yup.number().min(0, 'Discount value must be positive').required('Discount value is required'),
  start_date: Yup.date().required('Start date is required').min(new Date().toISOString().split('T')[0], 'Start date cannot be in the past'),
  end_date: Yup.date().required('End date is required').min(Yup.ref('start_date'), 'End date must be after start date'),
  is_active: Yup.boolean(),
});

/* ================= COMPONENT ================= */

const DiscountsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { offers, isLoading, success } = useSelector((state: RootState) => state.offerManagement);

  const [editOffer, setEditOffer] = useState<RestaurantOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<RestaurantOffer | null>(null);

  /* ================= FORMIK ================= */

  const offerFormik = useFormik({
    initialValues: {
      title: '',
      discount_type: 'percent' as 'percent' | 'flat',
      discount_value: 0,
      start_date: '',
      end_date: '',
      is_active: true,
    },
    validationSchema: offerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let response;

        if (editOffer) {
          response = (await dispatch(
            updateRestaurantOffer({
              id: editOffer.id,
              ...values,
            }),
          ).unwrap()) as StatusResponse;
        } else {
          response = (await dispatch(addRestaurantOffer(values)).unwrap()) as StatusResponse;
        }

        if ((response?.status === 200 || response?.status === 201) && response?.result === '1') {
          enqueueSnackbar(response.message || 'Offer saved successfully.', {
            variant: 'success',
          });

          resetForm();
          setEditOffer(null);
          setIsModalOpen(false);
          dispatch(getRestaurantOffers());
        } else {
          enqueueSnackbar(response?.message || 'Something went wrong.', {
            variant: 'error',
          });
        }
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'Failed to save offer.', {
          variant: 'error',
        });
      }
    },
  });

  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(getRestaurantOffers());
  }, [dispatch]);

  useEffect(() => {
    if (editOffer) {
      offerFormik.setValues({
        title: editOffer.title,
        discount_type: editOffer.discount_type,
        discount_value: editOffer.discount_value,
        start_date: editOffer.start_date,
        end_date: editOffer.end_date,
        is_active: editOffer.is_active,
      });
    } else {
      offerFormik.resetForm();
    }
  }, [editOffer]);

  useEffect(() => {
    if (success !== null) {
      dispatch(clearOfferState());
    }
  }, [success, dispatch]);

  /* ================= HANDLERS ================= */

  const handleDeleteOffer = async () => {
    if (!offerToDelete) return;

    try {
      const response = (await dispatch(deleteRestaurantOffer(offerToDelete.id)).unwrap()) as StatusResponse;
      if (response?.status === 200) {
        enqueueSnackbar(response.message || 'Offer deleted successfully.', {
          variant: 'success',
        });
        dispatch(getRestaurantOffers());
        setIsDeleteModalOpen(false);
        setOfferToDelete(null);
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to delete offer.', {
        variant: 'error',
      });
    }
  };

  const handleOpenModal = (offer: RestaurantOffer | null = null) => {
    setEditOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    offerFormik.resetForm();
    setEditOffer(null);
  };

  const handleOpenDeleteModal = (offer: RestaurantOffer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOfferToDelete(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'percent':
        return <Gift size={22} className='text-[#ff4d4d]' />;
      case 'flat':
        return <Ticket size={22} className='text-[#ff4d4d]' />;
      default:
        return <List size={22} className='text-[#ff4d4d]' />;
    }
  };

  const getStatus = (offer: RestaurantOffer) => {
    const today = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);

    if (!offer.is_active) return 'Inactive';
    if (today < startDate) return 'Scheduled';
    if (today > endDate) return 'Expired';

    const diffInDays = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays <= 3) return 'Ending Soon';

    return 'Active';
  };

  /* ================= UI ================= */

  return (
    <div className='p-6'>
      <div className='max-w-full mx-auto space-y-6'>
        {/* HEADER */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Discounts & Offers</h1>
            <p className='text-gray-600'>Manage promotional offers and discounts</p>
          </div>

          <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors' onClick={() => handleOpenModal(null)}>
            <Plus size={18} />
            New Offer
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && <div className='text-center py-8'>Loading offers...</div>}

        {/* EMPTY STATE */}
        {!isLoading && offers.length === 0 && (
          <div className='text-center py-12 text-gray-500'>
            <p className='text-lg'>No offers found. Create your first offer!</p>
          </div>
        )}

        {/* DISCOUNT CARDS */}
        <div className='row g-4'>
          {offers.map((offer: any) => {
            const status = getStatus(offer);
            console.log('status: ', status);
            return (
              <div key={offer.id} className='col-md-4'>
                <div className='bg-white border border-gray-200 rounded-2xl p-4 h-100 hover:shadow-md transition'>
                  {/* TOP SECTION */}
                  <div className='flex items-start gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0'>{getIcon(offer.discount_type)}</div>

                    <div>
                      <h4 className='text-base font-semibold text-gray-900 leading-tight'>{offer.title}</h4>
                      <p className='text-sm text-gray-500 mt-0.5'>{offer.discount_type === 'percent' ? `${offer.discount_value}% off` : `₹${offer.discount_value} flat off`}</p>
                    </div>
                  </div>

                  {/* META INFO */}
                  <div className='flex justify-between text-sm text-gray-600 mt-4'>
                    <div>
                      <span className='block text-xs text-gray-400'>Start Date</span>
                      <span>{new Date(offer.start_date).toLocaleDateString()}</span>
                    </div>

                    <div className='text-right'>
                      <span className='block text-xs text-gray-400'>End Date</span>
                      <span>{new Date(offer.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className='border-t border-gray-100 my-2' />

                  {/* FOOTER */}
                  <div className='flex justify-between items-center'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : status === 'Ending Soon'
                            ? 'bg-amber-100 text-amber-700'
                            : status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {status}
                    </span>

                    <div className='flex gap-3'>
                      <button
                        className='w-9 h-9 rounded-md bg-[#ff4d4d]/10 flex items-center justify-center text-[#ff4d4d] hover:bg-[#ff4d4d]/20 transition'
                        onClick={() => handleOpenModal(offer)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className='w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition'
                        onClick={() => handleOpenDeleteModal(offer)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= OFFER MODAL ================= */}
        <ModalComponent id='offerModal' title={editOffer ? 'Edit Offer' : 'Add New Offer'} size='md' isOpen={isModalOpen} onClose={handleCloseModal}>
          <form onSubmit={offerFormik.handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Offer Title <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='title'
                value={offerFormik.values.title}
                onChange={offerFormik.handleChange}
                onBlur={offerFormik.handleBlur}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                  offerFormik.touched.title && offerFormik.errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='e.g. Weekend 20% Off'
              />
              {offerFormik.touched.title && offerFormik.errors.title && <div className='text-red-500 text-sm mt-1'>{offerFormik.errors.title}</div>}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Discount Type <span className='text-red-500'>*</span>
                </label>
                <select
                  name='discount_type'
                  value={offerFormik.values.discount_type}
                  onChange={offerFormik.handleChange}
                  onBlur={offerFormik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                    offerFormik.touched.discount_type && offerFormik.errors.discount_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value='percent'>Percentage (%)</option>
                  <option value='flat'>Flat Amount (₹)</option>
                </select>
                {offerFormik.touched.discount_type && offerFormik.errors.discount_type && <div className='text-red-500 text-sm mt-1'>{offerFormik.errors.discount_type}</div>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Discount Value <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='discount_value'
                  value={offerFormik.values.discount_value}
                  onChange={offerFormik.handleChange}
                  onBlur={offerFormik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                    offerFormik.touched.discount_value && offerFormik.errors.discount_value ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={offerFormik.values.discount_type === 'percent' ? 'e.g. 20' : 'e.g. 100'}
                  min='0'
                  step={offerFormik.values.discount_type === 'percent' ? '0.01' : '1'}
                />
                {offerFormik.touched.discount_value && offerFormik.errors.discount_value && <div className='text-red-500 text-sm mt-1'>{offerFormik.errors.discount_value}</div>}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Start Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  name='start_date'
                  value={offerFormik.values.start_date}
                  onChange={offerFormik.handleChange}
                  onBlur={offerFormik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                    offerFormik.touched.start_date && offerFormik.errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {offerFormik.touched.start_date && offerFormik.errors.start_date && <div className='text-red-500 text-sm mt-1'>{offerFormik.errors.start_date}</div>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  End Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  name='end_date'
                  value={offerFormik.values.end_date}
                  onChange={offerFormik.handleChange}
                  onBlur={offerFormik.handleBlur}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                    offerFormik.touched.end_date && offerFormik.errors.end_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {offerFormik.touched.end_date && offerFormik.errors.end_date && <div className='text-red-500 text-sm mt-1'>{offerFormik.errors.end_date}</div>}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                id='is_active'
                name='is_active'
                checked={offerFormik.values.is_active}
                onChange={offerFormik.handleChange}
                className='w-4 h-4 text-[#ff4d4d] border-gray-300 rounded focus:ring-[#ff4d4d]'
              />
              <label htmlFor='is_active' className='text-sm font-medium text-gray-700'>
                Active
              </label>
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t'>
              <button type='button' className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-colors' onClick={handleCloseModal}>
                Cancel
              </button>
              <button
                type='submit'
                className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                disabled={isLoading || !offerFormik.isValid}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </ModalComponent>

        {/* ================= DELETE MODAL ================= */}
        <ModalComponent id='deleteOfferModal' title='Delete Offer' size='sm' isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
          <div className='space-y-4'>
            <p className='text-gray-700'>
              Are you sure you want to delete <strong>"{offerToDelete?.title}"</strong>? This action cannot be undone.
            </p>

            <div className='flex justify-end gap-3 pt-4 border-t'>
              <button className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-colors' onClick={handleCloseDeleteModal}>
                Cancel
              </button>
              <button className='bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors' onClick={handleDeleteOffer}>
                Delete
              </button>
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default DiscountsPage;
