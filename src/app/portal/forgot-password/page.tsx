'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';
import { requestVerificationCode, resetPassword, forgotPassword } from '../../services/auth';
import { useApiError } from '../../utils/http';
import cookie from '../../utils/cookie';
import React from 'react';

type Step = 'email' | 'verify' | 'success';

type ForgotPasswordResponse = { reset_id?: string; message?: string };

const validatePassword = (password: string, confirmPassword: string) => ({
  hasMinLength: password.length >= 8,
  hasUpperCase: /[A-Z]/.test(password),
  hasLowerCase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  matches: password === confirmPassword && password.length > 0,
});

export default function ForgotPassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const { handleApiError } = useApiError();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const resetIdRef = useRef<string>('');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordValidation, setPasswordValidation] = useState(validatePassword('', ''));

  useEffect(() => {
    const token = cookie().getCookie('token');
    if (token) {
      router.push('/portal/dashboard');
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email }) as ForgotPasswordResponse;
      const reset_id = response?.reset_id || '';
      if (reset_id) {
        resetIdRef.current = reset_id;
        localStorage.setItem('reset_id', reset_id);
      }
      setFormData({
        newPassword: '',
        confirmPassword: '',
      });
      setOtp('');
      setCurrentStep('verify');
      setCountdown(300);
      setCanResend(false);
      showToast('OTP sent successfully', 'success');
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Error sending OTP');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);

    try {
      // Simulate API call to resend OTP
      await requestVerificationCode({ email });
      setCountdown(300);
      setCanResend(false);
      showToast('OTP sent successfully', 'success');
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Error sending OTP');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const reset_id = resetIdRef.current || localStorage.getItem('reset_id') || '';
      await resetPassword({ reset_id, otp, password: formData.newPassword, password_confirmation: formData.confirmPassword });
      setCurrentStep('success');
      showToast('Password reset successfully', 'success');
      localStorage.removeItem('reset_id');
      setTimeout(() => {
        router.push('/portal');
      }, 1000);
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Error resetting password');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Update password validation on input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, newPassword };
      setPasswordValidation(validatePassword(newPassword, prev.confirmPassword));
      return updated;
    });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, confirmPassword };
      setPasswordValidation(validatePassword(prev.newPassword, confirmPassword));
      return updated;
    });
  };

  const renderEmailStep = () => (
    <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Enter your registered email address. We'll send you an OTP to reset your password.
          </p>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#004D40] hover:bg-[#003D30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004D40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <div className="text-center pt-4">
          <Link
            href="/portal"
            className="text-base text-[#004D40] hover:text-[#003D30] font-medium inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setCurrentStep('email')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Verify OTP</h2>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 5-digit code sent to {email}
          </p>
          <div className="mt-2">
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={5}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {canResend ? 'Didn\'t receive the code?' : `Resend OTP in ${formatTime(countdown)}`}
            </span>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
              className={`font-medium ${canResend && !isLoading
                ? 'text-[#004D40] hover:text-[#003D30]'
                : 'text-gray-400 cursor-not-allowed'
                }`}
            >
              {isLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.newPassword}
              onChange={handlePasswordChange}
              className={`appearance-none block w-full px-3 py-2 border ${formData.newPassword && !passwordValidation.hasMinLength ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm`}
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
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">Password must contain:</p>
            <ul className="text-sm space-y-1">
              <li className={`flex items-center ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}><span className="mr-2">{passwordValidation.hasMinLength ? '✓' : '○'}</span>At least 8 characters</li>
              <li className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}><span className="mr-2">{passwordValidation.hasUpperCase ? '✓' : '○'}</span>One uppercase letter</li>
              <li className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}><span className="mr-2">{passwordValidation.hasLowerCase ? '✓' : '○'}</span>One lowercase letter</li>
              <li className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}><span className="mr-2">{passwordValidation.hasNumber ? '✓' : '○'}</span>One number</li>
              <li className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}><span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '○'}</span>One special character</li>
            </ul>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`appearance-none block w-full px-3 py-2 border ${formData.confirmPassword && !passwordValidation.matches ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {formData.confirmPassword && !passwordValidation.matches && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 5 || !Object.values(passwordValidation).every(Boolean)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#004D40] hover:bg-[#003D30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004D40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircleIcon className="w-10 h-10 text-green-600" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h2>
      <p className="text-gray-600 mb-8">
        Your password has been reset successfully. You will be redirected to the dashboard shortly.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Reset Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'verify' && renderVerifyStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
}