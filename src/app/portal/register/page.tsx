'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useToast } from '../../context/ToastContext';
import { AuthSession, getAuthSession, register, requestVerificationCode, verifyEmail, createPin } from '../../services/auth';
import {
  getAuthErrorMessage,
  persistAuthSession,
  validateEmailFormat,
  validatePassword,
  validatePin,
} from '../../utils/security';
import { useOtpResend, OTP_RESEND_COOLDOWN_SECONDS } from '../../utils/useOtpResend';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PhoneValidation {
  hasValidPrefix: boolean;
  hasValidLength: boolean;
  hasValidFormat: boolean;
}

interface FieldValidation {
  isValid: boolean;
  message: string;
}

const validateNigerianPhoneNumber = (phone: string): PhoneValidation => {
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');

  return {
    hasValidPrefix: cleanedPhone.startsWith('+234') || cleanedPhone.startsWith('0'),
    hasValidLength: (cleanedPhone.startsWith('+234') && cleanedPhone.length === 14) ||
      (cleanedPhone.startsWith('0') && cleanedPhone.length === 11),
    hasValidFormat: /^(\+234[0-9]{10}|0[0-9]{10})$/.test(cleanedPhone)
  };
};

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();
  const { countdown, canResend, startCooldown, formatTime } = useOtpResend(OTP_RESEND_COOLDOWN_SECONDS);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pendingSession, setPendingSession] = useState<AuthSession | null>(null);
  const [successDestination, setSuccessDestination] = useState<'dashboard' | 'login'>('dashboard');
  const [pinValidation, setPinValidation] = useState({ isValid: false, message: '' });
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordValidation, setPasswordValidation] = useState(validatePassword('', ''));
  const [phoneValidation, setPhoneValidation] = useState<PhoneValidation>({
    hasValidPrefix: false,
    hasValidLength: false,
    hasValidFormat: false
  });
  const [phoneFieldValidation, setPhoneFieldValidation] = useState<FieldValidation>({
    isValid: false,
    message: '',
  });
  const [emailValidation, setEmailValidation] = useState<FieldValidation>({
    isValid: false,
    message: '',
  });

  useEffect(() => {
    if (currentStep !== 4) {
      return;
    }

    const destination = successDestination === 'dashboard' ? '/portal/dashboard' : '/portal';
    const redirectTimer = window.setTimeout(() => router.push(destination), 5000);

    return () => window.clearTimeout(redirectTimer);
  }, [currentStep, router, successDestination]);

  // Add function to check if form is valid
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      phoneFieldValidation.isValid &&
      emailValidation.isValid &&
      Object.values(passwordValidation).every(Boolean)
    );
  };

  const validateEmailField = (email: string) => {
    if (validateEmailFormat(email)) {
      setEmailValidation({ isValid: true, message: '' });
    } else {
      setEmailValidation({ isValid: false, message: 'Please enter a valid email address' });
    }
  };

  const validatePhoneField = (phone: string) => {
    const validation = validateNigerianPhoneNumber(phone);
    setPhoneValidation(validation);
    if (validation.hasValidFormat) {
      setPhoneFieldValidation({ isValid: true, message: '' });
    } else {
      setPhoneFieldValidation({ isValid: false, message: 'Please enter a valid phone number' });
    }
  };

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
        if (value) {
          validatePhoneField(value);
        }
      }

      if (name === 'email' && value) {
        validateEmailField(value);
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
      setPendingSession(getAuthSession(response));

      setCurrentStep(2);
      startCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      showToast('Account created. Check your email for the verification code.', 'success');
    } catch (error) {
      showToast(getAuthErrorMessage('register', error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canResend || isLoading) return;
    try {
      await requestVerificationCode({ email: formData.email });
      startCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      showToast('Verification code sent successfully', 'success');
    } catch (error) {
      showToast(getAuthErrorMessage('otpResend', error), 'error');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 5) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await verifyEmail({
        email: formData.email,
        otp: otp,
        otp_type: 'email'
      });

      const session = getAuthSession(response) ?? pendingSession;
      if (session) {
        persistAuthSession(session.token, session.user);
        setSuccessDestination('dashboard');
      } else {
        setSuccessDestination('login');
      }
      setCurrentStep(4);
    } catch (error) {
      showToast(getAuthErrorMessage('otp', error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pinCheck = validatePin(pin);
    if (!pinCheck.isValid) {
      showToast(pinCheck.message, 'error');
      return;
    }
    if (pin !== confirmPin) {
      showToast('PINs do not match', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await createPin({
        pin: pin,
        pin_confirmation: confirmPin
      });

      setSuccessDestination('dashboard');
      setCurrentStep(4);
    } catch (error) {
      showToast(getAuthErrorMessage('pinChange', error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="bg-white shadow-md rounded-xl p-8">
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
        Create a Claim Support Account
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">Create an account to request claim support, upload documents and track support updates.</p>

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
          <div className="relative">
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              maxLength={14}
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+234XXXXXXXXXX or 0XXXXXXXXXX"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent ${formData.phoneNumber
                ? phoneFieldValidation.isValid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-300'
                }`}
            />
            {formData.phoneNumber && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {phoneFieldValidation.isValid ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {formData.phoneNumber && phoneFieldValidation.message && (
            <p className="mt-1 text-sm text-red-600">{phoneFieldValidation.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="new-email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent ${formData.email
                ? emailValidation.isValid
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-gray-300'
                }`}
            />
            {formData.email && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {emailValidation.isValid ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {formData.email && emailValidation.message && (
            <p className="mt-1 text-sm text-red-600">{emailValidation.message}</p>
          )}
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
              autoComplete="new-password"
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
          disabled={isLoading || !isFormValid()}
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
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
        Verify Your Account
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter the 5-digit code sent to {formData.email || 'your email'}.
      </p>

      <form onSubmit={handleOtpSubmit} className="space-y-5">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Enter OTP
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={5}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:border-transparent text-center text-lg tracking-[0.35em]"
            placeholder="Enter 5-digit OTP"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 5}
          className="w-full py-3 px-4 bg-[#004D40] text-white rounded-xl hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        {canResend ? (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="font-medium text-[#004D40] hover:text-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend Code
          </button>
        ) : (
          <p className="text-gray-500">
            Resend code in{' '}
            <span className="font-medium text-[#004D40]">{formatTime(countdown)}</span>
          </p>
        )}
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
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPin(value);
              setPinValidation(validatePin(value));
            }}
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
            Your PIN will be used for secure access to your account. Please keep it safe and don&apos;t share it with anyone.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4 || !pinValidation.isValid || pin !== confirmPin}
          className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating PIN...' : 'Create PIN'}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="bg-white shadow-md rounded-xl p-8 text-center" role="status" aria-live="polite">
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
        {successDestination === 'dashboard'
          ? 'Your email is verified and your Claim Support account is ready.'
          : 'Your email is verified. Sign in to access your Claim Support account.'}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        {successDestination === 'dashboard'
          ? 'Taking you to your dashboard in a few seconds.'
          : 'Taking you to sign in in a few seconds.'}
      </p>
      <Link
        href={successDestination === 'dashboard' ? '/portal/dashboard' : '/portal'}
        className="mt-6 inline-flex font-medium text-[#004D40] underline underline-offset-4 hover:text-[#003D30]"
      >
        {successDestination === 'dashboard' ? 'Continue to dashboard' : 'Continue to sign in'}
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <Link href="/" className="inline-block mix-blend-multiply">
              <span className="relative mx-auto block h-20 w-36">
                <Image
                  src="/brand/logo-black.png"
                  alt="Banyan Claims Logo"
                  fill
                  sizes="144px"
                  className="object-contain"
                  priority
                />
              </span>
            </Link>
          </div>

          <div className="mb-4">
            {currentStep === 2 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center text-[#004D40] hover:text-[#003D30] font-medium"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center text-[#004D40] hover:text-[#003D30] font-medium"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Return to Website
              </Link>
            )}
          </div>

          {currentStep === 1 && renderPersonalInfoStep()}
          {currentStep === 2 && renderOtpStep()}
          {currentStep === 3 && renderPinStep()}
          {currentStep === 4 && renderSuccessStep()}
        </div>
      </div>
    </main>
  );
}
