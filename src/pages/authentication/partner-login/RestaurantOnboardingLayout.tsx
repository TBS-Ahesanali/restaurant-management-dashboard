import React, { useContext, useEffect, useRef, useState } from 'react';
import RestaurantInformationStep from './RestaurantInformation';
import RestaurantDocuments from './RestaurantDocuments';
import AuthContext from '../../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Loader from '../../../components/Loader';
import RestaurantMenuSetup from './RestaurantMenuSetup';
import RestaurantPartnerContract from './RestaurantPartnerContract';
import { SESSION_PATHS } from '../../../routes/paths';

const steps = [
  { title: 'Restaurant Information', desc: 'Location, Owner details, Open & Close hrs.' },
  { title: 'Restaurant Documents', desc: 'FSSAI, PAN, GST and Bank account.' },
  { title: 'Menu Setup', desc: 'Upload and organize your restaurant menu.' },
  { title: 'Partner Contract', desc: 'Agree and sign the partner contract.' },
];

const RestaurantOnboardingLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const emailFromNavigation = location.state?.email || '';
  const accessToken = location.state?.token || localStorage.getItem('accessToken');
  const infoStepRef = useRef<any>(null);
  const documentsStepRef = useRef<any>(null);
  const menuStepRef = useRef<any>(null);
  const contractStepRef = useRef<any>(null);
  const { restaurant, fetchRestaurantData, isRestaurantLoaded, createOrUpdateRestaurant } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      navigate(SESSION_PATHS.PARTNER_LOGIN, { replace: true });
      return;
    }

    const loadRestaurant = async () => {
      await fetchRestaurantData(accessToken);
    };

    loadRestaurant();
  }, [accessToken]);

  const handleContinue = async () => {
    try {
      // Step 0: Restaurant Information
      if (currentStep === 0) {
        await infoStepRef.current?.submit();

        if (!infoStepRef.current?.isValid) {
          enqueueSnackbar('Please fill all required fields correctly', { variant: 'error' });
          return;
        }

        setLoading(true);
        const values = infoStepRef.current.values;

        const formData = new FormData();
        if (restaurantId) formData.append('restaurant_id', restaurantId.toString());
        formData.append('full_name', values.full_name);
        formData.append('restaurant_name', values.restaurant_name);
        formData.append('address', values.address);
        formData.append('email', values.email || emailFromNavigation);
        formData.append('phone_number', values.phone_number);
        formData.append('is_step1', 'true');

        const response = await createOrUpdateRestaurant(accessToken, formData);

        if (response?.data?.data?.id || response?.data?.restaurant_id) {
          setRestaurantId(response.data.data?.id || response.data.restaurant_id);
        }

        setLoading(false);
        setCurrentStep(1);
        return;
      }

      // Step 1: Restaurant Documents
      if (currentStep === 1) {
        await documentsStepRef.current?.submit();

        if (!documentsStepRef.current?.isValid) {
          enqueueSnackbar('Please fill all required fields correctly', { variant: 'error' });
          return;
        }

        setLoading(true);
        const values = documentsStepRef.current.values;

        const formData = new FormData();
        if (restaurantId) formData.append('restaurant_id', restaurantId.toString());
        formData.append('bank_name', values.bank_name);
        formData.append('pan_number', values.pan_number);
        formData.append('gstin', values.gstin);
        formData.append('ifsc_code', values.ifsc_code);
        formData.append('account_number', values.accountNumber);
        formData.append('fssai', values.fssai);
        formData.append('is_step2', 'true');

        await createOrUpdateRestaurant(accessToken, formData);

        setLoading(false);
        setCurrentStep(2);
        return;
      }

      // Step 2: Menu Setup
      if (currentStep === 2) {
        await menuStepRef.current?.submit();

        if (!menuStepRef.current?.isValid) {
          enqueueSnackbar('Please upload menu file', { variant: 'error' });
          return;
        }

        setLoading(true);
        const values = menuStepRef.current.values;

        const formData = new FormData();
        if (restaurantId) formData.append('restaurant_id', restaurantId.toString());
        if (values.menu_file) {
          formData.append('menu_file', values.menu_file);
        }
        formData.append('is_step3', 'true');

        await createOrUpdateRestaurant(accessToken, formData);

        setLoading(false);
        setCurrentStep(3);
        return;
      }

      // Step 3: Partner Contract - FINAL STEP
      if (currentStep === 3) {
        await contractStepRef.current?.submit();

        if (!contractStepRef.current?.isValid) {
          enqueueSnackbar('Please agree to terms and conditions', { variant: 'error' });
          return;
        }

        setLoading(true);
        const values = contractStepRef.current.values;

        const formData = new FormData();
        if (restaurantId) formData.append('restaurant_id', restaurantId.toString());
        formData.append('is_contract_partner', values.is_contract_partner ? 'true' : 'false');
        formData.append('is_step4', 'true');

        // Submit the final step
        await createOrUpdateRestaurant(accessToken, formData);

        // Refresh restaurant data to get updated status
        await fetchRestaurantData(accessToken);

        setLoading(false);
        enqueueSnackbar('Restaurant onboarding completed successfully!', { variant: 'success' });

        // Navigate to pending page
        window.location.href = SESSION_PATHS.RESTAURANT_PENDING;
        return;
      }
    } catch (err: any) {
      setLoading(false);
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'An error occurred. Please try again.', { variant: 'error' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    if (!isRestaurantLoaded) {
      return <Loader />;
    }

    switch (currentStep) {
      case 0:
        return <RestaurantInformationStep ref={infoStepRef} initialData={restaurant} email={emailFromNavigation} />;
      case 1:
        return <RestaurantDocuments ref={documentsStepRef} initialData={restaurant} />;
      case 2:
        return <RestaurantMenuSetup ref={menuStepRef} initialData={restaurant} />;
      case 3:
        return <RestaurantPartnerContract ref={contractStepRef} initialData={restaurant} contractPdfUrl={restaurant?.contract_pdf_url || 'https://example.com/contract.pdf'} />;
      default:
        return null;
    }
  };

  return (
    <div className='auth-container d-flex align-items-center justify-content-center'>
      <div className='partner-login'>
        <div className='partner-login__overlay' />
        <div className='partner-login__container'>
          <div className='onboarding-container'>
            <aside className='onboarding-sidebar'>
              {steps.map((step, i) => (
                <div key={i} className={`onboarding-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}>
                  <div className='onboarding-step-index'>Step {i + 1}</div>
                  <div className='onboarding-step-title'>{step.title}</div>
                  <small>{step.desc}</small>
                </div>
              ))}
            </aside>

            <main className='onboarding-content'>
              <h2 className='onboarding-title'>{steps[currentStep].title}</h2>

              <div className='onboarding-card'>
                {renderStepContent()}

                {isRestaurantLoaded && (
                  <div className='d-flex justify-content-between mt-4'>
                    <button className='btn btn-outline-secondary' disabled={currentStep === 0 || loading} onClick={handleBack}>
                      Back
                    </button>

                    <button className='btn btn-success' onClick={handleContinue} disabled={loading}>
                      {loading ? (
                        <>
                          <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                          {currentStep === steps.length - 1 ? 'Completing...' : 'Processing...'}
                        </>
                      ) : currentStep === steps.length - 1 ? (
                        'Finish'
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOnboardingLayout;
