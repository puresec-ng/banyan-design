'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  WalletIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import cookie from '@/app/utils/cookie';

export default function Sidebar() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Preserve remembered email if it exists
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    // Clear all localStorage
    localStorage.clear();
    // Restore remembered email if it was set
    if (rememberedEmail) {
      localStorage.setItem('rememberedEmail', rememberedEmail);
    }
    // Clear all user-related cookies
    cookie().deleteCookie('token');
    cookie().deleteCookie('user');
    // Add more cookies here if needed
    // Invalidate or refetch queries here if using React Query
    // Example: queryClient.clear() or queryClient.invalidateQueries()
    // Redirect to login
    router.push('/portal');
  };

  return (
    <>
      <aside className="bg-white h-screen w-64 fixed left-0 top-0 border-r border-gray-200">
        <div className="p-4">
          <Link href="/portal/dashboard">
            <div className="relative w-32 h-12">
              <img
                src="/brand/logo-black.png"
                alt="Banyan Claims Logo"
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/portal/dashboard"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/portal/wallet"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <WalletIcon className="w-5 h-5" />
                <span>Wallet</span>
              </Link>
            </li>
            <li>
              <Link
                href="/portal/settings"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link
                href="/portal/support"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span>Support</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Logout</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 