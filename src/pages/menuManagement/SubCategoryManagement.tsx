import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
import ModalComponent from '../../components/ModalComponent';
import {
  getCategories,
  getAllSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  clearMenuManagementState,
  SubCategory,
  StatusResponse,
} from '../../redux/slices/menuManagementSlice';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { useSnackbar } from 'notistack';

/* ================= VALIDATION SCHEMA ================= */

const subCategoryValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Subcategory name must be at least 2 characters')
    .max(50, 'Subcategory name must not exceed 50 characters')
    .required('Subcategory name is required'),
  category: Yup.number().positive('Please select a category').required('Category is required'),
});

/* ================= COMPONENT ================= */

const SubCategoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { categories, subCategories, isLoading, success } = useSelector((state: RootState) => state.menuManagement);

  const [editSubCategory, setEditSubCategory] = useState<SubCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ================= FORMIK ================= */

  const subCategoryFormik = useFormik({
    initialValues: {
      name: '',
      category: 0,
    },
    validationSchema: subCategoryValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let response;

        if (editSubCategory) {
          response = (await dispatch(
            updateSubCategory({
              id: editSubCategory.id,
              name: values.name.trim(),
              category: values.category,
            }),
          ).unwrap()) as StatusResponse;
        } else {
          response = (await dispatch(addSubCategory({ name: values.name.trim(), category: values.category })).unwrap()) as StatusResponse;
        }

        if ((response?.status === 200 || response?.status === 201) && response?.result === '1') {
          enqueueSnackbar(response.message || 'Subcategory saved successfully.', {
            variant: 'success',
          });

          resetForm();
          setEditSubCategory(null);
          setIsModalOpen(false);
          dispatch(getAllSubCategories());
        } else {
          enqueueSnackbar(response?.message || 'Something went wrong.', {
            variant: 'error',
          });
        }
      } catch (err: any) {
        enqueueSnackbar(err?.message || 'Failed to save category.', {
          variant: 'error',
        });
      }
    },
  });
  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getAllSubCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editSubCategory) {
      subCategoryFormik.setValues({
        name: editSubCategory.name,
        category: editSubCategory.category,
      });
    } else {
      subCategoryFormik.resetForm();
    }
  }, [editSubCategory]);

  useEffect(() => {
    if (success !== null) {
      dispatch(clearMenuManagementState());
    }
  }, [success, dispatch]);

  /* ================= HANDLERS ================= */

  const handleDeleteSubCategory = async (id: number) => {
    try {
      const response = (await dispatch(deleteSubCategory(id)).unwrap()) as StatusResponse;
      if (response?.status === 200) {
        enqueueSnackbar(response.message || 'Subcategory deleted successfully.', {
          variant: 'success',
        });
        dispatch(getAllSubCategories());
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to delete subcategory.', {
        variant: 'error',
      });
    }
  };

  const handleOpenModal = (subCategory: SubCategory | null = null) => {
    setEditSubCategory(subCategory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    subCategoryFormik.resetForm();
    setEditSubCategory(null);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  /* ================= UI ================= */

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Subcategories</h2>
        <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors' onClick={() => handleOpenModal(null)}>
          <Plus size={18} /> Add Subcategory
        </button>
      </div>

      {isLoading && <div className='text-center py-4'>Loading subcategories...</div>}

      <div className='table-responsive'>
        <table className='table table-hover align-middle mb-0'>
          <thead className='bg-gray-50'>
            <tr>
              <th>NAME</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th className='text-center'>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={4} className='text-center py-6 text-gray-500'>
                  No subcategories found. Add your first subcategory!
                </td>
              </tr>
            ) : (
              subCategories.map((subCat) => (
                <tr key={subCat.id}>
                  <td>
                    <strong>{subCat.name}</strong>
                  </td>
                  <td>
                    <span className='badge bg-primary'>{getCategoryName(subCat.category)}</span>
                  </td>
                  <td>
                    {subCat.is_active ? (
                      <span className='px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700'>Active</span>
                    ) : (
                      <span className='px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700'>Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className='flex justify-center gap-3'>
                      <button
                        className='w-9 h-9 rounded-md bg-[#ff4d4d]/10 flex items-center justify-center text-[#ff4d4d] hover:bg-[#ff4d4d]/20 transition'
                        onClick={() => handleOpenModal(subCat)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className='w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition'
                        onClick={() => handleDeleteSubCategory(subCat.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= SUBCATEGORY MODAL ================= */}
      <ModalComponent id='subCategoryModal' title={editSubCategory ? 'Edit Subcategory' : 'Add Subcategory'} size='md' isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={subCategoryFormik.handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category <span className='text-red-500'>*</span>
            </label>
            <select
              name='category'
              value={subCategoryFormik.values.category}
              onChange={subCategoryFormik.handleChange}
              onBlur={subCategoryFormik.handleBlur}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                subCategoryFormik.touched.category && subCategoryFormik.errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={0}>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {subCategoryFormik.touched.category && subCategoryFormik.errors.category && <div className='text-red-500 text-sm mt-1'>{subCategoryFormik.errors.category}</div>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Subcategory Name <span className='text-red-500'>*</span>
            </label>
            <input
              name='name'
              value={subCategoryFormik.values.name}
              onChange={subCategoryFormik.handleChange}
              onBlur={subCategoryFormik.handleBlur}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                subCategoryFormik.touched.name && subCategoryFormik.errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='e.g. Veg Starters'
            />
            {subCategoryFormik.touched.name && subCategoryFormik.errors.name && <div className='text-red-500 text-sm mt-1'>{subCategoryFormik.errors.name}</div>}
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <button type='button' className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-colors' onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              type='submit'
              className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              disabled={isLoading || !subCategoryFormik.isValid}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </ModalComponent>
    </div>
  );
};

export default SubCategoryManagement;
