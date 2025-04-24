'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'Submitted Claims',
    icon: ClipboardDocumentListIcon,
    href: '/portal/dashboard',
  },
  {
    name: 'New Claim',
    icon: PlusCircleIcon,
    href: '/portal/new-claim',
  },
  {
    name: 'Track Claim',
    icon: MagnifyingGlassIcon,
    href: '/portal/track-claim',
  },
  {
    name: 'Profile',
    icon: UserCircleIcon,
    href: '/portal/profile',
  },
  {
    name: 'Support',
    icon: QuestionMarkCircleIcon,
    href: '/portal/support',
  },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/portal');
  };

  // Get current section name
  const currentSection = menuItems.find(item => pathname.startsWith(item.href))?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Side Menu - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b">
          <Link href="/" className="flex justify-center mb-6">
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
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  pathname.startsWith(item.href)
                    ? 'text-[#004D40] bg-green-50 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-lg"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="relative w-32 h-12">
                <Image
                  src="/brand/logo-black.png"
                  alt="Banyan Claims Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      pathname.startsWith(item.href)
                        ? 'text-[#004D40] bg-green-50 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentSection}</h1>
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
} 