import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, HelpCircle, Upload, X } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import ModalComponent from '../../components/ModalComponent';

import {
  addMenuItem,
  clearMenuManagementState,
  deleteMenuItem,
  getAllSubCategories,
  getCategories,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  MenuItem,
  getVariationGroups,
  getVariations,
  addVariationGroup,
  updateVariationGroup,
  deleteVariationGroup,
  addVariation,
  updateVariation,
  deleteVariation,
  getAddonGroups,
  getAddons,
  addAddonGroup,
  updateAddonGroup,
  deleteAddonGroup,
  addAddon,
  updateAddon,
  deleteAddon,
  getModifierGroups,
  getModifiers,
  addModifierGroup,
  updateModifierGroup,
  deleteModifierGroup,
  addModifier,
  updateModifier,
  deleteModifier,
} from '../../redux/slices/menuManagementSlice';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';

/* ================= VALIDATION SCHEMA ================= */

const menuItemValidationSchema = Yup.object({
  item_name: Yup.string().trim().min(2, 'Item name must be at least 2 characters').max(100, 'Item name must not exceed 100 characters').required('Item name is required'),
  description: Yup.string().trim().min(5, 'Description must be at least 5 characters').max(500, 'Description must not exceed 500 characters').required('Description is required'),
  category: Yup.number().positive('Please select a category').required('Category is required'),
  food_type: Yup.string().oneOf(['veg', 'non-veg', 'egg'], 'Please select a valid food type').required('Food type is required'),
  tax_rate: Yup.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%').required('Tax rate is required'),
});

/* ================= COMPONENT ================= */

interface MenuItemManagementProps {
  restaurantId: number;
}

