'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <div className="relative w-32 h-20">
            <Image
              src="/brand/logo-black.png"
              alt="Banyan Claims Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900 font-lato">
          Client Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Track and manage your claims in one place
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm"
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#004D40] hover:bg-[#003D30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004D40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/portal/register"
                className="font-medium text-[#004D40] hover:text-[#003D30]"
              >
                Register on Banyan Claims
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 