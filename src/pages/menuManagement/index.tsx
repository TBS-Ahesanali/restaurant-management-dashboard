import React from 'react';
import CategoryManagement from './CategoryManagement';
import SubCategoryManagement from './SubCategoryManagement';
import MenuItemManagement from './MenuItemManagement';

/* ================= MAIN MENU MANAGEMENT COMPONENT ================= */

interface MenuManagementProps {
  restaurantId?: number;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ restaurantId = 1 }) => {
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
