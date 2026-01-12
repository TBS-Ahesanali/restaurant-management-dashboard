import { useState } from 'react';
import { Calendar, Clock, Users, Edit2, Trash2, Plus } from 'lucide-react';

interface Booking {
  id: string;
  guestName: string;
  guestPhoto: string;
  contactNumber: string;
  date: string;
  time: string;
  table: {
    number: number;
    location: string;
  };
  guests: number;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

const BookingsPage = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      guestName: 'Michael Johnson',
      guestPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      contactNumber: '+1 234 567 890',
      date: 'Jan 15, 2025',
      time: '19:00',
      table: {
        number: 12,
        location: 'Window Side',
      },
      guests: 4,
      specialRequests: 'Birthday Celebration',
      status: 'Confirmed',
    },
    {
      id: '2',
      guestName: 'Sarah Williams',
      guestPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      contactNumber: '+1 345 678 901',
      date: 'Jan 15, 2025',
      time: '12:30',
      table: {
        number: 5,
        location: 'Indoor',
      },
      guests: 2,
      status: 'Pending',
    },
  ]);

  return (
    <div className='container-fluid p-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h1 className='h3 mb-1'>Bookings</h1>
          <div className='d-flex align-items-center gap-2'>
            <span className='badge bg-primary'>12 Today</span>
          </div>
        </div>
        <button className='btn btn-primary d-flex align-items-center gap-2'>
          <Plus size={18} />
          New Booking
        </button>
      </div>

      <div className='card mb-4'>
        <div className='card-body p-0'>
          <div className='row g-0'>
            <div className='col-md-3 border-end p-3'>
              <div className='input-group'>
                <input type='date' className='form-control' defaultValue='2025-01-15' />
              </div>
            </div>
            <div className='col-md-3 border-end p-3'>
              <select className='form-select'>
                <option>All Time Slots</option>
                <option>Lunch (11:00 - 15:00)</option>
                <option>Dinner (18:00 - 23:00)</option>
              </select>
            </div>
            <div className='col-md-3 border-end p-3'>
              <select className='form-select'>
                <option>All Tables</option>
                <option>Window Side</option>
                <option>Indoor</option>
                <option>Outdoor</option>
              </select>
            </div>
            <div className='col-md-3 p-3'>
              <input type='search' className='form-control' placeholder='Search bookings...' />
            </div>
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-body p-0'>
          <div className='table-responsive'>
            <table className='table table-hover align-middle mb-0'>
              <thead className='bg-light'>
                <tr>
                  <th>Guest Name</th>
                  <th>Date & Time</th>
                  <th>Table</th>
                  <th>Guests</th>
                  <th>Special Requests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className='d-flex align-items-center gap-3'>
                        <img src={booking.guestPhoto} alt={booking.guestName} className='rounded-circle' width='40' height='40' />
                        <div>
                          <h6 className='mb-0'>{booking.guestName}</h6>
                          <small className='text-muted'>{booking.contactNumber}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center gap-2'>
                        <Calendar size={16} className='text-muted' />
                        {booking.date}
                        <Clock size={16} className='text-muted ms-2' />
                        {booking.time}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>Table {booking.table.number}</div>
                        <small className='text-muted'>{booking.table.location}</small>
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center gap-2'>
                        <Users size={16} className='text-muted' />
                        {booking.guests}
                      </div>
                    </td>
                    <td>{booking.specialRequests ? <span className='badge bg-info bg-opacity-10 text-info'>{booking.specialRequests}</span> : <span>-</span>}</td>
                    <td>
                      <span className={`badge ${booking.status === 'Confirmed' ? 'bg-success' : booking.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>{booking.status}</span>
                    </td>
                    <td>
                      <div className='d-flex gap-2'>
                        <button className='btn btn-sm btn-outline-primary action-btn'>
                          <Edit2 size={16} />
                        </button>
                        <button className='btn btn-sm btn-outline-danger action-btn'>
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

      <div className='d-flex justify-content-between align-items-center mt-4'>
        <div className='text-muted'>Showing 1 to 10 of 45 entries</div>
        <nav>
          <ul className='pagination mb-0'>
            <li className='page-item'>
              <button className='page-link'>Previous</button>
            </li>
            <li className='page-item active'>
              <button className='page-link'>1</button>
            </li>
            <li className='page-item'>
              <button className='page-link'>2</button>
            </li>
            <li className='page-item'>
              <button className='page-link'>3</button>
            </li>
            <li className='page-item'>
              <button className='page-link'>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BookingsPage;
