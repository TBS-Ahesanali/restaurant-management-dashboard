import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';

interface PartnerContractProps {
  initialData?: any;
  contractPdfUrl?: string;
}

const RestaurantPartnerContract = forwardRef<any, PartnerContractProps>(({ initialData, contractPdfUrl }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const totalPages = 9;

  useEffect(() => {
    if (initialData?.is_contract_partner) {
      setIsAgreed(initialData.is_contract_partner === true || initialData.is_contract_partner === 'true');
    }
  }, [initialData]);

  const handleDownload = () => {
    if (contractPdfUrl) {
      const link = document.createElement('a');
      link.href = contractPdfUrl;
      link.download = 'partner-contract.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      return Promise.resolve();
    },
    isValid: isAgreed,
    values: {
      is_contract_partner: isAgreed,
    },
  }));

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            <h6 className='mb-1'>Onboarding fee</h6>
            <small className='text-muted'>One-time registration charge</small>
          </div>
          <h4 className='mb-0 text-success'>₹1179</h4>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className='border rounded mb-4' style={{ backgroundColor: '#f8f9fa' }}>
        {/* PDF Controls */}
        <div className='d-flex justify-content-between align-items-center p-3 border-bottom bg-white'>
          <button className='btn btn-sm btn-outline-secondary' onClick={handlePrevPage} disabled={currentPage === 1}>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <polyline points='15 18 9 12 15 6' />
            </svg>
          </button>

          <div className='text-center'>
            <span className='fw-bold'>
              Page: {currentPage} / {totalPages}
            </span>
          </div>

          <button className='btn btn-sm btn-outline-secondary' onClick={handleNextPage} disabled={currentPage === totalPages}>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <polyline points='9 18 15 12 9 6' />
            </svg>
          </button>

          <button className='btn btn-sm btn-outline-primary ms-3 d-flex' onClick={handleDownload} disabled={!contractPdfUrl}>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='me-1'>
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='7 10 12 15 17 10' />
              <line x1='12' y1='15' x2='12' y2='3' />
            </svg>
            Download
          </button>
        </div>

        {/* PDF Content Area */}
        <div
          className='p-4 bg-white'
          style={{
            minHeight: '600px',
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          <div className='text-center mb-4'>
            <h5 className='text-uppercase fw-bold'>LETTER OF UNDERSTANDING</h5>
          </div>

          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <p>
              This Letter of Understanding ("<strong>LOU</strong>") is made on Date - <strong>12.06.2025</strong>, the "<strong>Effective Date</strong>" by and between:
            </p>

            <p>
              <strong>Swiggi Technologies Private Limited</strong>, a company registered under the Companies Act, 1956, having its registered office at Ground Floor, Opposite IIM,
              24th Cross, 26th Main, J P Nagar 1st Phase, Jumbo Guru Academy 9th Stage, Outer Ring Road, Domlrmlahalli, Varthur, Bangalore – 560 103 ("<strong>Swiggi</strong>")
              (which expression shall, unless repugnant to the meaning or context herein, be deemed to include its affiliates, successors and permitted assigns); and
            </p>

            <p className='mb-4'>
              Swiggi and the Restaurant Participant/ Merchant are hereinafter jointly referred to as the "<strong>Parties</strong>" and each, individually a "<strong>Party</strong>
              ", as the context may so require.
            </p>

            <p className='fw-bold mb-3'>NOW THEREFORE, THE PARTIES HEREBY AGREE AND CONTRACT AS FOLLOWS:</p>

            <p>
              Capitalised terms used but not defined herein shall have the meaning assigned to them under the Merchant Terms of Use available at
              https://partner.swiggi.com/merchants ("<strong>Merchant Terms</strong>").
            </p>

            <ol>
              <li className='mb-3'>
                Merchants understands that Swiggi is engaged in the business of inter alia operating an online platform under the brand name and style <strong>Swiggi</strong>{' '}
                through the Swiggi app and website ("<strong>Platform</strong>") for processing and presenting to consumers a variety of ready-to-eat food products (in standard)
                menu format ("<strong>Merchant food products</strong>") ordered by merchants.
              </li>

              <li className='mb-3'>
                The Merchant represents that it is in compliance with the business of food retail under the brand name and style <strong>Unifor Cafe</strong> serving food products
                and beverages through its multiple outlets owned and managed by the Merchant ring and not the business ("<strong>Business</strong>").
              </li>

              <li className='mb-3'>
                The Merchant shall pay Rs. ₹1179 - <strong>Value towards Service Fee</strong> to Swiggi for a period of 2 months from the effective Date. Post the expiry of
                aforesaid period of 2 months, the Parties shall conclude either on the Service Fee as defined in Merchant Terms of Use OR, a new transaction on any new Service Fees
                structure, the terms and conditions for which may vary.
              </li>
            </ol>

            {currentPage === 9 && (
              <div className='mt-5 pt-4 border-top'>
                <p className='text-muted small'>
                  By checking the box below, you acknowledge that you have read, understood, and agree to be bound by the terms and conditions of this Partner Contract.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className='border rounded p-4 bg-light'>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            id='agreeContract'
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label className='form-check-label ms-2' htmlFor='agreeContract' style={{ cursor: 'pointer', lineHeight: '1.8' }}>
            I have read and agree to the <strong>Partner Contract Terms and Conditions</strong>. I understand the commission structure, payment terms, and other charges as outlined
            in the document.
          </label>
        </div>

        {!isAgreed && <small className='text-danger d-block mt-2'>* You must agree to the terms and conditions to continue</small>}
      </div>

      <div className='alert alert-info mt-3'>
        <small>
          <strong>Note:</strong> Commission details, payment terms, and other charges are mentioned in the contract document above. Please review all pages carefully before
          agreeing.
        </small>
      </div>
    </div>
  );
});

RestaurantPartnerContract.displayName = 'RestaurantPartnerContract';

export default RestaurantPartnerContract;
