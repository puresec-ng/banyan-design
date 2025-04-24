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
  'demo@banyanclaims.com': 'demo12345',
  'test@banyanclaims.com': 'test12345',
};

export default function ClientPortal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check demo credentials
      if (DEMO_CREDENTIALS[formData.email as keyof typeof DEMO_CREDENTIALS] === formData.password) {
        // Store auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        // Redirect to dashboard
        router.push('/portal/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'An error occurred');
      // Show demo credentials after failed attempt
      setShowDemoCredentials(true);
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setFormData({
      email: 'demo@banyanclaims.com',
      password: 'demo12345',
    });
    setErrors({ email: '', password: '' });
    setLoginError('');
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
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-700">
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              <p>{loginError}</p>
            </div>
          )}

          {showDemoCredentials && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl text-blue-800">
              <p className="font-medium mb-2">Demo Credentials</p>
              <p className="text-sm mb-1">Email: demo@banyanclaims.com</p>
              <p className="text-sm mb-3">Password: demo12345</p>
              <button
                type="button"
                onClick={useDemoCredentials}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Use demo credentials
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm
                    ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
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
                  className={`appearance-none block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm
                    ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
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
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
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
                Register for Client Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 