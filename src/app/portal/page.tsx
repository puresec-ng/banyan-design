'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '../context/ToastContext';
import { login } from '../services/auth';
import cookie from '../utils/cookie';

export default function ClientPortal() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeChecked = localStorage.getItem('rememberMeChecked') === 'true';
    if (storedEmail) {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
    setRememberMe(rememberMeChecked);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await login(formData);
      console.log('Login response:', response);

      const savedResponse = {
        token: response.token,
        user: response.user,
      };
      localStorage.setItem('registrationData', JSON.stringify(savedResponse));
      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userPhone', formData.email);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberMeChecked', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.setItem('rememberMeChecked', 'false');
      }

      // Set cookies with debug logging
      console.log('Setting cookies...');
      cookie().setCookie('token', response.token);
      cookie().setCookie('user', JSON.stringify(response.user));
      console.log('Cookies after setting:', document.cookie);

      // Redirect to dashboard
      router.push('/portal/dashboard');

    } catch (error: any) {
      console.log('Login error:', error);
      showToast(error.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Checking cookies on mount...');
    const token = cookie().getCookie('token');
    console.log('Current cookies:', document.cookie);
    console.log('Token from cookie:', token);
    if (token) {
      router.push('/portal/dashboard');
    }
  }, []);

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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    placeholder="Enter your password"
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
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

              <div className="mt-4 text-center">
                <Link
                  href="/portal/register"
                  className="text-[#004D40] hover:text-[#003D30] font-medium"
                >
                  Register now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 