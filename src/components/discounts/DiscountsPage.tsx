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
      validTill: 'Dec 31, 2025',
      status: 'Active',
      icon: <List className='text-primary' size={24} />,
    },
    {
      id: '2',
      type: 'product',
      title: 'Buy 1 Get 1 Free',
      description: 'On selected pizza varieties',
      value: '100%',
      validTill: 'Dec 31, 2025',
      status: 'Active',
      icon: <Gift className='text-warning' size={24} />,
    },
    {
      id: '3',
      type: 'promo',
      title: 'WELCOME25',
      description: '25% off on first order',
      value: '25%',
      validTill: 'Dec 31, 2025',
      status: 'Ending Soon',
      usage: '45/100',
      icon: <Ticket className='text-info' size={24} />,
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
  console.log('newDiscount: ', newDiscount);

  const handleChangeNew = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewDiscount({ ...newDiscount, [e.target.name]: e.target.value });
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (currentDiscount) {
      setCurrentDiscount({ ...currentDiscount, [e.target.name]: e.target.value });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Gift size={24} className='text-warning' />;
      case 'promo':
        return <Ticket size={24} className='text-info' />;
      default:
        return <List size={24} className='text-primary' />;
    }
  };

  const handleAddOffer = () => {
    const newOffer: Discount = { id: uuidv4(), ...newDiscount, icon: getIcon(newDiscount.type) };
    setDiscounts((prev) => [...prev, newOffer]);
    setNewDiscount({ type: 'category', title: '', description: '', value: '', validTill: '', status: 'Active' });
  };
  const handleEditOffer = () => {
    if (currentDiscount) {
      setDiscounts(discounts.map((d) => (d.id === currentDiscount.id ? currentDiscount : d)));
    }
  };

  const handleDeleteOffer = () => {
    setDiscounts(discounts.filter((d) => d.id !== currentDiscount?.id));
  };
  return (
    <div className='container-fluid p-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h1 className='h3 mb-1'>Discounts & Offers</h1>
        </div>
        <button className='btn btn-primary d-flex align-items-center gap-2' data-bs-toggle='modal' data-bs-target='#newOfferModal'>
          <Plus size={18} />
          New Offer
        </button>
      </div>

      <div className='row g-4'>
        {discounts.map((discount) => (
          <div key={discount.id} className='col-md-4'>
            <div className='card h-100'>
              <div className='card-body'>
                <div className='d-flex justify-content-between align-items-start mb-3'>
                  <div className='d-flex gap-3'>
                    <div className='stat-icon rounded-circle p-2 bg-light'>{discount.icon}</div>
                    <div>
                      <h5 className='card-title mb-1'>{discount.title}</h5>
                      <p className='text-muted mb-0'>{discount.description}</p>
                    </div>
                  </div>
                  <div className='dropdown'>
                    <button className='btn btn-link p-0' type='button' data-bs-toggle='dropdown'>
                      <i className='bi bi-three-dots-vertical'></i>
                    </button>
                    <ul className='dropdown-menu'>
                      <li>
                        <button className='dropdown-item'>Edit</button>
                      </li>
                      <li>
                        <button className='dropdown-item text-danger'>Delete</button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div>
                    <small className='text-muted d-block'>Valid till</small>
                    <span>{discount.validTill}</span>
                  </div>
                  {discount.usage && (
                    <div className='text-end'>
                      <small className='text-muted d-block'>Usage</small>
                      <span>{discount.usage}</span>
                    </div>
                  )}
                </div>

                <div className='d-flex justify-content-between align-items-center'>
                  <span className={`badge ${discount.status === 'Active' ? 'bg-success' : discount.status === 'Inactive' ? 'bg-secondary' : 'bg-warning'}`}>{discount.status}</span>
                  <div className='d-flex gap-2'>
                    <button
                      className='btn btn-sm btn-outline-primary action-btn'
                      data-bs-toggle='modal'
                      data-bs-target='#editOfferModal'
                      onClick={() => setCurrentDiscount(discount)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className='btn btn-sm btn-outline-danger action-btn'
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
          </div>
        ))}
      </div>

      <ModalComponent
        id='newOfferModal'
        title='Add New Offer'
        footer={
          <>
            <button className='btn btn-secondary' data-bs-dismiss='modal'>
              Close
            </button>
            <button className='btn btn-primary' data-bs-dismiss='modal' onClick={handleAddOffer}>
              Save Offer
            </button>
          </>
        }
      >
        <form>
          <div className='mb-3'>
            <label className='form-label'>Offer Type</label>
            <select className='form-select' name='type' value={newDiscount.type} onChange={handleChangeNew}>
              <option>Category Discount</option>
              <option>Product Discount</option>
              <option>Promo Code</option>
              <option>Buy One Get One</option>
            </select>
          </div>

          <div className='mb-3'>
            <label className='form-label'>Title</label>
            <input type='text' className='form-control' name='title' placeholder='Enter offer title' value={newDiscount.title} onChange={handleChangeNew} />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Discount Value</label>
            <input type='text' className='form-control' name='value' placeholder='Enter percentage or amount' value={newDiscount.value} onChange={handleChangeNew} />
          </div>
          <div className='mb-3'>
            <label className='form-label'>Description</label>
            <input type='text' className='form-control' name='description' placeholder='Enter percentage or amount' value={newDiscount?.description} onChange={handleChangeNew} />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Valid Till</label>
            <input type='date' className='form-control' name='validTill' value={newDiscount.validTill} onChange={handleChangeNew} />
          </div>
        </form>
      </ModalComponent>

      <ModalComponent
        id='editOfferModal'
        title='Edit New Offer'
        footer={
          <>
            <button className='btn btn-secondary' data-bs-dismiss='modal'>
              Close
            </button>
            <button className='btn btn-primary' onClick={handleEditOffer} data-bs-dismiss='modal'>
              Save Offer
            </button>
          </>
        }
      >
        <form>
          <div className='mb-3'>
            <label className='form-label'>Offer Type</label>
            <select className='form-select' name='type' value={currentDiscount?.type || ''} onChange={handleChangeEdit}>
              <option>Category Discount</option>
              <option>Product Discount</option>
              <option>Promo Code</option>
              <option>Buy One Get One</option>
            </select>
          </div>

          <div className='mb-3'>
            <label className='form-label'>Title</label>
            <input type='text' className='form-control' name='title' placeholder='Enter offer title' value={currentDiscount?.title || ''} onChange={handleChangeEdit} />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Discount Value</label>
            <input type='text' className='form-control' name='value' placeholder='Enter percentage or amount' value={currentDiscount?.value || ''} onChange={handleChangeEdit} />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Description</label>
            <input
              type='text'
              className='form-control'
              name='description'
              placeholder='Enter percentage or amount'
              value={currentDiscount?.description || ''}
              onChange={handleChangeEdit}
            />
          </div>
          <div className='mb-3'>
            <label className='form-label'>Valid Till</label>
            <input type='date' className='form-control' name='validTill' value={currentDiscount?.validTill || ''} onChange={handleChangeEdit} />
          </div>
        </form>
      </ModalComponent>

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
        <p>Are you sure you want to delete this offer?</p>
      </ModalComponent>
    </div>
  );
};

export default DiscountsPage;
