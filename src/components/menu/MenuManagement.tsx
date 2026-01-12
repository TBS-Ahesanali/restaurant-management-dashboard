import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import ModalComponent from '../ModalComponent'; // Assuming ModalComponent is in the same directory

const initialCategories: Category[] = [
  { id: '1', name: 'Starters', itemCount: 12 },
  { id: '2', name: 'Main Course', itemCount: 18 },
  { id: '3', name: 'Desserts', itemCount: 8 },
  { id: '4', name: 'Beverages', itemCount: 15 },
];

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomato, mozzarella, basil',
    category: 'Main Course',
    price: { small: 12.99, medium: 15.99, large: 18.99, default: 12.99 },
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?crop=entropy&fit=crop&w=100&h=100&q=80',
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate with vanilla ice cream',
    category: 'Desserts',
    price: { default: 6.99 },
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?crop=entropy&fit=crop&w=100&h=100&q=80',
    status: 'Out of Stock',
  },
];
interface Category {
  id: string;
  name: string;
  itemCount: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: {
    small?: number;
    medium?: number;
    large?: number;
    default: number;
  };
  image: string;
  status: 'In Stock' | 'Out of Stock';
}

const MenuManagement = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editMenuItem, setEditMenuItem] = useState<MenuItem | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [menuItemData, setMenuItemData] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    category: '',
    price: { default: 0 },
    image: '',
    status: 'In Stock',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editCategory) {
      setCategoryName(editCategory.name);
    } else {
      setCategoryName('');
    }
  }, [editCategory]);

  useEffect(() => {
    if (editMenuItem) {
      setMenuItemData(editMenuItem);
    } else {
      setMenuItemData({ id: '', name: '', description: '', category: '', price: { default: 0 }, image: '', status: 'In Stock' });
    }
  }, [editMenuItem]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleMenuItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMenuItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editCategory) {
      setCategories(categories.map((cat) => (cat.id === editCategory.id ? { ...cat, name: categoryName } : cat)));
    } else {
      setCategories([...categories, { id: String(categories.length + 1), name: categoryName, itemCount: 0 }]);
    }
    setEditCategory(null);
  };

  const handleMenuItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMenuItem) {
      setMenuItems(menuItems.map((item) => (item.id === editMenuItem.id ? menuItemData : item)));
    } else {
      setMenuItems([...menuItems, { ...menuItemData, id: String(menuItems.length + 1) }]);
    }
    setEditMenuItem(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setMenuItemData((prev) => ({ ...prev, image: file.name }));
    }
  };

  const handleDeleteCategory = (id: string) => setCategories(categories.filter((cat) => cat.id !== id));

  const handleDeleteMenuItem = (id: string) => setMenuItems(menuItems.filter((item) => item.id !== id));

  return (
    <div className='container-fluid p-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h1 className='h3 mb-1'>Menu Management</h1>
          <p className='text-muted'>Manage your restaurant's menu items, categories, and modifiers</p>
        </div>
      </div>

      {/* Categories Section */}
      <div className='mb-5'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='h5 mb-0'>Categories</h2>
          <button className='btn btn-primary d-flex align-items-center gap-2' data-bs-toggle='modal' data-bs-target='#categoryModal' onClick={() => setEditCategory(null)}>
            <Plus size={18} />
            Add Category
          </button>
        </div>

        <div className='row g-4'>
          {categories.map((category) => (
            <div key={category.id} className='col-md-3'>
              <div className='card'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <h3 className='h6 mb-1'>{category.name}</h3>
                      <small className='text-muted'>{category.itemCount} Items</small>
                    </div>
                    <div className='d-flex gap-2'>
                      <button
                        className='btn btn-sm btn-outline-primary action-btn'
                        onClick={() => setEditCategory(category)}
                        data-bs-toggle='modal'
                        data-bs-target='#categoryModal'
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className='btn btn-sm btn-outline-danger action-btn' onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Section */}
      <div>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='h5 mb-0'>Menu Items</h2>
          <button className='btn btn-primary d-flex align-items-center gap-2' data-bs-toggle='modal' data-bs-target='#menuItemModal' onClick={() => setEditMenuItem(null)}>
            <Plus size={18} />
            Add Menu Item
          </button>
        </div>

        <div className='card'>
          <div className='card-body p-0'>
            <div className='table-responsive'>
              <table className='table table-hover align-middle mb-0'>
                <thead className='bg-light'>
                  <tr>
                    <th>ITEM</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className='d-flex align-items-center gap-3'>
                          <img src={item.image} alt={item.name} className='rounded' width='48' height='48' style={{ objectFit: 'cover' }} />
                          <div>
                            <h6 className='mb-0'>{item.name}</h6>
                            <small className='text-muted'>{item.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        {item.price.small ? (
                          <div>
                            <div>S: ${item.price.small}</div>
                            <div>M: ${item.price.medium}</div>
                            <div>L: ${item.price.large}</div>
                          </div>
                        ) : (
                          <div>${item.price.default}</div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'In Stock' ? 'bg-success' : 'bg-danger'}`}>{item.status}</span>
                      </td>
                      <td>
                        <div className='d-flex gap-2'>
                          <button
                            className='btn btn-sm btn-outline-primary action-btn'
                            onClick={() => setEditMenuItem(item)}
                            data-bs-toggle='modal'
                            data-bs-target='#menuItemModal'
                          >
                            <Edit2 size={16} />
                          </button>
                          <button className='btn btn-sm btn-outline-danger action-btn' onClick={() => handleDeleteMenuItem(item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <ModalComponent id='categoryModal' title={editCategory ? 'Edit Category' : 'Add Category'} size='lg'>
        <form onSubmit={handleCategorySubmit}>
          <div className='mb-3'>
            <label htmlFor='categoryName' className='form-label'>
              Category Name
            </label>
            <input type='text' className='form-control' id='categoryName' name='name' value={categoryName} onChange={handleCategoryChange} required />
          </div>
          <button type='submit' className='btn btn-primary' data-bs-dismiss='modal'>
            Save
          </button>
        </form>
      </ModalComponent>

      {/* Add Menu Item Modal */}
      <ModalComponent id='menuItemModal' title={editMenuItem ? 'Edit Menu Item' : 'Add Menu Item'} size='lg'>
        <form onSubmit={handleMenuItemSubmit}>
          <div className='row g-3'>
            <div className='col-md-6'>
              <label htmlFor='itemName' className='form-label'>
                Item Name
              </label>
              <input type='text' className='form-control' id='itemName' name='name' value={menuItemData.name} onChange={handleMenuItemChange} required />
            </div>
            <div className='col-md-6'>
              <label htmlFor='itemCategory' className='form-label'>
                Category
              </label>
              <select className='form-select' id='itemCategory' name='category' value={menuItemData.category} onChange={handleMenuItemChange} required>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-12'>
              <label htmlFor='itemDescription' className='form-label'>
                Description
              </label>
              <textarea className='form-control' id='itemDescription' name='description' value={menuItemData.description} onChange={handleMenuItemChange} required />
            </div>
            <div className='col-md-6'>
              <label htmlFor='itemPrice' className='form-label'>
                Price
              </label>
              <input
                type='number'
                step='0.01'
                className='form-control'
                id='itemPrice'
                name='price.default'
                value={menuItemData.price.default}
                onChange={handleMenuItemChange}
                required
              />
            </div>
            <div className='col-md-6'>
              <label htmlFor='itemImage' className='form-label'>
                Upload Image
              </label>
              <div className='input-group'>
                <input type='file' className='form-control' id='itemImage' accept='image/*' onChange={handleImageUpload} required />
                {/* <label className='input-group-text' htmlFor='itemImage'>
                  Choose File
                </label> */}
              </div>
              {imagePreview && <img src={imagePreview} alt='Preview' className='img-thumbnail mt-2' style={{ maxWidth: '100px', height: '100px' }} />}
            </div>
          </div>
          <div className='mt-3 text-end'>
            <button type='submit' className='btn btn-primary' data-bs-dismiss='modal'>
              Save
            </button>
          </div>
        </form>
      </ModalComponent>
    </div>
  );
};

export default MenuManagement;

// import { FiCamera, FiPlay, FiEdit, FiPlusCircle } from 'react-icons/fi';
// import { BsGraphUpArrow } from 'react-icons/bs';
// import { HiOutlineTrash } from 'react-icons/hi';
// import { MdFastfood } from 'react-icons/md';
// import { ArrowRight } from 'lucide-react';

// const insights = [
//   {
//     title: 'Add photos of your top selling items',
//     link: 'View items',
//     icon: <MdFastfood size={28} className='text-gray-600' />,
//   },
//   {
//     title: 'Create add-ons to increase order value',
//     link: 'View suggestions',
//     icon: <FiPlusCircle size={28} className='text-gray-600' />,
//   },
//   {
//     title: 'Add descriptions of your top selling items',
//     link: 'View items',
//     icon: <BsGraphUpArrow size={28} className='text-gray-600' />,
//   },
//   {
//     title: 'Your menu looks well-balanced',
//     link: 'View insights',
//     icon: <HiOutlineTrash size={28} className='text-gray-600' />,
//   },
//   {
//     title: 'Your packaging charges are optimal',
//     link: 'View insights',
//     icon: <FiEdit size={28} className='text-gray-600' />,
//   },
//   {
//     title: 'Add videos on menu',
//     link: 'View insights',
//     icon: <FiPlay size={28} className='text-gray-600' />,
//   },
// ];

// const MenuManagement = () => {
//   console.log(window, 'shsjs');

//   return (
//     <div className=''>
//       <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
//         <div className='flex flex-col lg:flex-row justify-between items-stretch gap-4 mb-8'>
//           {/* Left Box with Score and Text */}
//           <div className='flex flex-col lg:flex-row justify-between items-center bg-blue-200 p-3 rounded-md w-full lg:w-3/4'>
//             <div className='flex-1'>
//               <h2 className='text-xl font-semibold text-gray-900 mb-1'>
//                 Your menu Score is <span className='font-bold'>Average</span>
//               </h2>
//               <p className='text-sm text-gray-700'>Top restaurants in your area have a menu score of 90%</p>
//               <p className='text-xs text-gray-600 mt-1'>Last updated on 5:31 pm, 29/04/2025</p>
//             </div>
//             <div className='relative w-20 h-20'>
//               <svg className='absolute inset-0 w-full h-full transform -rotate-90' viewBox='0 0 36 36'>
//                 <path
//                   className='text-orange-200'
//                   stroke='currentColor'
//                   strokeWidth='4'
//                   fill='none'
//                   d='M18 2.0845
//             a 15.9155 15.9155 0 0 1 0 31.831
//             a 15.9155 15.9155 0 0 1 0 -31.831'
//                 />
//                 <path
//                   className='text-orange-500'
//                   stroke='currentColor'
//                   strokeWidth='4'
//                   fill='none'
//                   strokeDasharray='42, 100'
//                   d='M18 2.0845
//             a 15.9155 15.9155 0 0 1 0 31.831
//             a 15.9155 15.9155 0 0 1 0 -31.831'
//                 />
//               </svg>
//               <div className='absolute inset-0 flex items-center justify-center font-semibold text-lg text-orange-600'>42%</div>
//             </div>
//           </div>

//           {/* Right Box Button */}
//           <div className='flex items-stretch lg:w-1/4'>
//             <button className='flex flex-col justify-center items-start bg-orange-50 border border-orange-200 rounded-md px-4 py-3 w-full hover:bg-orange-100 transition'>
//               <span className='flex justify-center items-center text-sm font-medium text-gray-900'>
//                 Go to Menu Editor <ArrowRight size={16} className='ml-2 text-gray-500' />
//               </span>
//               <span className='text-xs text-gray-500'>Edit menu, tax slabs and inventory</span>
//             </button>
//           </div>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//           {insights.map((card, idx) => (
//             <div key={idx} className='border border-gray-200 rounded-lg p-4 bg-white flex items-center gap-4 hover:shadow-sm transition'>
//               <div className='p-2 bg-gray-100 rounded-md'>{card.icon}</div>
//               <div>
//                 <p className='text-sm font-medium text-gray-900'>{card.title}</p>
//                 <a href='#' className='text-sm text-blue-600 hover:underline mt-1 block'>
//                   {card.link}
//                 </a>
//               </div>
//             </div>
//           ))}

//           <div className='border border-gray-200 rounded-lg p-4 bg-white flex items-center gap-4 hover:shadow-sm transition'>
//             <div className='p-2 bg-gray-100 rounded-md'>
//               <FiCamera size={28} className='text-gray-600' />
//             </div>
//             <div>
//               <p className='text-sm font-medium text-gray-900'>Request photoshoot</p>
//               <a href='#' className='text-sm text-blue-600 hover:underline mt-1 block'>
//                 Request now
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MenuManagement;
