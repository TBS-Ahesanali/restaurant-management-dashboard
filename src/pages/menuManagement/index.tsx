import React, { useEffect } from 'react';
import CategoryManagement from './CategoryManagement';
import SubCategoryManagement from './SubCategoryManagement';
import MenuItemManagement from './MenuItemManagement';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  getCategories,
  getAllSubCategories,
  getMenuItems,
  getVariationGroups,
  getVariations,
  getAddonGroups,
  getAddons,
  getModifierGroups,
  getModifiers,
} from '../../redux/slices/menuManagementSlice';

/* ================= MAIN MENU MANAGEMENT COMPONENT ================= */

interface MenuManagementProps {
  restaurantId?: number;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ restaurantId = 1 }) => {
  const dispatch = useDispatch<AppDispatch>();

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
  }, [dispatch]);

  return (
    <div className='p-6'>
      <div className='max-w-full mx-auto space-y-6'>
        {/* HEADER */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Menu Management</h1>
          <p className='text-gray-600'>Manage categories, subcategories, and menu items</p>
        </div>

        {/* CATEGORIES SECTION */}
        <CategoryManagement />

        {/* SUBCATEGORIES SECTION */}
        <SubCategoryManagement />

        {/* MENU ITEMS SECTION */}
        <MenuItemManagement restaurantId={restaurantId} />
      </div>
    </div>
  );
};

export default MenuManagement;
