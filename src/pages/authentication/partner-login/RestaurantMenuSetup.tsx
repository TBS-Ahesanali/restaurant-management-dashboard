import React, { useState, forwardRef, useImperativeHandle } from 'react';

interface MenuSetupProps {
  initialData?: any;
}

const RestaurantMenuSetup = forwardRef<any, MenuSetupProps>(({ initialData }, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const acceptedFormats = ['.jpg', '.png', '.docx', '.xlsx', '.pdf'];
  const maxFileSize = 25 * 1024 * 1024; // 25 MB

  const validateFile = (file: File): boolean => {
    setUploadError('');

    if (file.size > maxFileSize) {
      setUploadError('File size exceeds 25 MB limit');
      return false;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setUploadError('Invalid file format. Please upload jpg, png, docx, xlsx, or pdf');
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError('');
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      return Promise.resolve();
    },
    isValid: selectedFile !== null,
    values: {
      menu_file: selectedFile,
    },
  }));

  return (
    <div className='mb-4'>
      <h5 className='mb-3'>Upload your menu</h5>

      <div className='bg-light p-3 rounded mb-3'>
        <h6 className='text-primary mb-2'>Requirements:</h6>
        <ul className='small text-muted mb-0' style={{ lineHeight: '1.8' }}>
          <li>
            Upload <strong>clear menu card photos</strong> or as a <strong>word/excel file</strong>. Item names prices should be readable.
          </li>
          <li>
            Menu should be in <strong>English</strong> only.
          </li>
          <li>
            Every item should have <strong>price mentioned</strong> against it.
          </li>
          <li>
            Max file size: <strong>25 MB</strong> (.jpg, .png, .docx, .xlsx, .pdf)
          </li>
        </ul>
      </div>

      <div
        className={`border rounded p-4 text-center ${isDragging ? 'border-primary bg-light' : 'border-2 border-dashed'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundColor: isDragging ? '#f8f9fa' : '#fff5f0',
          transition: 'all 0.3s ease',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!selectedFile ? (
          <>
            <div className='mb-3'>
              <svg width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#ff6b35' strokeWidth='2'>
                <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                <polyline points='17 8 12 3 7 8' />
                <line x1='12' y1='3' x2='12' y2='15' />
              </svg>
            </div>

            <h6 className='mb-2' style={{ color: '#ff6b35' }}>
              <strong>Add your menu</strong>
            </h6>

            <p className='text-muted small mb-3'>Drag and drop your file here or</p>

            <label htmlFor='fileInput' className='btn btn-outline-primary btn-sm' style={{ cursor: 'pointer' }}>
              Browse Files
            </label>

            <input id='fileInput' type='file' className='d-none' accept='.jpg,.png,.docx,.xlsx,.pdf' onChange={handleFileSelect} />
          </>
        ) : (
          <div className='w-100'>
            <div className='d-flex align-items-center justify-content-between bg-white border rounded p-3'>
              <div className='d-flex align-items-center'>
                <div
                  className='me-3 d-flex align-items-center justify-content-center rounded'
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#e8f5e9',
                  }}
                >
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#4caf50' strokeWidth='2'>
                    <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' />
                    <polyline points='13 2 13 9 20 9' />
                  </svg>
                </div>

                <div>
                  <div className='fw-bold'>{selectedFile.name}</div>
                  <small className='text-muted'>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
              </div>

              <button type='button' className='btn btn-sm btn-outline-danger' onClick={handleRemoveFile}>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className='alert alert-danger mt-3 mb-0'>
          <small>{uploadError}</small>
        </div>
      )}
    </div>
  );
});

RestaurantMenuSetup.displayName = 'RestaurantMenuSetup';

export default RestaurantMenuSetup;
