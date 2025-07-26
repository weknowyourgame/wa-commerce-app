import Link from 'next/link';

export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Merchant Dashboard!
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Your business has been successfully set up. You can now start managing your products and orders.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/merchant"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>
          
          <p className="text-sm text-gray-500">
            You can always update your business information from your dashboard settings.
          </p>
        </div>
      </div>
    </div>
  );
} 