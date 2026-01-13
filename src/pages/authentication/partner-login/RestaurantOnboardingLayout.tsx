import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RestaurantInformationStep from './RestaurantInformation';
import RestaurantDocuments from './RestaurantDocuments';
import AuthContext from '../../../contexts/AuthContext';
// import axiosInstance from '../utils/axios';

const steps = [
  { title: 'Restaurant Information', desc: 'Location, Owner details, Open & Close hrs.' },
  { title: 'Restaurant Documents', desc: 'FSSAI, PAN, GST and Bank account.' },
  { title: 'Menu Setup', desc: 'Upload and organize your restaurant menu.' },
  { title: 'Partner Contract', desc: 'Agree and sign the partner contract.' },
];

const RestaurantOnboardingLayout: React.FC = () => {
  const location = useLocation();
  const responseData = location.state?.data;
  const infoStepRef = useRef<any>(null);
  const documentsStepRef = useRef<any>(null);
  const { getRestaurant, createOrUpdateRestaurant } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  console.log('restaurantData: ', restaurantData);

  // Set initial step from responseData if available
  // useEffect(() => {
  //   if (responseData?.next_step !== undefined && responseData?.next_step !== null) {
  //     // next_step is 1-indexed (1, 2, 3, 4), convert to 0-indexed (0, 1, 2, 3)
  //     const stepIndex = Math.max(0, Math.min(responseData.next_step - 1, steps.length - 1));
  //     setCurrentStep(stepIndex);
  //     console.log(`Setting initial step to ${stepIndex} from responseData.next_step: ${responseData.next_step}`);

  //     // Set restaurant data from responseData
  //     setRestaurantData(responseData);

  //     // Set restaurant ID if available
  //     if (responseData.restaurant_id || responseData.id) {
  //       setRestaurantId(responseData.restaurant_id || responseData.id);
  //     }
  //   }
  // }, [responseData]);

  // Fetch existing restaurant data on mount
  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setFetchingData(true);
      const response = await getRestaurant();

      if (response) {
        const data = response.data;
        setRestaurantData(data);
      }
    } catch (error: any) {
      console.log('No existing data found:', error);
      setCurrentStep(0);
    } finally {
      setFetchingData(false);
    }
  };

  // Single API endpoint
  // const createOrUpdateRestaurant = async (payload: any) => {
  //   try {
  //     const response = await axiosInstance.post('/admin_control/restaurant-creation', payload);
  //     return response.data;
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     throw error;
  //   }
  // };

  const handleContinue = async () => {
    setError('');

    try {
      // Step 0: Restaurant Information
      if (currentStep === 0) {
        await infoStepRef.current?.submit();

        if (!infoStepRef.current?.isValid) {
          setError('Please fill all required fields correctly');
          return;
        }

        setLoading(true);
        const values = infoStepRef.current.values;

        const step1Payload = {
          owner_full_name: values.ownerName,
          restaurant_name: values.restaurantName,
          address: values.address,
          owner_email: values.email,
          owner_phone_number: parseInt(values.mobile),
          whatsapp_number: values.whatsappSame ? parseInt(values.mobile) : parseInt(values.whatsappNumber || values.mobile),
          is_step1: true,
        };

        console.log('Step 1 API PAYLOAD 👉', step1Payload);
        // const response = await createOrUpdateRestaurant(step1Payload);
        const response = { restaurant_id: 'demo_restaurant_123', id: '' }; // Mock response

        if (response?.restaurant_id || response?.id) {
          setRestaurantId(response.restaurant_id || response.id);
        }

        setLoading(false);
        setCurrentStep(1);
        return;
      }

      // Step 1: Restaurant Documents
      if (currentStep === 1) {
        await documentsStepRef.current?.submit();

        if (!documentsStepRef.current?.isValid) {
          setError('Please fill all required fields correctly');
          return;
        }

        setLoading(true);
        const values = documentsStepRef.current.values;

        const step2Payload = {
          ...(restaurantId && { restaurant_id: restaurantId }),
          owner_full_name: values.ownerName,
          restaurant_name: values.restaurantName,
          address: values.address,
          owner_email: values.email,
          owner_phone_number: parseInt(values.mobile),
          whatsapp_number: values.whatsappSame ? parseInt(values.mobile) : parseInt(values.whatsappNumber || values.mobile),
          pan: values.pan,
          gstin: values.gstin,
          ifsc_code: values.ifsc,
          account_number: values.accountNumber,
          fssai: values.fssai,
          is_step2: true,
        };

        console.log('Step 2 API PAYLOAD 👉', step2Payload);
        // await createOrUpdateRestaurant(step2Payload);

        setLoading(false);
        setCurrentStep(2);
        return;
      }

      // Step 2: Menu Setup
      if (currentStep === 2) {
        setLoading(true);

        const step3Payload = {
          restaurant_id: restaurantId,
          is_step3: true,
          // Add menu fields when ready
        };

        console.log('Step 3 API PAYLOAD 👉', step3Payload);
        // await createOrUpdateRestaurant(step3Payload);

        setLoading(false);
        setCurrentStep(3);
        return;
      }

      // Step 3: Partner Contract
      if (currentStep === 3) {
        setLoading(true);

        const step4Payload = {
          restaurant_id: restaurantId,
          is_step4: true,
          // Add contract fields when ready
        };

        console.log('Step 4 API PAYLOAD 👉', step4Payload);
        // await createOrUpdateRestaurant(step4Payload);

        setLoading(false);
        alert('Restaurant onboarding completed!');
        // navigate('/dashboard');
        return;
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || err?.message || 'An error occurred. Please try again.');
      console.error('Error:', err);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    if (fetchingData) {
      return (
        <div className='text-center py-5'>
          <div className='spinner-border text-success' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-3 text-muted'>Loading restaurant data...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return <RestaurantInformationStep ref={infoStepRef} initialData={restaurantData} />;
      case 1:
        return (
          <RestaurantDocuments
            data={responseData}
            // ref={documentsStepRef}
            updateData={responseData}
          />
        );
      case 2:
        return (
          <div className='p-4'>
            <p>📋 Menu setup coming soon</p>
            <small className='text-muted'>Upload and organize your restaurant menu</small>
          </div>
        );
      case 3:
        return (
          <div className='p-4'>
            <p>📝 Partner contract coming soon</p>
            <small className='text-muted'>Review and sign the partnership agreement</small>
          </div>
        );
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

              {/* {error && (
                <div className='alert alert-danger alert-dismissible fade show' role='alert'>
                  {error}
                  <button type='button' className='btn-close' onClick={() => setError('')} aria-label='Close'></button>
                </div>
              )} */}

              {/* {restaurantId && (
                <div className='alert alert-info'>
                  <small>
                    <strong>Restaurant ID:</strong> {restaurantId}
                  </small>
                </div>
              )} */}

              <div className='onboarding-card'>
                {renderStepContent()}

                {!fetchingData && (
                  <div className='d-flex justify-content-between mt-4'>
                    <button className='btn btn-outline-secondary' disabled={currentStep === 0 || loading} onClick={handleBack}>
                      Back
                    </button>

                    <button className='btn btn-success' onClick={handleContinue} disabled={loading}>
                      {loading ? (
                        <>
                          <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                          Processing...
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
