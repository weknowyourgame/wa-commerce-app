'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OnboardingData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  upiNumber: string;
  website: string;
  phoneNumber: string;
  businessCategory: string;
}

const businessCategories = [
  'Electronics',
  'Fashion & Apparel',
  'Food & Beverages',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Fitness',
  'Books & Media',
  'Automotive',
  'Toys & Games',
  'Other'
];

export default function MerchantOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    businessDescription: '',
    businessAddress: '',
    upiNumber: '',
    website: '',
    phoneNumber: '',
    businessCategory: ''
  });

  useEffect(() => {
    // Check if user is already onboarded
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/merchant/onboarding');
      const result = await response.json();
      
      if (result.isOnboarded) {
        router.push('/merchant');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/merchant/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/merchant/success');
      } else {
        setError(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      setError('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Welcome to Your Merchant Dashboard!</h3>
              <p className="mt-2 text-sm text-gray-600">
                Let's get your business set up. This will only take a few minutes.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                value={data.businessName}
                onChange={(e) => updateData('businessName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Category *
              </label>
              <select
                value={data.businessCategory}
                onChange={(e) => updateData('businessCategory', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {businessCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Tell us about your business</h3>
              <p className="mt-2 text-sm text-gray-600">
                Help customers understand what you offer.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Description *
              </label>
              <textarea
                value={data.businessDescription}
                onChange={(e) => updateData('businessDescription', e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your business, products, and services..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website (Optional)
              </label>
              <input
                type="url"
                value={data.website}
                onChange={(e) => updateData('website', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <p className="mt-2 text-sm text-gray-600">
                How can customers reach you?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Address *
              </label>
              <textarea
                value={data.businessAddress}
                onChange={(e) => updateData('businessAddress', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your business address..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                value={data.phoneNumber}
                onChange={(e) => updateData('phoneNumber', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Payment Setup</h3>
              <p className="mt-2 text-sm text-gray-600">
                Set up your UPI number to receive payments.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                UPI Number *
              </label>
              <input
                type="text"
                value={data.upiNumber}
                onChange={(e) => updateData('upiNumber', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="yourname@upi"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This is where you'll receive payments from customers
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-900">Almost done!</h4>
              <p className="mt-1 text-sm text-blue-700">
                Review your information and click "Complete Setup" to finish onboarding.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.businessName && data.businessCategory;
      case 1:
        return data.businessDescription;
      case 2:
        return data.businessAddress && data.phoneNumber;
      case 3:
        return data.upiNumber;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step + 1}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            Step {currentStep + 1} of 4
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Completing...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 