export type RestaurantStatus = 'Approved' | 'Pending' | 'Rejected';

export const getStatusColor = (status: RestaurantStatus) => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'Rejected':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'Pending':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};
