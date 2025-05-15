'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '../../context/ToastContext';
import { register, requestVerificationCode, verifyEmail, createPin } from '../../services/auth';
import cookie from '@/app/utils/cookie';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  matches: boolean;
}

interface PhoneValidation {
  hasValidPrefix: boolean;
  hasValidLength: boolean;
  hasValidFormat: boolean;
}

const validateNigerianPhoneNumber = (phone: string): PhoneValidation => {
  // Remove any spaces, dashes, or parentheses
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');

  return {
    hasValidPrefix: cleanedPhone.startsWith('+234') || cleanedPhone.startsWith('0'),
    hasValidLength: (cleanedPhone.startsWith('+234') && cleanedPhone.length === 14) ||
      (cleanedPhone.startsWith('0') && cleanedPhone.length === 11),
    hasValidFormat: /^(\+234[0-9]{10}|0[0-9]{10})$/.test(cleanedPhone)
  };
};

const validatePassword = (password: string, confirmPassword: string): PasswordValidation => {
  return {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    matches: password === confirmPassword
  };
};

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    matches: false
  });
  const [phoneValidation, setPhoneValidation] = useState<PhoneValidation>({
    hasValidPrefix: false,
    hasValidLength: false,
    hasValidFormat: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Update password validation when password or confirmPassword changes
      if (name === 'password' || name === 'confirmPassword') {
        setPasswordValidation(validatePassword(
          name === 'password' ? value : prev.password,
          name === 'confirmPassword' ? value : prev.confirmPassword
        ));
      }

      // Update phone validation when phone number changes
      if (name === 'phoneNumber') {
        setPhoneValidation(validateNigerianPhoneNumber(value));
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    if (!phoneValidation.hasValidPrefix || !phoneValidation.hasValidLength || !phoneValidation.hasValidFormat) {
      showToast('Please enter a valid Nigerian phone number starting with +234 or 0', 'error');
      return;
    }

    // Validate password
    const validation = validatePassword(formData.password, formData.confirmPassword);
    if (!Object.values(validation).every(Boolean)) {
      showToast('Please ensure your password meets all requirements', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        accept_tc: 'yes',
        referral_code: '',
        password_confirmation: formData.confirmPassword,
      }
      const response = await register(payload);
      console.log(response);
      const savedResponse = {
        token: response.token,
        user: response.user,
      };
      cookie().setCookie('token', response.token);
      cookie().setCookie('user', JSON.stringify(response.user));

      // Store form data in localStorage for the next steps
      localStorage.setItem('registrationData', JSON.stringify(savedResponse));

      // Move to OTP verification step
      setCurrentStep(2);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error during registration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleResendOtp = async () => {
    // Simulate resending OTP
    setCountdown(300);
    setCanResend(false);
    // In a real app, you would make an API call to resend OTP
    try {
      await requestVerificationCode({ email: formData.email });
      showToast('Verification code sent successfully', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to send verification code', 'error');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate OTP verification
      const response = await verifyEmail({
        email: formData.email,
        otp: otp,
        otp_type: 'email'
      });
      console.log(response);

      // Move to PIN creation step
      setCurrentStep(3);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error verifying OTP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate PIN creation
      const response = await createPin({
        pin: pin,
        pin_confirmation: confirmPin
      });
      console.log(response);

      // Move to success screen
      setCurrentStep(4);

      // Redirect to dashboard after 5 seconds
      setTimeout(() => {
        router.push('/portal/dashboard');
      }, 5000);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error creating PIN', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="bg-white shadow-md rounded-xl p-8">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        Create Your Account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            maxLength={14}
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+234XXXXXXXXXX or 0XXXXXXXXXX"
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent ${formData.phoneNumber ?
              (phoneValidation.hasValidFormat ? 'border-green-500' : 'border-red-500') :
              'border-gray-300'
              }`}
          />
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">Phone number must:</p>
            <ul className="text-sm space-y-1">
              <li className={`flex items-center ${phoneValidation.hasValidPrefix ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{phoneValidation.hasValidPrefix ? '✓' : '○'}</span>
                Start with +234 or 0
              </li>
              <li className={`flex items-center ${phoneValidation.hasValidLength ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{phoneValidation.hasValidLength ? '✓' : '○'}</span>
                Have correct length (11 digits for 0 prefix, 14 digits for +234)
              </li>
              <li className={`flex items-center ${phoneValidation.hasValidFormat ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{phoneValidation.hasValidFormat ? '✓' : '○'}</span>
                Contain only valid digits
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
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
              <li className={`flex items-center ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordValidation.hasMinLength ? '✓' : '○'}</span>
                At least 8 characters
              </li>
              <li className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordValidation.hasUpperCase ? '✓' : '○'}</span>
                One uppercase letter
              </li>
              <li className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordValidation.hasLowerCase ? '✓' : '○'}</span>
                One lowercase letter
              </li>
              <li className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordValidation.hasNumber ? '✓' : '○'}</span>
                One number
              </li>
              <li className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                <span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '○'}</span>
                One special character
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent ${formData.confirmPassword ?
                (passwordValidation.matches ? 'border-green-500' : 'border-red-500') :
                'border-gray-300'
                }`}
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
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/portal"
          className="text-[#004D40] hover:text-[#003D30] font-medium"
        >
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="bg-white shadow-md rounded-xl p-8">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        Verify Your Account
      </h1>

      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            We've sent a verification code to your email and phone number
          </p>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent text-center text-lg tracking-widest"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="mt-4 text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[#004D40] hover:text-[#003D30] font-medium"
            >
              Resend Code
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <span className="text-gray-600">Resend code in</span>
              <span className="font-medium text-[#004D40]">
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setCurrentStep(1)}
          className="text-[#004D40] hover:text-[#003D30] font-medium inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>
    </div>
  );

  const renderPinStep = () => (
    <div className="bg-white shadow-md rounded-xl p-8">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        Create Your PIN
      </h1>

      <form onSubmit={handlePinSubmit} className="space-y-4">
        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
            Enter 4-digit PIN
          </label>
          <input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent text-center text-lg tracking-widest"
          />
        </div>

        <div>
          <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm 4-digit PIN
          </label>
          <input
            id="confirmPin"
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent text-center text-lg tracking-widest"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            Your PIN will be used for secure access to your account. Please keep it safe and don't share it with anyone.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating PIN...' : 'Create PIN'}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="bg-white shadow-md rounded-xl p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Registration Successful!
      </h1>

      <p className="text-gray-600">
        You will be redirected to your dashboard in a few seconds.
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {currentStep === 1 && renderPersonalInfoStep()}
        {currentStep === 2 && renderOtpStep()}
        {currentStep === 3 && renderPinStep()}
        {currentStep === 4 && renderSuccessStep()}
      </div>
    </main>
  );
} 