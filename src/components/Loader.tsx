const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='text-center'>
        <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ff4d4d] mb-4'></div>
        {/* <p className='text-lg font-semibold text-gray-700'>Loading restaurants...</p> */}
      </div>
    </div>
  );
};

export default Loader;
