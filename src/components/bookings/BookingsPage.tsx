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
      guestPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      contactNumber: '+1 234 567 890',
      date: 'Jan 15, 2025',
      time: '19:00',
      table: { number: 12, location: 'Window Side' },
      guests: 4,
      specialRequests: 'Birthday Celebration',
      status: 'Confirmed',
    },
    {
      id: '2',
      guestName: 'Sarah Williams',
      guestPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      contactNumber: '+1 345 678 901',
      date: 'Jan 15, 2025',
      time: '12:30',
      table: { number: 5, location: 'Indoor' },
      guests: 2,
      status: 'Pending',
    },
  ]);

  return (
    <div className='p-6'>
      <div className='max-w-full mx-auto space-y-6'>
        {/* HEADER */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Bookings</h1>
            <p className='text-gray-600'>
              <span className='inline-block bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full mt-1'>12 Today</span>
            </p>
          </div>

          <button className='bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-4 py-2 rounded-lg flex items-center gap-2'>
            <Plus size={18} />
            New Booking
          </button>
        </div>

        {/* FILTERS */}
        <div className='bg-white border border-gray-200 rounded-2xl p-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <input type='date' defaultValue='2025-01-15' className='rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#ff4d4d]' />

            <select className='rounded-lg border border-gray-300 px-3 py-2'>
              <option>All Time Slots</option>
              <option>Lunch (11:00 - 15:00)</option>
              <option>Dinner (18:00 - 23:00)</option>
            </select>

            <select className='rounded-lg border border-gray-300 px-3 py-2'>
              <option>All Tables</option>
              <option>Window Side</option>
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>

            <input type='search' placeholder='Search bookings...' className='rounded-lg border border-gray-300 px-3 py-2' />
          </div>
        </div>

        {/* TABLE */}
        <div className='bg-white border border-gray-200 rounded-2xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50'>
                <tr className='text-left text-sm text-gray-600'>
                  <th className='px-5 py-3'>Guest</th>
                  <th className='px-5 py-3'>Date & Time</th>
                  <th className='px-5 py-3'>Table</th>
                  <th className='px-5 py-3'>Guests</th>
                  <th className='px-5 py-3'>Request</th>
                  <th className='px-5 py-3'>Status</th>
                  <th className='px-5 py-3 text-right'>Actions</th>
                </tr>
              </thead>

              <tbody className='divide-y'>
                {bookings.map((booking) => (
                  <tr key={booking.id} className='hover:bg-gray-50 transition'>
                    {/* Guest */}
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-3'>
                        <img src={booking.guestPhoto} className='w-10 h-10 rounded-full object-cover' />
                        <div>
                          <div className='font-medium text-gray-900'>{booking.guestName}</div>
                          <div className='text-sm text-gray-500'>{booking.contactNumber}</div>
                        </div>
                      </div>
                    </td>

                    {/* Date Time */}
                    <td className='px-5 py-4 text-sm text-gray-700'>
                      <div className='flex items-center gap-2'>
                        <Calendar size={14} />
                        {booking.date}
                        <Clock size={14} className='ml-2' />
                        {booking.time}
                      </div>
                    </td>

                    {/* Table */}
                    <td className='px-5 py-4 text-sm'>
                      <div className='font-medium'>Table {booking.table.number}</div>
                      <div className='text-gray-500'>{booking.table.location}</div>
                    </td>

                    {/* Guests */}
                    <td className='px-5 py-4 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Users size={14} />
                        {booking.guests}
                      </div>
                    </td>

                    {/* Special Request */}
                    <td className='px-5 py-4 text-sm'>
                      {booking.specialRequests ? (
                        <span className='bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium'>{booking.specialRequests}</span>
                      ) : (
                        <span className='text-gray-400'>—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className='px-5 py-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : booking.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className='px-5 py-4'>
                      <div className='flex justify-end gap-2'>
                        {/* Edit */}
                        <button
                          className='w-9 h-9 rounded-md bg-[#ff4d4d]/10 text-[#ff4d4d]
                                     flex items-center justify-center hover:bg-[#ff4d4d]/20 transition'
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          className='w-9 h-9 rounded-md bg-red-50 text-red-600
                                     flex items-center justify-center hover:bg-red-100 transition'
                        >
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

        {/* PAGINATION */}
        <div className='flex justify-between items-center text-sm text-gray-600'>
          <span>Showing 1 to 10 of 45 entries</span>
          <div className='flex gap-2'>
            <button className='px-3 py-1 border rounded-lg'>Previous</button>
            <button className='px-3 py-1 bg-[#ff4d4d] text-white rounded-lg'>1</button>
            <button className='px-3 py-1 border rounded-lg'>2</button>
            <button className='px-3 py-1 border rounded-lg'>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
