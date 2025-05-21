'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  WalletIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import cookie from '@/app/utils/cookie';

const menuItems = [
  { name: 'Submitted Claims', href: '/portal/dashboard', icon: DocumentTextIcon },
  { name: 'New Claim', href: '/portal/new-claim', icon: PlusCircleIcon },
  { name: 'Track Claim', href: '/portal/track-claim', icon: MagnifyingGlassIcon },
  { name: 'Profile', href: '/portal/profile', icon: UserIcon },
  { name: 'Transactions', href: '/portal/wallet', icon: WalletIcon },
  { name: 'Settings', href: '/portal/settings', icon: Cog6ToothIcon },
  { name: 'Support', href: '/portal/support', icon: QuestionMarkCircleIcon },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = cookie().getCookie('user');
    const userData = JSON.parse(user || '{}') || {};
    setUserName(`${userData.first_name || ''} ${userData.last_name || ''}`);
  }, []);

  // Check if we're on the login or forgot-password page
  const isLoginPage = pathname === '/portal';
  const isForgotPasswordPage = pathname === '/portal/forgot-password';
  const isRegisterPage = pathname === '/portal/register';

  // If we're on the login, forgot-password, or register page, render only the children
  if (isLoginPage || isForgotPasswordPage || isRegisterPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('registrationData');
    cookie().deleteCookie('token');
    cookie().deleteCookie('user');
    // Redirect to login
    router.push('/portal');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-10 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6 text-gray-500" />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 w-64 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-30`}>
        <div className="flex flex-col h-screen bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <Link href="/" className="flex items-center">
              <div className="relative w-32 h-12">
                <Image
                  src="/brand/logo-black.png"
                  alt="Banyan Claims Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive
                    ? 'bg-[#004D40] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-base font-medium text-gray-900">
                {userName}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

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
              Are you sure you want to logout?
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
    </div>
  );
} 