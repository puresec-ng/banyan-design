'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Process', href: '#process' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed w-full bg-white z-[100] shadow-sm">
        <nav className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex lg:flex-1">
            <Link href="#home" className="flex items-center">
              <div className="relative w-32 h-20">
                <Image
                  src="/brand/logo-white.png"
                  alt="Banyan Claims Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-montserrat font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-6">
            <Link 
              href="/portal" 
              className="px-4 py-2 text-base font-semibold text-white bg-[#1B4332] rounded-2xl hover:bg-[#15352a] transition-colors"
            >
              Client Portal
            </Link>
            <Link 
              href="/submit-claim" 
              className="px-4 py-2 text-base font-semibold text-white bg-[#E67635] rounded-2xl hover:bg-[#d16426] transition-colors"
            >
              Submit Claim
            </Link>
          </div>
        </nav>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]" 
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-[200] w-full overflow-y-auto bg-white sm:max-w-sm">
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="#home" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative w-28 h-16">
                    <Image
                      src="/brand/logo-white.png"
                      alt="Banyan Claims Logo"
                      fill
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-base font-montserrat font-semibold text-gray-900 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-4">
                  <Link
                    href="/portal"
                    className="block w-full px-4 py-2 text-base font-semibold text-white bg-[#1B4332] rounded-2xl hover:bg-[#15352a] transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Client Portal
                  </Link>
                  <Link
                    href="/submit-claim"
                    className="block w-full px-4 py-2 text-base font-semibold text-white bg-[#E67635] rounded-2xl hover:bg-[#d16426] transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Submit Claim
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 