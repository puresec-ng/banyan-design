'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

// Demo credentials - In a real app, this would be handled by a backend
const DEMO_CREDENTIALS = {
  '+2348123456789': 'demo12345',
  '+2349876543210': 'test12345',
};

export default function ClientPortal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check demo credentials
      if (DEMO_CREDENTIALS[formData.phone as keyof typeof DEMO_CREDENTIALS] === formData.password) {
        // Store auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userPhone', formData.phone);
        
        // Redirect to dashboard
        router.push('/portal/dashboard');
      } else {
        // If credentials don't match, still allow login
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userPhone', formData.phone);
        router.push('/portal/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setFormData({
      phone: '+2348123456789',
      password: 'demo12345',
    });
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logo-black.png"
                alt="Banyan Claims Logo"
                width={150}
                height={40}
                priority
                className="mx-auto"
              />
            </Link>
          </div>

          <div className="mb-4">
            <Link 
              href="/"
              className="inline-flex items-center text-[#004D40] hover:text-[#003D30] font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Return to Website
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-xl p-8">
            <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
              Client Portal Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#004D40] focus:ring-[#004D40] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/portal/forgot-password"
                    className="font-medium text-[#004D40] hover:text-[#003D30]"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/portal/register"
                className="text-sm text-[#004D40] hover:text-[#003D30]"
              >
                Register on Banyan Claims
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 