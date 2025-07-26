import { auth } from 'lib/auth';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import Link from 'next/link';

export const metadata = {
  title: 'Settings - Merchant Dashboard',
  description: 'Manage your business settings'
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const merchant = await getOrCreateMerchant(session!.user.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.businessInfo?.name || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Category
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.businessInfo?.category || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.businessInfo?.phoneNumber || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI Number
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.upiNumber || 'Not set'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.businessInfo?.address || 'Not set'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.businessInfo?.description || 'Not set'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {merchant.website || 'Not set'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/merchant/settings/edit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Business Information
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Account</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {session.user.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {session.user.name || 'Not set'}
                </p>
              </div>
              
              <div className="pt-4">
                <Link
                  href="/merchant/settings/profile"
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Edit Profile →
                </Link>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">API & Integration</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Token
                </label>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md flex-1 font-mono">
                    {merchant.apiToken.slice(0, 20)}...
                  </p>
                  <button className="text-blue-600 hover:text-blue-900 text-sm">
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  href="/merchant/settings/api"
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Manage API Settings →
                </Link>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow border border-red-200">
            <div className="px-6 py-4 border-b border-red-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 