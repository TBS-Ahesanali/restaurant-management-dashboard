import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, Tag } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
import ModalComponent from '../../components/ModalComponent';
import { getCategories, addCategory, updateCategory, deleteCategory, clearMenuManagementState, Category, StatusResponse } from '../../redux/slices/menuManagementSlice';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { useSnackbar } from 'notistack';

/* ================= VALIDATION SCHEMA ================= */

const categoryValidationSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Category name must be at least 2 characters').max(50, 'Category name must not exceed 50 characters').required('Category name is required'),
});

/* ================= COMPONENT ================= */

const CategoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { categories, isLoading, success } = useSelector((state: RootState) => state.menuManagement);

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  /* ================= FORMIK ================= */

  const categoryFormik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        let response;

        if (editCategory) {
          response = (await dispatch(
            updateCategory({
              id: editCategory.id,
              name: values.name.trim(),
            }),
          ).unwrap()) as StatusResponse;
        } else {
          response = (await dispatch(
            addCategory({
              name: values.name.trim(),
            }),
          ).unwrap()) as StatusResponse;
        }

        if ((response?.status === 200 || response?.status === 201) && response?.result === '1') {
          enqueueSnackbar(response.message || 'Category saved successfully.', {
            variant: 'success',
          });

          resetForm();
          setEditCategory(null);
          setIsModalOpen(false);
          dispatch(getCategories());
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
    if (editCategory) {
      categoryFormik.setValues({ name: editCategory.name });
    } else {
      categoryFormik.resetForm();
    }
  }, [editCategory]);

  useEffect(() => {
    if (success !== null) {
      dispatch(clearMenuManagementState());
    }
  }, [success, dispatch]);

  /* ================= HANDLERS ================= */

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const response = (await dispatch(deleteCategory(categoryToDelete.id)).unwrap()) as StatusResponse;
      if (response?.status === 200) {
        enqueueSnackbar(response.message || 'Category deleted successfully.', {
          variant: 'success',
        });
        dispatch(getCategories());
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to delete category.', {
        variant: 'error',
      });
    }
  };

  const handleOpenModal = (category: Category | null = null) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    categoryFormik.resetForm();
    setEditCategory(null);
  };

  /* ================= UI ================= */

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Categories</h2>
        <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors' onClick={() => handleOpenModal(null)}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='border rounded-xl p-4 flex justify-between items-start animate-pulse'>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-3 bg-gray-100 rounded w-1/3'></div>
              </div>
              <div className='flex gap-2'>
                <div className='w-9 h-9 bg-gray-100 rounded-md'></div>
                <div className='w-9 h-9 bg-gray-100 rounded-md'></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && categories.length === 0 && (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='w-20 h-20 bg-[#ff4d4d]/10 rounded-full flex items-center justify-center mb-4'>
            <Tag size={36} className='text-[#ff4d4d]' />
          </div>
          <h3 className='text-lg font-semibold text-gray-800 mb-1'>No Categories Yet</h3>
          <p className='text-gray-500 text-sm mb-5'>Get started by adding your first category.</p>
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {categories.map((cat: Category) => (
            <div key={cat.id} className='border rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow'>
              <div>
                <h6 className='font-semibold text-gray-900'>{cat.name}</h6>
                <small className='text-sm'>{cat.is_active ? <span className='text-green-600'>Active</span> : <span className='text-red-600'>Inactive</span>}</small>
              </div>

              <div className='flex justify-center gap-3'>
                <button
                  className='w-9 h-9 rounded-md bg-[#ff4d4d]/10 flex items-center justify-center text-[#ff4d4d] hover:bg-[#ff4d4d]/20 transition'
                  onClick={() => handleOpenModal(cat)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className='w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition'
                  onClick={() => openDeleteModal(cat)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CATEGORY MODAL ================= */}
      <ModalComponent id='categoryModal' title={editCategory ? 'Edit Category' : 'Add Category'} size='md' isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={categoryFormik.handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category Name <span className='text-red-500'>*</span>
            </label>
            <input
              name='name'
              value={categoryFormik.values.name}
              onChange={categoryFormik.handleChange}
              onBlur={categoryFormik.handleBlur}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${categoryFormik.touched.name && categoryFormik.errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder='e.g. Starters'
            />
            {categoryFormik.touched.name && categoryFormik.errors.name && <div className='text-red-500 text-sm mt-1'>{categoryFormik.errors.name}</div>}
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <button type='button' className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-colors' onClick={handleCloseModal}>
              Cancel
            </button>
            <button
              type='submit'
              className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              disabled={isLoading || !categoryFormik.isValid}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in'>
            <div className='p-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4'>
                <Trash2 className='text-red-600' size={32} />
              </div>
              <h2 className='text-2xl font-bold text-center mb-4 text-gray-900'>Delete Category</h2>
              <p className='text-gray-600 text-center mb-6'>
                Are you sure you want to delete <span className='font-semibold'>{categoryToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
                  }}
                  className='flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium'
                >
                  Cancel
                </button>
                <button onClick={handleDeleteCategory} className='flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg'>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
