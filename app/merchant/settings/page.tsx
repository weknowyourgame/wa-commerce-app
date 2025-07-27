'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Merchant {
  id: string;
  businessInfo: {
    name?: string;
    category?: string;
    phoneNumber?: string;
    address?: string;
    description?: string;
  } | null;
  upiNumber?: string;
  website?: string;
  apiToken: string;
}

interface User {
  email: string;
  name?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessCategory: '',
    phoneNumber: '',
    upiNumber: '',
    businessAddress: '',
    businessDescription: '',
    website: ''
  });

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const [merchantResponse, userResponse] = await Promise.all([
        fetch('/api/merchant/settings'),
        fetch('/api/merchant/profile')
      ]);

      const merchantResult = await merchantResponse.json();
      const userResult = await userResponse.json();

      if (merchantResult.success) {
        setMerchant(merchantResult.merchant);
        // Initialize form data
        setFormData({
          businessName: merchantResult.merchant.businessInfo?.name || '',
          businessCategory: merchantResult.merchant.businessInfo?.category || '',
          phoneNumber: merchantResult.merchant.businessInfo?.phoneNumber || '',
          upiNumber: merchantResult.merchant.upiNumber || '',
          businessAddress: merchantResult.merchant.businessInfo?.address || '',
          businessDescription: merchantResult.merchant.businessInfo?.description || '',
          website: merchantResult.merchant.website || ''
        });
      }

      if (userResult.success) {
        setUser(userResult.user);
      }

      if (!merchantResult.success || !userResult.success) {
        setError('Failed to fetch settings data');
      }
    } catch (error) {
      setError('Failed to fetch settings data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await fetch('/api/merchant/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMerchant(result.merchant);
        // Refresh the page data
        fetchSettingsData();
      } else {
        setError(result.error || 'Failed to update settings');
        setIsEditing(true); // Keep editing mode on error
      }
    } catch (error) {
      setError('Failed to update settings');
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (merchant) {
      setFormData({
        businessName: merchant.businessInfo?.name || '',
        businessCategory: merchant.businessInfo?.category || '',
        phoneNumber: merchant.businessInfo?.phoneNumber || '',
        upiNumber: merchant.upiNumber || '',
        businessAddress: merchant.businessInfo?.address || '',
        businessDescription: merchant.businessInfo?.description || '',
        website: merchant.website || ''
      });
    }
  };

  const copyApiToken = async () => {
    if (merchant?.apiToken) {
      try {
        await navigator.clipboard.writeText(merchant.apiToken);
        // Show success feedback
        const button = document.getElementById('copy-token-btn');
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to copy token:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/merchant/account', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to logout or home page
        router.push('/');
      } else {
        setError(result.error || 'Failed to delete account');
        setIsDeleting(false);
      }
    } catch (error) {
      setError('Failed to delete account');
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your business settings and preferences</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="p-6">
              {isEditing ? (
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Category *
                      </label>
                      <input
                        type="text"
                        id="businessCategory"
                        name="businessCategory"
                        value={formData.businessCategory}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="upiNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        UPI Number *
                      </label>
                      <input
                        type="text"
                        id="upiNumber"
                        name="upiNumber"
                        value={formData.upiNumber}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address *
                      </label>
                      <textarea
                        id="businessAddress"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        id="businessDescription"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleChange}
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.businessInfo?.name || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Category
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.businessInfo?.category || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.businessInfo?.phoneNumber || 'Not set'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI Number
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.upiNumber || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.businessInfo?.address || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.businessInfo?.description || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {merchant?.website || 'Not set'}
                    </p>
                  </div>
                </div>
              )}
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
                  {user?.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.name || 'Not set'}
                </p>
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
                    {merchant?.apiToken.slice(0, 20)}...
                  </p>
                  <button 
                    id="copy-token-btn"
                    onClick={copyApiToken}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use this token to integrate with our API
                </p>
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
                {showDeleteConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm text-red-600 font-medium">
                      Are you sure? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 