const MenuItemManagement: React.FC<MenuItemManagementProps> = ({ restaurantId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, subCategories, menuItems, variationGroups, variations, addonGroups, addons, modifierGroups, modifiers, isLoading, success } = useSelector(
    (state: RootState) => state.menuManagement,
  );
  console.log('isLoading: ', isLoading);

  const [editMenuItem, setEditMenuItem] = useState<MenuItem | null>(null);
  console.log('editMenuItem: ', editMenuItem);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Active tab in the modal
  const [activeTab, setActiveTab] = useState<'basic' | 'variations' | 'addons' | 'modifiers'>('basic');

  // Variation Modal States
  const [isVariationGroupModalOpen, setIsVariationGroupModalOpen] = useState(false);
  const [editVariationGroup, setEditVariationGroup] = useState<any>(null);
  const [isVariationItemModalOpen, setIsVariationItemModalOpen] = useState(false);
  const [editVariation, setEditVariation] = useState<any>(null);
  const [selectedVariationGroupId, setSelectedVariationGroupId] = useState<number>(0);
  const [assignedVariationGroups, setAssignedVariationGroups] = useState<number[]>([]);

  // Addon Modal States
  const [isAddonGroupModalOpen, setIsAddonGroupModalOpen] = useState(false);
  const [editAddonGroup, setEditAddonGroup] = useState<any>(null);
  const [isAddonItemModalOpen, setIsAddonItemModalOpen] = useState(false);
  const [editAddon, setEditAddon] = useState<any>(null);
  const [selectedAddonGroupId, setSelectedAddonGroupId] = useState<number>(0);
  const [assignedAddonGroups, setAssignedAddonGroups] = useState<number[]>([]);

  // Modifier Modal States
  const [isModifierGroupModalOpen, setIsModifierGroupModalOpen] = useState(false);
  const [editModifierGroup, setEditModifierGroup] = useState<any>(null);
  const [isModifierItemModalOpen, setIsModifierItemModalOpen] = useState(false);
  const [editModifier, setEditModifier] = useState<any>(null);
  const [selectedModifierGroupId, setSelectedModifierGroupId] = useState<number>(0);
  const [assignedModifierGroups, setAssignedModifierGroups] = useState<number[]>([]);

  // Predefined tag suggestions
  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const suggestedTags = ['veg preparation', 'imported beef', 'imported buff', 'gluten-free', 'dairy-free', 'spicy', 'chef special', 'organic'];

  /* ================= FORMIK ================= */

  const menuItemFormik = useFormik({
    initialValues: {
      item_name: '',
      // image: '',
      description: '',
      category: 0,
      food_type: 'veg',
      tax_rate: 5.0,
    },
    validationSchema: menuItemValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Map food_type string to number as per API requirement
        const foodTypeMap: { [key: string]: number } = {
          veg: 1,
          'non-veg': 2,
          egg: 3,
        };

        // Prepare payload according to API structure
        const payload: any = {
          menu_item: {
            item_name: values.item_name.trim(),
            description: values.description.trim(),
            // image: values.image,
            category: values.category,
            food_type: foodTypeMap[values.food_type],
            gst: values.tax_rate,
          },
          variant_groups: assignedVariationGroups.map((id) => ({ id })),
          addon_groups: assignedAddonGroups.map((id) => ({ id })),
          modifier_groups: assignedModifierGroups.map((id) => ({ id })),
        };
        console.log(payload, 'payload');
        if (editMenuItem) {
          // For update
          await dispatch(updateMenuItem({ id: editMenuItem.id, data: payload })).unwrap();
        } else {
          // For create
          await dispatch(addMenuItem(payload)).unwrap();
        }

        resetForm();
        setEditMenuItem(null);
        setImageFile(null);
        setImagePreview(null);
        setSelectedTags([]);
        setAssignedVariationGroups([]);
        setAssignedAddonGroups([]);
        setAssignedModifierGroups([]);
        setIsModalOpen(false);
        setActiveTab('basic');
        dispatch(getMenuItems());
      } catch (err: any) {
        console.error('Failed to save menu item:', err);
      }
    },
  });

  // Variation Group Formik
  const variationGroupFormik = useFormik({
    initialValues: {
      name: '',
      description: '',
      display_order: 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      display_order: Yup.number().min(1).required('Display order is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editVariationGroup) {
          await dispatch(updateVariationGroup({ id: editVariationGroup.id, ...values })).unwrap();
        } else {
          await dispatch(addVariationGroup(values)).unwrap();
        }
        resetForm();
        setEditVariationGroup(null);
        setIsVariationGroupModalOpen(false);
        dispatch(getVariationGroups());
      } catch (err: any) {
        console.error('Failed to save variation group:', err);
      }
    },
  });

  // Variation Formik
  const variationFormik = useFormik({
    initialValues: {
      variant_group: 0,
      name: '',
      price: 0,
      is_default: false,
      display_order: 1,
    },
    validationSchema: Yup.object({
      variant_group: Yup.number().positive().required('Variation group is required'),
      name: Yup.string().required('Name is required'),
      price: Yup.number().min(0).required('Price is required'),
      display_order: Yup.number().min(1).required('Display order is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editVariation) {
          await dispatch(updateVariation({ id: editVariation.id, ...values })).unwrap();
        } else {
          await dispatch(addVariation(values)).unwrap();
        }
        resetForm();
        setEditVariation(null);
        setIsVariationItemModalOpen(false);
        dispatch(getVariations());
      } catch (err: any) {
        console.error('Failed to save variation:', err);
      }
    },
  });

  // Addon Group Formik
  const addonGroupFormik = useFormik({
    initialValues: {
      name: '',
      description: '',
      is_required: false,
      min_selections: 0,
      max_selections: 5,
      display_order: 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      min_selections: Yup.number().min(0).required('Min selections is required'),
      max_selections: Yup.number().min(1).required('Max selections is required'),
      display_order: Yup.number().min(1).required('Display order is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editAddonGroup) {
          await dispatch(updateAddonGroup({ id: editAddonGroup.id, ...values })).unwrap();
        } else {
          await dispatch(addAddonGroup(values)).unwrap();
        }
        resetForm();
        setEditAddonGroup(null);
        setIsAddonGroupModalOpen(false);
        dispatch(getAddonGroups());
      } catch (err: any) {
        console.error('Failed to save addon group:', err);
      }
    },
  });

  // Addon Formik
  const addonFormik = useFormik({
    initialValues: {
      restaurant: restaurantId,
      addon_group: 0,
      name: '',
      price: 0,
      description: '',
    },
    validationSchema: Yup.object({
      addon_group: Yup.number().positive().required('Addon group is required'),
      name: Yup.string().required('Name is required'),
      price: Yup.number().min(0).required('Price is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editAddon) {
          await dispatch(updateAddon({ id: editAddon.id, ...values })).unwrap();
        } else {
          await dispatch(addAddon(values)).unwrap();
        }
        resetForm();
        setEditAddon(null);
        setIsAddonItemModalOpen(false);
        dispatch(getAddons());
      } catch (err: any) {
        console.error('Failed to save addon:', err);
      }
    },
  });

  // Modifier Group Formik
  const modifierGroupFormik = useFormik({
    initialValues: {
      name: '',
      description: '',
      selection_type: 'single',
      min_selections: 1,
      max_selections: 1,
      display_order: 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      selection_type: Yup.string().oneOf(['single', 'multiple']).required('Selection type is required'),
      min_selections: Yup.number().min(0).required('Min selections is required'),
      max_selections: Yup.number().min(1).required('Max selections is required'),
      display_order: Yup.number().min(1).required('Display order is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editModifierGroup) {
          await dispatch(updateModifierGroup({ id: editModifierGroup.id, ...values })).unwrap();
        } else {
          await dispatch(addModifierGroup(values)).unwrap();
        }
        resetForm();
        setEditModifierGroup(null);
        setIsModifierGroupModalOpen(false);
        dispatch(getModifierGroups());
      } catch (err: any) {
        console.error('Failed to save modifier group:', err);
      }
    },
  });

  // Modifier Formik
  const modifierFormik = useFormik({
    initialValues: {
      modifier_group: 0,
      name: '',
      description: '',
      price: 0,
      is_available: true,
      is_default: false,
      display_order: 1,
    },
    validationSchema: Yup.object({
      modifier_group: Yup.number().positive().required('Modifier group is required'),
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().min(0).required('Price is required'),
      display_order: Yup.number().min(1).required('Display order is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editModifier) {
          await dispatch(updateModifier({ id: editModifier.id, ...values })).unwrap();
        } else {
          await dispatch(addModifier(values)).unwrap();
        }
        resetForm();
        setEditModifier(null);
        setIsModifierItemModalOpen(false);
        dispatch(getModifiers());
      } catch (err: any) {
        console.error('Failed to save modifier:', err);
      }
    },
  });

  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getAllSubCategories());
    dispatch(getMenuItems());
    dispatch(getVariationGroups());
    dispatch(getVariations());
    dispatch(getAddonGroups());
    dispatch(getAddons());
    dispatch(getModifierGroups());
    dispatch(getModifiers());
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (editMenuItem?.id) {
      // Load full menu item details
      dispatch(getMenuItemById(editMenuItem.id)).then((result: any) => {
        if (result.payload?.data) {
          const menuData = result.payload.data;

          // Map food_type number to string
          const foodTypeMap: { [key: number]: string } = {
            1: 'veg',
            2: 'non-veg',
            3: 'egg',
          };

          menuItemFormik.setValues({
            item_name: menuData.item_name || '',
            // image: menuData.image || '',
            description: menuData.description || '',
            category: menuData.category || 0,
            food_type: foodTypeMap[menuData.is_food_type] || 'veg',
            tax_rate: menuData.gst || 5.0,
          });

          // Extract assigned variation groups
          if (menuData.menu_item_variation && Array.isArray(menuData.menu_item_variation)) {
            const variantGroupIds = menuData.menu_item_variation.map((item: any) => item.variant_group);
            setAssignedVariationGroups(variantGroupIds);
          }

          // Extract assigned addon groups
          if (menuData.menu_item_addons && Array.isArray(menuData.menu_item_addons)) {
            const addonGroupIds = menuData.menu_item_addons.map((item: any) => item.addon_group);
            setAssignedAddonGroups(addonGroupIds);
          }

          // Extract assigned modifier groups
          if (menuData.menu_item_modifiers && Array.isArray(menuData.menu_item_modifiers)) {
            const modifierGroupIds = menuData.menu_item_modifiers.map((item: any) => item.modifier_group);
            setAssignedModifierGroups(modifierGroupIds);
          }

          // Handle images if available
          if (menuData.images && Array.isArray(menuData.images) && menuData.images.length > 0) {
            setImagePreview(menuData.images[0].image);
          }
        }
      });
    } else if (!editMenuItem) {
      menuItemFormik.resetForm();
      setImagePreview(null);
      setSelectedTags([]);
      setAssignedVariationGroups([]);
      setAssignedAddonGroups([]);
      setAssignedModifierGroups([]);
    }
  }, [editMenuItem?.id]);

  useEffect(() => {
    if (editVariationGroup) {
      variationGroupFormik.setValues({
        name: editVariationGroup.name,
        description: editVariationGroup.description,
        display_order: editVariationGroup.display_order,
      });
    }
  }, [editVariationGroup]);

  useEffect(() => {
    if (editVariation) {
      variationFormik.setValues({
        variant_group: editVariation.variant_group,
        name: editVariation.name,
        price: editVariation.price,
        is_default: editVariation.is_default,
        display_order: editVariation.display_order,
      });
    }
  }, [editVariation]);

  useEffect(() => {
    if (editAddonGroup) {
      addonGroupFormik.setValues({
        name: editAddonGroup.name,
        description: editAddonGroup.description,
        is_required: editAddonGroup.is_required,
        min_selections: editAddonGroup.min_selections,
        max_selections: editAddonGroup.max_selections,
        display_order: editAddonGroup.display_order,
      });
    }
  }, [editAddonGroup]);

  useEffect(() => {
    if (editAddon) {
      addonFormik.setValues({
        restaurant: editAddon.restaurant,
        addon_group: editAddon.addon_group,
        name: editAddon.name,
        price: editAddon.price,
        description: editAddon.description,
      });
    }
  }, [editAddon]);

  useEffect(() => {
    if (editModifierGroup) {
      modifierGroupFormik.setValues({
        name: editModifierGroup.name,
        description: editModifierGroup.description,
        selection_type: editModifierGroup.selection_type,
        min_selections: editModifierGroup.min_selections,
        max_selections: editModifierGroup.max_selections,
        display_order: editModifierGroup.display_order,
      });
    }
  }, [editModifierGroup]);

  useEffect(() => {
    if (editModifier) {
      modifierFormik.setValues({
        modifier_group: editModifier.modifier_group,
        name: editModifier.name,
        description: editModifier.description,
        price: editModifier.price,
        is_available: editModifier.is_available,
        is_default: editModifier.is_default,
        display_order: editModifier.display_order,
      });
    }
  }, [editModifier]);

  useEffect(() => {
    if (success !== null) {
      dispatch(clearMenuManagementState());
    }
  }, [success, dispatch]);

  /* ================= HANDLERS ================= */

  const handleDeleteMenuItem = async () => {
    if (!itemToDelete) return;
    try {
      await dispatch(deleteMenuItem(itemToDelete.id)).unwrap();
      dispatch(getMenuItems());
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete menu item:', err);
    }
  };

  const openDeleteModal = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleOpenModal = (menuItem: MenuItem | null = null) => {
    setEditMenuItem(menuItem);
    setIsModalOpen(true);
    setActiveTab('basic');
  };

  const handleCloseModal = () => {
    menuItemFormik.resetForm();
    setIsModalOpen(false);
    setEditMenuItem(null);
    setImageFile(null);
    setImagePreview(null);
    setSelectedTags([]);
    setTagInput('');
    setAssignedVariationGroups([]);
    setAssignedAddonGroups([]);
    setAssignedModifierGroups([]);
    setActiveTab('basic');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getSubCategoryName = (subCategoryId: number) => {
    const subCategory = subCategories.find((subCat: any) => subCat.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown';
  };

  // Variation Handlers
  const handleToggleVariationGroup = (groupId: number) => {
    setAssignedVariationGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  };

  const handleDeleteVariationGroup = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this variation group?')) {
      try {
        await dispatch(deleteVariationGroup(id)).unwrap();
        dispatch(getVariationGroups());
        setAssignedVariationGroups((prev) => prev.filter((groupId) => groupId !== id));
      } catch (err: any) {
        console.error('Failed to delete variation group:', err);
      }
    }
  };

  const handleDeleteVariation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this variation?')) {
      try {
        await dispatch(deleteVariation(id)).unwrap();
        dispatch(getVariations());
      } catch (err: any) {
        console.error('Failed to delete variation:', err);
      }
    }
  };

  // Addon Handlers
  const handleToggleAddonGroup = (groupId: number) => {
    setAssignedAddonGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  };

  const handleDeleteAddonGroup = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this addon group?')) {
      try {
        await dispatch(deleteAddonGroup(id)).unwrap();
        dispatch(getAddonGroups());
        setAssignedAddonGroups((prev) => prev.filter((groupId) => groupId !== id));
      } catch (err: any) {
        console.error('Failed to delete addon group:', err);
      }
    }
  };

  const handleDeleteAddon = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this addon?')) {
      try {
        await dispatch(deleteAddon(id)).unwrap();
        dispatch(getAddons());
      } catch (err: any) {
        console.error('Failed to delete addon:', err);
      }
    }
  };

  // Modifier Handlers
  const handleToggleModifierGroup = (groupId: number) => {
    setAssignedModifierGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  };

  const handleDeleteModifierGroup = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this modifier group?')) {
      try {
        await dispatch(deleteModifierGroup(id)).unwrap();
        dispatch(getModifierGroups());
        setAssignedModifierGroups((prev) => prev.filter((groupId) => groupId !== id));
      } catch (err: any) {
        console.error('Failed to delete modifier group:', err);
      }
    }
  };

  const handleDeleteModifier = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this modifier?')) {
      try {
        await dispatch(deleteModifier(id)).unwrap();
        dispatch(getModifiers());
      } catch (err: any) {
        console.error('Failed to delete modifier:', err);
      }
    }
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Menu Items</h2>
        <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors' onClick={() => handleOpenModal(null)}>
          <Plus size={18} /> Add Menu Item
        </button>
      </div>

      {isLoading && <div className='text-center py-4'>Loading menu items...</div>}

      <div className='table-responsive'>
        <table className='table table-hover align-middle mb-0'>
          <thead className='bg-gray-50'>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={4} className='text-center py-6 text-gray-500'>
                  No menu items found. Add your first menu item!
                </td>
              </tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className='d-flex align-items-center gap-3'>
                      {item.image && <img src={item.image} className='rounded-lg' width='48' height='48' style={{ objectFit: 'cover' }} alt={item.item_name} />}
                      <div>
                        <div className='text-muted text-sm'>{item?.item_name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className='d-flex align-items-center gap-3'>{item?.description}</div>
                  </td>
                  <td>
                    <div className='d-flex align-items-center gap-3'>
                      <div className='text-muted text-sm'>${item?.price?.toFixed(2)}</div>
                    </div>
                  </td>
                  <td>
                    <span className='badge bg-primary'>{getCategoryName(item.category)}</span>
                  </td>
                  <td>
                    {item.is_available ? (
                      <span className='px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700'>Available</span>
                    ) : (
                      <span className='px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700'>Unavailable</span>
                    )}
                  </td>
                  <td className='text-center'>
                    <div className='flex justify-center gap-3'>
                      <button
                        className='w-9 h-9 rounded-md bg-[#ff4d4d]/10 flex items-center justify-center text-[#ff4d4d] hover:bg-[#ff4d4d]/20 transition'
                        onClick={() => handleOpenModal(item)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className='w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition'
                        onClick={() => openDeleteModal(item)}
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

      {/* ================= ENHANCED MENU ITEM MODAL WITH TABS ================= */}
      <ModalComponent id='menuItemModal' title={editMenuItem ? 'Edit Menu Item' : 'Add Menu Item'} size='xl' isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className='space-y-4'>
          {/* Tab Navigation */}
          <div className='border-b border-gray-200'>
            <nav className='flex gap-8'>
              <button
                onClick={() => setActiveTab('basic')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'basic' ? 'border-[#ff4d4d] text-[#ff4d4d]' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic Details
              </button>
              <button
                onClick={() => setActiveTab('variations')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'variations' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Variations
                {assignedVariationGroups.length > 0 && (
                  <span className='ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs'>{assignedVariationGroups.length}</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('addons')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'addons' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Add-ons
                {assignedAddonGroups.length > 0 && <span className='ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs'>{assignedAddonGroups.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab('modifiers')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'modifiers' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Modifiers
                {assignedModifierGroups.length > 0 && <span className='ml-2 bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs'>{assignedModifierGroups.length}</span>}
              </button>
            </nav>
          </div>

          <form onSubmit={menuItemFormik.handleSubmit} className='space-y-6'>
            {/* Basic Details Tab */}
            {activeTab === 'basic' && (
              <>
                {/* Basic Details Section */}
                <div className='border-b pb-4'>
                  <h3 className='text-base font-semibold mb-4 text-gray-900'>Basic Details</h3>

                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-1 flex items-center gap-1'>
                        Item Name <span className='text-red-500'>*</span>
                        <HelpCircle size={14} className='text-gray-400' />
                      </label>
                      <input
                        name='item_name'
                        value={menuItemFormik.values.item_name}
                        onChange={menuItemFormik.handleChange}
                        onBlur={menuItemFormik.handleBlur}
                        className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                          menuItemFormik.touched.item_name && menuItemFormik.errors.item_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder='Margherita Pizza'
                        maxLength={100}
                      />
                      <div className='flex justify-between items-center mt-1'>
                        {menuItemFormik.touched.item_name && menuItemFormik.errors.item_name && <div className='text-red-500 text-sm'>{menuItemFormik.errors.item_name}</div>}
                        <div className='text-xs text-gray-400 ml-auto'>{menuItemFormik.values.item_name.length} / 100</div>
                      </div>
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-1 flex items-center gap-1'>
                        Item Description <span className='text-red-500'>*</span>
                        <HelpCircle size={14} className='text-gray-400' />
                      </label>
                      <textarea
                        name='description'
                        value={menuItemFormik.values.description}
                        onChange={menuItemFormik.handleChange}
                        onBlur={menuItemFormik.handleBlur}
                        className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                          menuItemFormik.touched.description && menuItemFormik.errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows={3}
                        placeholder='Margherita pizza for 2'
                        maxLength={500}
                      />
                      <div className='flex justify-between items-center mt-1'>
                        {menuItemFormik.touched.description && menuItemFormik.errors.description && <div className='text-red-500 text-sm'>{menuItemFormik.errors.description}</div>}
                        <div className='text-xs text-gray-400 ml-auto'>{menuItemFormik.values.description.length} / 500</div>
                      </div>
                    </div>

                    {/* Food Type */}
                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                        Food Type <span className='text-red-500'>*</span>
                        <HelpCircle size={14} className='text-gray-400' />
                      </label>
                      <div className='flex gap-3'>
                        <button
                          type='button'
                          onClick={() => menuItemFormik.setFieldValue('food_type', 'veg')}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                            menuItemFormik.values.food_type === 'veg' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-300'
                          }`}
                        >
                          <div className='flex items-center justify-center gap-2'>
                            <div className='w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center'>
                              <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                            </div>
                            <span className='font-medium'>Veg</span>
                          </div>
                        </button>
                        <button
                          type='button'
                          onClick={() => menuItemFormik.setFieldValue('food_type', 'non-veg')}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                            menuItemFormik.values.food_type === 'non-veg' ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-300'
                          }`}
                        >
                          <div className='flex items-center justify-center gap-2'>
                            <div className='w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center'>
                              <div className='w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-red-600'></div>
                            </div>
                            <span className='font-medium'>Non-Veg</span>
                          </div>
                        </button>
                        <button
                          type='button'
                          onClick={() => menuItemFormik.setFieldValue('food_type', 'egg')}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                            menuItemFormik.values.food_type === 'egg' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
                          }`}
                        >
                          <div className='flex items-center justify-center gap-2'>
                            <div className='w-4 h-4 border-2 border-orange-600 rounded-sm flex items-center justify-center'>
                              <div className='w-2 h-2 bg-orange-600 rounded-full'></div>
                            </div>
                            <span className='font-medium'>Egg</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-1 block'>
                        Menu Category <span className='text-red-500'>*</span>
                      </label>
                      <select
                        name='category'
                        value={menuItemFormik.values.category}
                        onChange={menuItemFormik.handleChange}
                        onBlur={menuItemFormik.handleBlur}
                        className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] ${
                          menuItemFormik.touched.category && menuItemFormik.errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value={0}>Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {menuItemFormik.touched.category && menuItemFormik.errors.category && <div className='text-red-500 text-sm mt-1'>{menuItemFormik.errors.category}</div>}
                    </div>

                    {/* Tax Rate */}
                    <div>
                      <label className='text-sm font-medium text-gray-700 mb-1 block'>
                        GST (%) <span className='text-red-500'>*</span>
                      </label>
                      <select
                        name='tax_rate'
                        value={menuItemFormik.values.tax_rate}
                        onChange={menuItemFormik.handleChange}
                        className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]'
                      >
                        <option value={0}>GST 0.0%</option>
                        <option value={5}>GST 5.0%</option>
                        <option value={12}>GST 12.0%</option>
                        <option value={18}>GST 18.0%</option>
                        <option value={28}>GST 28.0%</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Item Photos Section */}
                {/* <div className='border-b pb-4'>
                  <h3 className='text-base font-semibold mb-4 text-gray-900'>Item Photos</h3>
                  <div className='flex items-start gap-4'>
                    <div className='flex-shrink-0'>
                      {imagePreview ? (
                        <div className='relative'>
                          <img src={imagePreview} className='rounded-lg object-cover w-32 h-32 border-2 border-gray-200' alt='Preview' />
                          <button
                            type='button'
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className='w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50'>
                          <Upload size={24} className='text-gray-400 mb-1' />
                          <span className='text-sm text-blue-600'>Upload</span>
                          <input type='file' className='hidden' onChange={handleImageUpload} accept='image/*' />
                        </label>
                      )}
                    </div>
                  </div>
                </div> */}
              </>
            )}

            {/* Variations Tab */}
            {activeTab === 'variations' && (
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h4 className='font-semibold text-gray-900'>Variation Groups</h4>
                    <p className='text-sm text-gray-500'>Select variation groups to assign to this menu item</p>
                  </div>
                  <button
                    type='button'
                    className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
                    onClick={() => {
                      setEditVariationGroup(null);
                      variationGroupFormik.resetForm();
                      setIsVariationGroupModalOpen(true);
                    }}
                  >
                    <Plus size={16} /> Add Group
                  </button>
                </div>

                <div className='border rounded-lg divide-y max-h-96 overflow-y-auto'>
                  {variationGroups.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>
                      <p>No variation groups available. Create one to get started!</p>
                    </div>
                  ) : (
                    variationGroups.map((group) => (
                      <div key={group.id} className='p-4 hover:bg-gray-50'>
                        <div className='flex items-start gap-3'>
                          <input
                            type='checkbox'
                            checked={assignedVariationGroups.includes(group.id)}
                            onChange={() => handleToggleVariationGroup(group.id)}
                            className='mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                          />
                          <div className='flex-1'>
                            <h5 className='font-medium text-gray-900'>{group.name}</h5>
                            <p className='text-sm text-gray-600 mt-1'>{group.description}</p>
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {variations
                                .filter((v) => v.variant_group === group.id)
                                .map((variation) => (
                                  <span key={variation.id} className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2'>
                                    {variation.name} - ₹{variation.price}
                                    {variation.is_default && <span className='text-xs bg-purple-200 px-1.5 rounded'>Default</span>}
                                    <button type='button' className='hover:text-purple-900' onClick={() => handleDeleteVariation(variation.id)}>
                                      <X size={14} />
                                    </button>
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              className='text-sm text-blue-600 hover:text-blue-800'
                              onClick={() => {
                                setSelectedVariationGroupId(group.id);
                                setEditVariation(null);
                                variationFormik.resetForm();
                                variationFormik.setFieldValue('variant_group', group.id);
                                setIsVariationItemModalOpen(true);
                              }}
                            >
                              Add Item
                            </button>
                            <button
                              type='button'
                              className='text-sm text-blue-600 hover:text-blue-800'
                              onClick={() => {
                                setEditVariationGroup(group);
                                setIsVariationGroupModalOpen(true);
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button type='button' className='text-sm text-red-600 hover:text-red-800' onClick={() => handleDeleteVariationGroup(group.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Add-ons Tab */}
            {activeTab === 'addons' && (
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h4 className='font-semibold text-gray-900'>Add-on Groups</h4>
                    <p className='text-sm text-gray-500'>Select add-on groups to assign to this menu item</p>
                  </div>
                  <button
                    type='button'
                    className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
                    onClick={() => {
                      setEditAddonGroup(null);
                      addonGroupFormik.resetForm();
                      setIsAddonGroupModalOpen(true);
                    }}
                  >
                    <Plus size={16} /> Add Group
                  </button>
                </div>

                <div className='border rounded-lg divide-y max-h-96 overflow-y-auto'>
                  {addonGroups.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>
                      <p>No add-on groups available. Create one to get started!</p>
                    </div>
                  ) : (
                    addonGroups.map((group) => (
                      <div key={group.id} className='p-4 hover:bg-gray-50'>
                        <div className='flex items-start gap-3'>
                          <input
                            type='checkbox'
                            checked={assignedAddonGroups.includes(group.id)}
                            onChange={() => handleToggleAddonGroup(group.id)}
                            className='mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500'
                          />
                          <div className='flex-1'>
                            <h5 className='font-medium text-gray-900'>{group.name}</h5>
                            <p className='text-sm text-gray-600 mt-1'>{group.description}</p>
                            <p className='text-xs text-gray-500 mt-1'>
                              {group.is_required ? 'Required' : 'Optional'} • Min: {group.min_selections} Max: {group.max_selections}
                            </p>
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {addons
                                .filter((a) => a.addon_group === group.id)
                                .map((addon) => (
                                  <span key={addon.id} className='px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2'>
                                    {addon.name} - ₹{addon.price}
                                    <button type='button' className='hover:text-orange-900' onClick={() => handleDeleteAddon(addon.id)}>
                                      <X size={14} />
                                    </button>
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              className='text-sm text-blue-600 hover:text-blue-800'
                              onClick={() => {
                                setSelectedAddonGroupId(group.id);
                                setEditAddon(null);
                                addonFormik.resetForm();
                                addonFormik.setFieldValue('addon_group', group.id);
                                addonFormik.setFieldValue('restaurant', restaurantId);
                                setIsAddonItemModalOpen(true);
                              }}
                            >
                              Add Item
                            </button>
                            <button
                              type='button'
                              className='text-sm text-blue-600 hover:text-blue-800'
                              onClick={() => {
                                setEditAddonGroup(group);
                                setIsAddonGroupModalOpen(true);
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button type='button' className='text-sm text-red-600 hover:text-red-800' onClick={() => handleDeleteAddonGroup(group.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Modifiers Tab */}
            {activeTab === 'modifiers' && (
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h4 className='font-semibold text-gray-900'>Modifier Groups</h4>
                    <p className='text-sm text-gray-500'>Select modifier groups to assign to this menu item</p>
                  </div>
                  <button
                    type='button'
                    className='bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
                    onClick={() => {
                      setEditModifierGroup(null);
                      modifierGroupFormik.resetForm();
                      setIsModifierGroupModalOpen(true);
                    }}
                  >
                    <Plus size={16} /> Add Group
                  </button>
                </div>

                <div className='border rounded-lg divide-y max-h-96 overflow-y-auto'>
                  {modifierGroups.length === 0 ? (
                    <div className='p-8 text-center text-gray-500'>
                      <p>No modifier groups available. Create one to get started!</p>
                    </div>
                  ) : (
                    modifierGroups.map((group) => (
                      <div key={group.id} className='p-4 hover:bg-gray-50'>
                        <div className='flex items-start gap-3'>
                          <input
                            type='checkbox'
                            checked={assignedModifierGroups.includes(group.id)}
                            onChange={() => handleToggleModifierGroup(group.id)}
                            className='mt-1 w-4 h-4 text-teal-600 rounded focus:ring-teal-500'
                          />
                          <div className='flex-1'>
                            <h5 className='font-medium text-gray-900'>{group.name}</h5>
                            <p className='text-sm text-gray-600 mt-1'>{group.description}</p>
                            <p className='text-xs text-gray-500 mt-1'>
                              Type: {group.selection_type} • Min: {group.min_selections} Max: {group.max_selections}
                            </p>
                            <div className='mt-2 flex flex-wrap gap-2'>
                              {modifiers
                                .filter((m) => m.modifier_group === group.id)
                                .map((modifier) => (
                                  <span key={modifier.id} className='px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2'>
                                    {modifier.name} - ₹{modifier.price}
                                    {modifier.is_default && <span className='text-xs bg-teal-200 px-1.5 rounded'>Default</span>}
                                    <button type='button' className='hover:text-teal-900' onClick={() => handleDeleteModifier(modifier.id)}>
                                      <X size={14} />
                                    </button>
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <button
                              type='button'
                              className='text-sm text-blue-600 hover:text-blue-800'
                              onClick={() => {
                                setSelectedModifierGroupId(group.id);
                                setEditModifier(null);
                                modifierFormik.resetForm();
                                modifierFormik.setFieldValue('modifier_group', group.id);
                                setIsModifierItemModalOpen(true);
                              }}
                            >
                              Add Item
                            </button>
                            <button
                              type='button'
                              className='text-sm text-blue-600 hover:text-blue-800'
                              onClick={() => {
                                setEditModifierGroup(group);
                                setIsModifierGroupModalOpen(true);
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button type='button' className='text-sm text-red-600 hover:text-red-800' onClick={() => handleDeleteModifierGroup(group.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex justify-end gap-3 pt-4 border-t'>
              <button type='button' className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-colors' onClick={handleCloseModal}>
                Cancel
              </button>
              <button
                type='submit'
                className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                disabled={isLoading || !menuItemFormik.isValid}
              >
                {isLoading ? 'Saving...' : editMenuItem ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      </ModalComponent>

      {/* Variation Group Form Modal */}
      <ModalComponent
        id='variationGroupFormModal'
        title={editVariationGroup ? 'Edit Variation Group' : 'Add Variation Group'}
        size='lg'
        isOpen={isVariationGroupModalOpen}
        onClose={() => {
          setIsVariationGroupModalOpen(false);
          variationGroupFormik.resetForm();
          setEditVariationGroup(null);
        }}
      >
        <form onSubmit={variationGroupFormik.handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Group Name *</label>
            <input
              name='name'
              value={variationGroupFormik.values.name}
              onChange={variationGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Size'
            />
            {variationGroupFormik.errors.name && <p className='text-red-500 text-xs mt-1'>{variationGroupFormik.errors.name}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Description *</label>
            <input
              name='description'
              value={variationGroupFormik.values.description}
              onChange={variationGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Choose pizza size'
            />
            {variationGroupFormik.errors.description && <p className='text-red-500 text-xs mt-1'>{variationGroupFormik.errors.description}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Display Order *</label>
            <input
              type='number'
              name='display_order'
              value={variationGroupFormik.values.display_order}
              onChange={variationGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <button
              type='button'
              className='bg-gray-200 px-4 py-2 rounded-lg'
              onClick={() => {
                setIsVariationGroupModalOpen(false);
                variationGroupFormik.resetForm();
                setEditVariationGroup(null);
              }}
            >
              Cancel
            </button>
            <button type='submit' className='bg-purple-600 text-white px-4 py-2 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* Variation Item Form Modal */}
      <ModalComponent
        id='variationItemFormModal'
        title={editVariation ? 'Edit Variation' : 'Add Variation'}
        size='lg'
        isOpen={isVariationItemModalOpen}
        onClose={() => {
          setIsVariationItemModalOpen(false);
          variationFormik.resetForm();
          setEditVariation(null);
        }}
      >
        <form onSubmit={variationFormik.handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Variation Group *</label>
            <select name='variant_group' value={variationFormik.values.variant_group} onChange={variationFormik.handleChange} className='w-full border rounded-lg px-3 py-2 mt-1'>
              <option value={0}>Select Group</option>
              {variationGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {variationFormik.errors.variant_group && <p className='text-red-500 text-xs mt-1'>{variationFormik.errors.variant_group}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Name *</label>
            <input
              name='name'
              value={variationFormik.values.name}
              onChange={variationFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Large (18 inch)'
            />
            {variationFormik.errors.name && <p className='text-red-500 text-xs mt-1'>{variationFormik.errors.name}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Price *</label>
            <input type='number' name='price' value={variationFormik.values.price} onChange={variationFormik.handleChange} className='w-full border rounded-lg px-3 py-2 mt-1' />
            {variationFormik.errors.price && <p className='text-red-500 text-xs mt-1'>{variationFormik.errors.price}</p>}
          </div>
          <div className='flex items-center gap-2'>
            <input type='checkbox' name='is_default' checked={variationFormik.values.is_default} onChange={variationFormik.handleChange} className='w-4 h-4' />
            <label className='text-sm'>Set as default</label>
          </div>
          <div>
            <label className='text-sm font-medium'>Display Order *</label>
            <input
              type='number'
              name='display_order'
              value={variationFormik.values.display_order}
              onChange={variationFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <button
              type='button'
              className='bg-gray-200 px-4 py-2 rounded-lg'
              onClick={() => {
                setIsVariationItemModalOpen(false);
                variationFormik.resetForm();
                setEditVariation(null);
              }}
            >
              Cancel
            </button>
            <button type='submit' className='bg-purple-600 text-white px-4 py-2 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* Addon Group Form Modal */}
      <ModalComponent
        id='addonGroupFormModal'
        title={editAddonGroup ? 'Edit Add-on Group' : 'Add Add-on Group'}
        size='lg'
        isOpen={isAddonGroupModalOpen}
        onClose={() => {
          setIsAddonGroupModalOpen(false);
          addonGroupFormik.resetForm();
          setEditAddonGroup(null);
        }}
      >
        <form onSubmit={addonGroupFormik.handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Group Name *</label>
            <input
              name='name'
              value={addonGroupFormik.values.name}
              onChange={addonGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Extra Toppings'
            />
            {addonGroupFormik.errors.name && <p className='text-red-500 text-xs mt-1'>{addonGroupFormik.errors.name}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Description *</label>
            <input
              name='description'
              value={addonGroupFormik.values.description}
              onChange={addonGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Add extra toppings to your pizza'
            />
            {addonGroupFormik.errors.description && <p className='text-red-500 text-xs mt-1'>{addonGroupFormik.errors.description}</p>}
          </div>
          <div className='flex items-center gap-2'>
            <input type='checkbox' name='is_required' checked={addonGroupFormik.values.is_required} onChange={addonGroupFormik.handleChange} className='w-4 h-4' />
            <label className='text-sm'>Required selection</label>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium'>Min Selections *</label>
              <input
                type='number'
                name='min_selections'
                value={addonGroupFormik.values.min_selections}
                onChange={addonGroupFormik.handleChange}
                className='w-full border rounded-lg px-3 py-2 mt-1'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Max Selections *</label>
              <input
                type='number'
                name='max_selections'
                value={addonGroupFormik.values.max_selections}
                onChange={addonGroupFormik.handleChange}
                className='w-full border rounded-lg px-3 py-2 mt-1'
              />
            </div>
          </div>
          <div>
            <label className='text-sm font-medium'>Display Order *</label>
            <input
              type='number'
              name='display_order'
              value={addonGroupFormik.values.display_order}
              onChange={addonGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <button
              type='button'
              className='bg-gray-200 px-4 py-2 rounded-lg'
              onClick={() => {
                setIsAddonGroupModalOpen(false);
                addonGroupFormik.resetForm();
                setEditAddonGroup(null);
              }}
            >
              Cancel
            </button>
            <button type='submit' className='bg-orange-600 text-white px-4 py-2 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* Addon Item Form Modal */}
      <ModalComponent
        id='addonItemFormModal'
        title={editAddon ? 'Edit Add-on' : 'Add Add-on'}
        size='lg'
        isOpen={isAddonItemModalOpen}
        onClose={() => {
          setIsAddonItemModalOpen(false);
          addonFormik.resetForm();
          setEditAddon(null);
        }}
      >
        <form onSubmit={addonFormik.handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Add-on Group *</label>
            <select name='addon_group' value={addonFormik.values.addon_group} onChange={addonFormik.handleChange} className='w-full border rounded-lg px-3 py-2 mt-1'>
              <option value={0}>Select Group</option>
              {addonGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            {addonFormik.errors.addon_group && <p className='text-red-500 text-xs mt-1'>{addonFormik.errors.addon_group}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Name *</label>
            <input
              name='name'
              value={addonFormik.values.name}
              onChange={addonFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Thums up'
            />
            {addonFormik.errors.name && <p className='text-red-500 text-xs mt-1'>{addonFormik.errors.name}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Price *</label>
            <input type='number' name='price' value={addonFormik.values.price} onChange={addonFormik.handleChange} className='w-full border rounded-lg px-3 py-2 mt-1' />
            {addonFormik.errors.price && <p className='text-red-500 text-xs mt-1'>{addonFormik.errors.price}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Description *</label>
            <textarea
              name='description'
              value={addonFormik.values.description}
              onChange={addonFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              rows={2}
              placeholder='e.g., Soda thums up 30 ml'
            />
            {addonFormik.errors.description && <p className='text-red-500 text-xs mt-1'>{addonFormik.errors.description}</p>}
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <button
              type='button'
              className='bg-gray-200 px-4 py-2 rounded-lg'
              onClick={() => {
                setIsAddonItemModalOpen(false);
                addonFormik.resetForm();
                setEditAddon(null);
              }}
            >
              Cancel
            </button>
            <button type='submit' className='bg-orange-600 text-white px-4 py-2 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* Modifier Group Form Modal */}
      <ModalComponent
        id='modifierGroupFormModal'
        title={editModifierGroup ? 'Edit Modifier Group' : 'Add Modifier Group'}
        size='lg'
        isOpen={isModifierGroupModalOpen}
        onClose={() => {
          setIsModifierGroupModalOpen(false);
          modifierGroupFormik.resetForm();
          setEditModifierGroup(null);
        }}
      >
        <form onSubmit={modifierGroupFormik.handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Group Name *</label>
            <input
              name='name'
              value={modifierGroupFormik.values.name}
              onChange={modifierGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Cooking Preference'
            />
            {modifierGroupFormik.errors.name && <p className='text-red-500 text-xs mt-1'>{modifierGroupFormik.errors.name}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Description *</label>
            <input
              name='description'
              value={modifierGroupFormik.values.description}
              onChange={modifierGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Choose how you want it cooked'
            />
            {modifierGroupFormik.errors.description && <p className='text-red-500 text-xs mt-1'>{modifierGroupFormik.errors.description}</p>}
          </div>
          <div>
            <label className='text-sm font-medium'>Selection Type *</label>
            <select
              name='selection_type'
              value={modifierGroupFormik.values.selection_type}
              onChange={modifierGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            >
              <option value='single'>Single</option>
              <option value='multiple'>Multiple</option>
            </select>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium'>Min Selections *</label>
              <input
                type='number'
                name='min_selections'
                value={modifierGroupFormik.values.min_selections}
                onChange={modifierGroupFormik.handleChange}
                className='w-full border rounded-lg px-3 py-2 mt-1'
              />
            </div>
            <div>
              <label className='text-sm font-medium'>Max Selections *</label>
              <input
                type='number'
                name='max_selections'
                value={modifierGroupFormik.values.max_selections}
                onChange={modifierGroupFormik.handleChange}
                className='w-full border rounded-lg px-3 py-2 mt-1'
              />
            </div>
          </div>
          <div>
            <label className='text-sm font-medium'>Display Order *</label>
            <input
              type='number'
              name='display_order'
              value={modifierGroupFormik.values.display_order}
              onChange={modifierGroupFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            />
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <button
              type='button'
              className='bg-gray-200 px-4 py-2 rounded-lg'
              onClick={() => {
                setIsModifierGroupModalOpen(false);
                modifierGroupFormik.resetForm();
                setEditModifierGroup(null);
              }}
            >
              Cancel
            </button>
            <button type='submit' className='bg-teal-600 text-white px-4 py-2 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* Modifier Item Form Modal */}
      <ModalComponent
        id='modifierItemFormModal'
        title={editModifier ? 'Edit Modifier' : 'Add Modifier'}
        size='lg'
        isOpen={isModifierItemModalOpen}
        onClose={() => {
          setIsModifierItemModalOpen(false);
          modifierFormik.resetForm();
          setEditModifier(null);
        }}
      >
        <form onSubmit={modifierFormik.handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Modifier Group</label>
            <select
              name='modifier_group'
              value={modifierFormik.values.modifier_group || selectedModifierGroupId}
              onChange={modifierFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            >
              <option value={0}>Select Group</option>
              {modifierGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-sm font-medium'>Name</label>
            <input
              name='name'
              value={modifierFormik.values.name}
              onChange={modifierFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              placeholder='e.g., Extra Cheese'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Description</label>
            <textarea
              name='description'
              value={modifierFormik.values.description}
              onChange={modifierFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
              rows={2}
              placeholder='e.g., Adds additional cheese to the item'
            />
          </div>
          <div>
            <label className='text-sm font-medium'>Price</label>
            <input type='number' name='price' value={modifierFormik.values.price} onChange={modifierFormik.handleChange} className='w-full border rounded-lg px-3 py-2 mt-1' />
          </div>
          <div className='flex gap-4'>
            <div className='flex items-center gap-2'>
              <input type='checkbox' name='is_available' checked={modifierFormik.values.is_available} onChange={modifierFormik.handleChange} />
              <label className='text-sm'>Available</label>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' name='is_default' checked={modifierFormik.values.is_default} onChange={modifierFormik.handleChange} />
              <label className='text-sm'>Set as default</label>
            </div>
          </div>
          <div>
            <label className='text-sm font-medium'>Display Order</label>
            <input
              type='number'
              name='display_order'
              value={modifierFormik.values.display_order}
              onChange={modifierFormik.handleChange}
              className='w-full border rounded-lg px-3 py-2 mt-1'
            />
          </div>
          <div className='flex justify-end gap-2'>
            <button type='button' className='bg-gray-200 px-4 py-2 rounded-lg' onClick={() => setIsModifierItemModalOpen(false)}>
              Cancel
            </button>
            <button type='submit' className='bg-teal-600 text-white px-4 py-2 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && itemToDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in'>
            <div className='p-6'>
              <div className='flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4'>
                <Trash2 className='text-red-600' size={32} />
              </div>
              <h2 className='text-2xl font-bold text-center mb-4 text-gray-900'>Delete Menu Item</h2>
              <p className='text-gray-600 text-center mb-6'>
                Are you sure you want to delete <span className='font-semibold'>{itemToDelete.item_name}</span>? This action cannot be undone.
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className='flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium'
                >
                  Cancel
                </button>
                <button onClick={handleDeleteMenuItem} className='flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg'>
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

export default MenuItemManagement;
