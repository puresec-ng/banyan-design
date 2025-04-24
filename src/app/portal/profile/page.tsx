'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Mock user data - In a real app, this would come from your auth system
const MOCK_USER = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+234 801 234 5678',
  email: 'john@example.com',
  bvn: '12345678901',
  isBvnVerified: false,
  bankDetails: {
    accountName: 'John Doe',
    accountNumber: '0123456789',
    bankName: 'Access Bank',
  },
};

// Mock BVN lookup response
const MOCK_BVN_DETAILS = {
  email: 'john@example.com',
  phoneNumber: '+234 801 234 5678',
  firstName: 'John',
  lastName: 'Doe',
};

type VerificationMethod = 'email' | 'phone' | 'new-phone';

// Add Snackbar component
const Snackbar = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [bankDetails, setBankDetails] = useState(MOCK_USER.bankDetails);
  const [bvn, setBvn] = useState(MOCK_USER.bvn);
  const [isBvnVerified, setIsBvnVerified] = useState(MOCK_USER.isBvnVerified);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'bvn' | 'method' | 'new-phone' | 'otp' | 'success'>('bvn');
  const [bvnDetails, setBvnDetails] = useState<typeof MOCK_BVN_DETAILS | null>(null);
  const [alternativePhone, setAlternativePhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/portal');
    }
  }, [router]);

  const showSuccessMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleEmailSave = () => {
    setIsEditing(false);
    showSuccessMessage('Email updated successfully');
  };

  const handleBankDetailsSave = () => {
    // In a real app, this would make an API call to update bank details
    showSuccessMessage('Bank details updated successfully');
  };

  const handleBvnLookup = async () => {
    try {
      setIsVerifying(true);
      setVerificationError('');
      
      // Simulate API call to lookup BVN
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock BVN lookup result
      setBvnDetails(MOCK_BVN_DETAILS);
      setVerificationStep('method');
    } catch (error) {
      setVerificationError('An error occurred during BVN lookup. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerificationMethod = async (method: VerificationMethod) => {
    try {
      setIsVerifying(true);
      setVerificationError('');
      setSelectedMethod(method);
      
      if (method === 'new-phone') {
        setVerificationStep('new-phone');
        return;
      }
      
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationStep('otp');
    } catch (error) {
      setVerificationError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpVerification = async () => {
    try {
      setIsVerifying(true);
      setVerificationError('');
      
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification result
      const isVerified = Math.random() > 0.5; // 50% chance of success for demo
      
      if (isVerified) {
        setIsBvnVerified(true);
        setVerificationStep('success');
        showSuccessMessage('BVN verified successfully');
      } else {
        setVerificationError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setVerificationError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const closeModal = () => {
    setShowVerificationModal(false);
    setVerificationStep('bvn');
    setVerificationError('');
    setSelectedMethod(null);
    setAlternativePhone('');
    setOtp('');
  };

  const renderBvnStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Verification Number (BVN)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
            placeholder="Enter your BVN"
            maxLength={11}
            disabled={isVerifying}
          />
          <button
            onClick={handleBvnLookup}
            disabled={isVerifying || bvn.length !== 11}
            className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Looking up...' : 'Lookup BVN'}
          </button>
        </div>
        {!isVerifying && bvn.length !== 11 && (
          <p className="mt-2 text-sm text-gray-500">BVN must be 11 digits</p>
        )}
      </div>
    </div>
  );

  const renderMethodStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer mb-4" onClick={() => setVerificationStep('bvn')}>
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm">Back to BVN</span>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">BVN Details</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Email: {bvnDetails?.email}</p>
          <p className="text-sm text-gray-600">Phone: {bvnDetails?.phoneNumber}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Select verification method</h3>
        <div className="space-y-3">
          <button
            onClick={() => handleVerificationMethod('email')}
            className="w-full p-3 border border-gray-300 rounded-lg hover:border-[#004D40] hover:bg-gray-50 text-left"
          >
            <p className="text-sm font-medium text-gray-900">Verify via Email</p>
            <p className="text-sm text-gray-500">{bvnDetails?.email}</p>
          </button>

          <button
            onClick={() => handleVerificationMethod('phone')}
            className="w-full p-3 border border-gray-300 rounded-lg hover:border-[#004D40] hover:bg-gray-50 text-left"
          >
            <p className="text-sm font-medium text-gray-900">Verify via Phone</p>
            <p className="text-sm text-gray-500">{bvnDetails?.phoneNumber}</p>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAlternativePhone"
                checked={selectedMethod === 'new-phone'}
                onChange={(e) => {
                  setSelectedMethod(e.target.checked ? 'new-phone' : null);
                  if (!e.target.checked) {
                    setAlternativePhone('');
                  }
                }}
                className="rounded border-gray-300 text-[#004D40] focus:ring-[#004D40]"
              />
              <label htmlFor="useAlternativePhone" className="text-sm text-gray-700">
                Use different phone number
              </label>
            </div>

            {selectedMethod === 'new-phone' && (
              <div>
                <input
                  type="tel"
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  placeholder="Enter alternative phone number"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => handleVerificationMethod(selectedMethod || 'email')}
          disabled={isVerifying || (selectedMethod === 'new-phone' && !alternativePhone)}
          className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? 'Sending Code...' : 'Send Verification Code'}
        </button>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer mb-4" onClick={() => {
        if (selectedMethod === 'new-phone') {
          setVerificationStep('new-phone');
        } else {
          setVerificationStep('method');
        }
      }}>
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm">Back to {selectedMethod === 'new-phone' ? 'Phone Number' : 'Methods'}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Enter verification code</h3>
        <p className="text-sm text-gray-500">
          We sent a verification code to{' '}
          {selectedMethod === 'email' ? bvnDetails?.email :
           selectedMethod === 'phone' ? bvnDetails?.phoneNumber :
           alternativePhone}
        </p>
      </div>

      <div>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
          placeholder="Enter 6-digit code"
          maxLength={6}
        />
      </div>

      <button
        onClick={handleOtpVerification}
        disabled={isVerifying || otp.length !== 6}
        className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? 'Verifying...' : 'Verify Code'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Didn't receive code? <button className="text-[#004D40] hover:underline">Resend</button>
      </p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircleIcon className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">BVN Verified Successfully</h3>
      <p className="text-sm text-gray-500">
        Your BVN has been successfully verified and linked to your account.
      </p>
      <button
        onClick={closeModal}
        className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
      >
        Done
      </button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                <p className="text-gray-400 p-2 bg-gray-50 rounded-lg">{MOCK_USER.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                <p className="text-gray-400 p-2 bg-gray-50 rounded-lg">{MOCK_USER.lastName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <p className="text-gray-400 p-2 bg-gray-50 rounded-lg">{MOCK_USER.phoneNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex gap-2">
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  />
                ) : (
                  <p className="flex-1 text-gray-900 p-2 bg-gray-50 rounded-lg">{email}</p>
                )}
                <button
                  onClick={() => isEditing ? handleEmailSave() : setIsEditing(true)}
                  className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BVN Verification */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">BVN Verification</h2>
            </div>
            {isBvnVerified ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            ) : (
              <button
                onClick={() => setShowVerificationModal(true)}
                className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
              >
                Verify BVN
              </button>
            )}
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BanknotesIcon className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                maxLength={10}
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                placeholder="Enter account name"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleBankDetailsSave}
                className="px-6 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BVN Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {verificationStep === 'bvn' && 'Enter BVN'}
                {verificationStep === 'method' && 'Select Verification Method'}
                {verificationStep === 'otp' && 'Enter Verification Code'}
                {verificationStep === 'success' && 'Verification Complete'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {verificationError && (
              <div className="flex items-center gap-2 mb-4 text-red-600">
                <XCircleIcon className="w-5 h-5" />
                <span className="text-sm">{verificationError}</span>
              </div>
            )}

            {verificationStep === 'bvn' && renderBvnStep()}
            {verificationStep === 'method' && renderMethodStep()}
            {verificationStep === 'otp' && renderOtpStep()}
            {verificationStep === 'success' && renderSuccessStep()}
          </div>
        </div>
      )}

      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          onClose={() => setShowSnackbar(false)}
        />
      )}
    </main>
  );
} 