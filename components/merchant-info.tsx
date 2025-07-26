import type { MerchantWithProducts } from 'lib/types';

export function MerchantInfo({ merchant }: { merchant: MerchantWithProducts | null }) {
  if (!merchant) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {merchant.businessInfo?.name}
          </h2>
          <p className="text-gray-600 mt-1">
            {merchant.businessInfo?.description}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <p>📍 {merchant.businessInfo?.address}</p>
            <p>📞 {merchant.businessInfo?.phone}</p>
            <p>💳 UPI: {merchant.upiNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            <p>Products: {merchant.products?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 