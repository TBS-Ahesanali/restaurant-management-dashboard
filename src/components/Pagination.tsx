import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const Pagination = ({ totalItems, currentPage, rowsPerPage, rowsPerPageOptions = [10, 20, 50, 100], onPageChange, onRowsPerPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  if (totalItems === 0) return null;

  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className='px-6 py-4 border-t bg-white flex flex-col sm:flex-row items-center justify-end gap-6'>
      {/* Rows per page */}
      <div className='flex items-center gap-2 text-sm text-gray-600'>
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className='border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#ff4d4d]'
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Range info */}
      <div className='text-sm text-gray-600'>
        {start}–{end} of {totalItems}
      </div>

      {/* Prev / Next */}
      <div className='flex items-center gap-1'>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className='p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40'>
          <ChevronLeft size={18} />
        </button>

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className='p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40'>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
