'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { checkEmail, login } from '../../services/auth';
import { useToast } from '../../context/ToastContext';

export default function PersonalInfo() {
  const router = useRouter();
  const { showToast } = useToast();
  const initialFormData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    // Check if user has completed previous steps
    const basicInfo = localStorage.getItem('basicInfo');
    if (!basicInfo) {
      router.push('/submit-claim/basic-info');
      return;
    }

    // Load saved personal info if it exists
    const savedPersonalInfo = localStorage.getItem('personalInfo');
    console.log('savedPersonalInfo____', savedPersonalInfo);
    if (savedPersonalInfo) {
      try {
        setFormData(JSON.parse(savedPersonalInfo));
      } catch (e) {
        console.error('Failed to parse personalInfo from localStorage', e);
        // Optionally clear invalid data
        localStorage.removeItem('personalInfo');
      }
    }
  }, [router]);

  const validateNigerianPhone = (phone: string) => {
    // Remove any spaces or special characters
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Check for Nigerian phone number patterns
    const patterns = [
      /^0[789][01]\d{8}$/,  // 11 digits starting with 0
      /^\+234[789][01]\d{8}$/  // 13 digits starting with +234
    ];

    return patterns.some(pattern => pattern.test(cleanedPhone));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate phone number when it changes
    if (name === 'phoneNumber') {
      if (!value) {
        setPhoneError('');
      } else if (!validateNigerianPhone(value)) {
        setPhoneError('Please enter a valid Nigerian phone number');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleBack = () => {
    router.push('/submit-claim/basic-info');
  };

  const handleContinue = () => {
    // Store form data
    localStorage.setItem('personalInfo', JSON.stringify(formData));
    // Navigate to requirements
    router.push('/submit-claim/requirements');
  };

  const isFormValid = () => {
    return formData.firstName &&
      formData.lastName &&
      formData.phoneNumber &&
      formData.email &&
      !phoneError;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent`}
              placeholder="Enter your Nigerian phone number (e.g., 08012345678)"
              required
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-600">{phoneError}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isFormValid()}
          className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 