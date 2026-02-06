import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
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
    dispatch(getCategories());
  }, [dispatch]);

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

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = (await dispatch(deleteCategory(id)).unwrap()) as StatusResponse;
      if (response?.status === 200) {
        enqueueSnackbar(response.message || 'Category deleted successfully.', {
          variant: 'success',
        });
        dispatch(getCategories());
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

      {isLoading && <div className='text-center py-4'>Loading categories...</div>}

      {!isLoading && categories.length === 0 && <div className='text-center py-8 text-gray-500'>No categories found. Add your first category!</div>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {categories.map((cat: Category) => (
          <div key={cat.id} className='border rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow'>
            <div>
              <h6 className='font-semibold text-gray-900'>{cat.name}</h6>
              <small className='text-sm'>{cat.is_active ? <span className='text-green-600'>Active</span> : <span className='text-red-600'>Inactive</span>}</small>
            </div>
            <div className='flex gap-2'>
              <button className='text-blue-600 hover:text-blue-800 transition-colors' onClick={() => handleOpenModal(cat)}>
                <Edit2 size={16} />
              </button>
              <button className='text-red-600 hover:text-red-800 transition-colors' onClick={() => handleDeleteCategory(cat.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

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
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                categoryFormik.touched.name && categoryFormik.errors.name ? 'border-red-500' : 'border-gray-300'
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
    </div>
  );
};

export default CategoryManagement;
