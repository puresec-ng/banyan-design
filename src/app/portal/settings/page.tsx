'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  KeyIcon,
  LockClosedIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { changePassword, updatePin } from '@/app/services/dashboard/user-management';
import { useToast } from '@/app/context/ToastContext';

const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default function Settings() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeModal, setActiveModal] = useState<'password' | 'pin' | 'reset-pin' | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const showSuccessMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      showToast(validation.errors.join('\n'), 'error');
      return;
    }

    try {
      setIsProcessing(true);
      const data = {
        old_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.newPassword
      }
      const response = await changePassword(data);
      showToast('Password changed successfully', 'success');
      setActiveModal(null);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'An error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePinChange = async () => {
    if (formData.newPin !== formData.confirmPin) {
      showSuccessMessage('PINs do not match');
      return;
    }
    try {
      setIsProcessing(true);
      const data = {


        current_pin: formData.currentPin,
        new_pin: formData.newPin,
        new_pin_confirmation: formData.newPin
      }
      const response = await updatePin(data);
      console.log(response, 'response______');
      showToast('PIN changed successfully', 'success');
      setActiveModal(null);
      setFormData({ ...formData, currentPin: '', newPin: '', confirmPin: '' });
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'An error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPin = () => {
    if (formData.newPin !== formData.confirmPin) {
      showSuccessMessage('PINs do not match');
      return;
    }
    if (otp.length !== 6) {
      showSuccessMessage('Please enter a valid OTP');
      return;
    }
    setIsProcessing(true);
    // Simulate PIN reset
    setTimeout(() => {
      setIsProcessing(false);
      showSuccessMessage('PIN reset successfully');
      setActiveModal(null);
      setOtp('');
      setFormData({ ...formData, newPin: '', confirmPin: '' });
    }, 2000);
  };

  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeModal === 'password' && 'Change Password'}
              {activeModal === 'pin' && 'Change PIN'}
              {activeModal === 'reset-pin' && 'Reset PIN'}
            </h2>
            <button
              onClick={() => {
                setActiveModal(null);
                setOtp('');
                setFormData({ ...formData, newPin: '', confirmPin: '' });
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {activeModal === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          )}

          {activeModal === 'pin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current PIN</label>
                <input
                  type="password"
                  value={formData.currentPin}
                  onChange={(e) => setFormData({ ...formData, currentPin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New PIN</label>
                <input
                  type="password"
                  value={formData.newPin}
                  onChange={(e) => setFormData({ ...formData, newPin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  maxLength={4}
                />
              </div>
              <button
                onClick={handlePinChange}
                className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
              >
                {isProcessing ? 'Changing PIN...' : 'Change PIN'}
              </button>
            </div>
          )}

          {activeModal === 'reset-pin' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  An OTP has been sent to your registered email and phone number.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New PIN</label>
                <input
                  type="password"
                  value={formData.newPin}
                  onChange={(e) => setFormData({ ...formData, newPin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                  maxLength={4}
                  placeholder="Confirm 4-digit PIN"
                />
              </div>
              <button
                onClick={handleResetPin}
                disabled={isProcessing || !otp || !formData.newPin || !formData.confirmPin || otp.length !== 6}
                className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Resetting PIN...' : 'Reset PIN'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Security Settings</h1>

          <div className="space-y-6">
            {/* Change Password */}
            <div
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer"
              onClick={() => setActiveModal('password')}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  <KeyIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                <KeyIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Change PIN */}
            <div
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer"
              onClick={() => setActiveModal('pin')}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  <LockClosedIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Change PIN</h3>
                  <p className="text-sm text-gray-500">Update your transaction PIN</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                <LockClosedIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Reset PIN */}
            {/* <div 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setActiveModal('reset-pin');
                showSuccessMessage('OTP has been sent to your registered email and phone number');
              }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#004D40] p-2 rounded-full">
                  <ArrowPathIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Reset PIN</h3>
                  <p className="text-sm text-gray-500">Reset your forgotten PIN</p>
                </div>
              </div>
              <div className="text-[#004D40]">
                <ArrowPathIcon className="w-5 h-5" />
              </div>
            </div> */}

          </div>
        </div>
      </div>

      {renderModal()}

      {showSnackbar && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{snackbarMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
} 