import React, { useState } from 'react';
import { Edit2, Trash2, Plus, List, Gift, Ticket } from 'lucide-react';
import ModalComponent from '../ModalComponent';
import { v4 as uuidv4 } from 'uuid';

interface Discount {
  id: string;
  type: string;
  title: string;
  description: string;
  value: string;
  validTill: string;
  status: string;
  usage?: string;
  icon: React.ReactNode;
}

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: '1',
      type: 'category',
      title: 'Desserts Special',
      description: '20% off on all dessert items',
      value: '20%',
      validTill: '2025-12-31',
      status: 'Active',
      icon: <List size={22} className='text-[#ff4d4d]' />,
    },
    {
      id: '2',
      type: 'product',
      title: 'Buy 1 Get 1 Free',
      description: 'On selected pizza varieties',
      value: '100%',
      validTill: '2025-12-31',
      status: 'Active',
      icon: <Gift size={22} className='text-[#ff4d4d]' />,
    },
    {
      id: '3',
      type: 'promo',
      title: 'WELCOME25',
      description: '25% off on first order',
      value: '25%',
      validTill: '2025-12-31',
      status: 'Ending Soon',
      usage: '45/100',
      icon: <Ticket size={22} className='text-[#ff4d4d]' />,
    },
  ]);

  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
  const [newDiscount, setNewDiscount] = useState<Omit<Discount, 'id' | 'icon'>>({
    type: 'category',
    title: '',
    description: '',
    value: '',
    validTill: '',
    status: 'Active',
  });

  /* ================= HANDLERS ================= */

  const handleChangeNew = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewDiscount({ ...newDiscount, [e.target.name]: e.target.value });
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (currentDiscount) {
      setCurrentDiscount({ ...currentDiscount, [e.target.name]: e.target.value });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Gift size={22} className='text-[#ff4d4d]' />;
      case 'promo':
        return <Ticket size={22} className='text-[#ff4d4d]' />;
      default:
        return <List size={22} className='text-[#ff4d4d]' />;
    }
  };

  const handleAddOffer = () => {
    const newOffer: Discount = {
      id: uuidv4(),
      ...newDiscount,
      icon: getIcon(newDiscount.type),
    };
    setDiscounts((prev) => [...prev, newOffer]);
    setNewDiscount({
      type: 'category',
      title: '',
      description: '',
      value: '',
      validTill: '',
      status: 'Active',
    });
  };

  const handleEditOffer = () => {
    if (currentDiscount) {
      setDiscounts((prev) => prev.map((d) => (d.id === currentDiscount.id ? currentDiscount : d)));
    }
  };

  const handleDeleteOffer = () => {
    setDiscounts((prev) => prev.filter((d) => d.id !== currentDiscount?.id));
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

          <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-4 py-2 rounded-lg flex items-center gap-2' data-bs-toggle='modal' data-bs-target='#newOfferModal'>
            <Plus size={18} />
            New Offer
          </button>
        </div>

        {/* DISCOUNT CARDS */}
        <div className='row g-4'>
          {discounts.map((discount) => (
            <div key={discount.id} className='col-md-4'>
              <div className='bg-white border border-gray-200 rounded-2xl p-4 h-100 hover:shadow-md transition'>
                {/* TOP SECTION */}
                <div className='flex items-start gap-3'>
                  <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0'>{discount.icon}</div>

                  <div>
                    <h4 className='text-base font-semibold text-gray-900 leading-tight'>{discount.title}</h4>
                    <p className='text-sm text-gray-500 mt-0.5'>{discount.description}</p>
                  </div>
                </div>

                {/* META INFO */}
                <div className='flex justify-between text-sm text-gray-600 mt-4'>
                  <div>
                    <span className='block text-xs text-gray-400'>Valid till</span>
                    <span>{discount.validTill}</span>
                  </div>

                  {discount.usage && (
                    <div className='text-right'>
                      <span className='block text-xs text-gray-400'>Usage</span>
                      <span>{discount.usage}</span>
                    </div>
                  )}
                </div>

                {/* DIVIDER */}
                <div className='border-t border-gray-100 my-2' />

                {/* FOOTER */}
                <div className='flex justify-between items-center'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      discount.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : discount.status === 'Ending Soon'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {discount.status}
                  </span>

                  <div className='flex gap-3'>
                    <button
                      className='w-9 h-9 rounded-md bg-[#ff4d4d]/10 flex items-center justify-center text-[#ff4d4d] hover:bg-[#ff4d4d]/20 transition'
                      data-bs-toggle='modal'
                      data-bs-target='#editOfferModal'
                      onClick={() => setCurrentDiscount(discount)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className='w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition'
                      data-bs-toggle='modal'
                      data-bs-target='#deleteOfferModal'
                      onClick={() => setCurrentDiscount(discount)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= NEW OFFER MODAL ================= */}
        <ModalComponent
          id='newOfferModal'
          title='Add New Offer'
          footer={
            <div className='flex justify-end gap-3'>
              <button className='btn btn-secondary' data-bs-dismiss='modal'>
                Cancel
              </button>
              <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg' data-bs-dismiss='modal' onClick={handleAddOffer}>
                Save
              </button>
            </div>
          }
        >
          <form className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Offer Type</label>
              <select className='form-control rounded-lg' name='type' value={newDiscount.type} onChange={handleChangeNew}>
                <option value='category'>Category Discount</option>
                <option value='product'>Product Discount</option>
                <option value='promo'>Promo Code</option>
                <option value='bogo'>Buy One Get One</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
              <input type='text' className='form-control rounded-lg' name='title' placeholder='e.g. Desserts Special' value={newDiscount.title} onChange={handleChangeNew} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Discount Value</label>
                <input type='text' className='form-control rounded-lg' name='value' placeholder='e.g. 20%' value={newDiscount.value} onChange={handleChangeNew} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Valid Till</label>
                <input type='date' className='form-control rounded-lg' name='validTill' value={newDiscount.validTill} onChange={handleChangeNew} />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
              <textarea
                className='form-control rounded-lg'
                rows={3}
                name='description'
                placeholder='Short description about this offer'
                value={newDiscount.description}
                onChange={handleChangeNew}
              />
            </div>
          </form>
        </ModalComponent>

        {/* ================= EDIT OFFER MODAL ================= */}
        <ModalComponent
          id='editOfferModal'
          title='Edit Offer'
          footer={
            <div className='flex justify-end gap-3'>
              <button className='btn btn-secondary' data-bs-dismiss='modal'>
                Cancel
              </button>
              <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2 rounded-lg' data-bs-dismiss='modal' onClick={handleEditOffer}>
                Save
              </button>
            </div>
          }
        >
          <form className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
              <input className='form-control rounded-lg' name='title' value={currentDiscount?.title || ''} onChange={handleChangeEdit} />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Discount Value</label>
              <input className='form-control rounded-lg' name='value' value={currentDiscount?.value || ''} onChange={handleChangeEdit} />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
              <textarea className='form-control rounded-lg' rows={3} name='description' value={currentDiscount?.description || ''} onChange={handleChangeEdit} />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Valid Till</label>
              <input type='date' className='form-control rounded-lg' name='validTill' value={currentDiscount?.validTill || ''} onChange={handleChangeEdit} />
            </div>
          </form>
        </ModalComponent>

        {/* ================= DELETE MODAL ================= */}
        <ModalComponent
          id='deleteOfferModal'
          title='Delete Offer'
          footer={
            <>
              <button className='btn btn-secondary' data-bs-dismiss='modal'>
                Cancel
              </button>
              <button className='btn btn-danger' data-bs-dismiss='modal' onClick={handleDeleteOffer}>
                Delete Offer
              </button>
            </>
          }
        >
          <p className='text-gray-700'>Are you sure you want to delete this offer?</p>
        </ModalComponent>
      </div>
    </div>
  );
};

export default DiscountsPage;
