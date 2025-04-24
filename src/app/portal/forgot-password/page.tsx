'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

type Step = 'phone' | 'verify' | 'success';

export default function ForgotPassword() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'verify' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, currentStep]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep('verify');
      setCountdown(300);
      setCanResend(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsLoading(true);

    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(300);
      setCanResend(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to verify OTP and reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep('success');
      
      // Auto-redirect to dashboard after success
      setTimeout(() => {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userPhone', phoneNumber);
        // Redirect to dashboard
        router.push('/portal/dashboard');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
      <form onSubmit={handlePhoneSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Enter your registered phone number. We'll send you an OTP to reset your password.
          </p>
          <div className="mt-2">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !phoneNumber}
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
          onClick={() => setCurrentStep('phone')}
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
            Enter the 6-digit code sent to {phoneNumber}
          </p>
          <div className="mt-2">
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
              className={`font-medium ${
                canResend && !isLoading
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
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40] focus:border-transparent sm:text-sm"
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
        </div>

        <button
          type="submit"
          disabled={isLoading || !otp || !formData.newPassword || !formData.confirmPassword}
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
        {currentStep === 'phone' && renderPhoneStep()}
        {currentStep === 'verify' && renderVerifyStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
} 