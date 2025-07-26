import Sidebar from 'components/merchant/sidebar';
import { auth } from 'lib/auth';
import { getOrCreateMerchant } from 'lib/merchants';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Redirect if not authenticated
  if (!session) {
    redirect('/merchant/login');
  }

  // Get or create merchant and check onboarding status
  const merchant = await getOrCreateMerchant(session.user.id);

  // Redirect to onboarding if not completed
  if (!merchant.isOnboarded) {
    redirect('/merchant/onboarding');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar merchant={merchant} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, {session.user.name || session.user.email}
              </h1>
              <p className="text-sm text-gray-600">
                Manage your business from your dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 