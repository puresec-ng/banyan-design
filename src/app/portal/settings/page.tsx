'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  KeyIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { changePassword } from '@/app/services/dashboard/user-management';
import { useToast } from '@/app/context/ToastContext';
import cookie from '@/app/utils/cookie';
import {
  clearAuthSession,
  getAuthErrorMessage,
  getPasswordValidationErrors,
  validatePassword,
} from '../../utils/security';

export default function Settings() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(
    validatePassword('', '')
  );

  useEffect(() => {
    const token = cookie().getCookie('token');
    if (!token) {
      router.push('/portal');
    }
  }, [router]);

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const validationErrors = getPasswordValidationErrors(formData.newPassword);
    if (validationErrors.length > 0) {
      showToast(validationErrors.join('\n'), 'error');
      return;
    }

    try {
      setIsProcessing(true);
      await changePassword({
        old_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.newPassword,
      });
      showToast('Password changed successfully. Please log in again.', 'success');
      setActiveModal(false);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordValidation(validatePassword('', ''));
      clearAuthSession();
      router.push('/portal');
    } catch (error: any) {
      showToast(getAuthErrorMessage('passwordChange', error), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            <button
              onClick={() => setActiveModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, currentPassword: !showPasswords.currentPassword })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.currentPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setFormData({ ...formData, newPassword });
                    setPasswordValidation(validatePassword(newPassword, formData.confirmPassword));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, newPassword: !showPasswords.newPassword })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.newPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    const confirmPassword = e.target.value;
                    setFormData({ ...formData, confirmPassword });
                    setPasswordValidation(prev => ({
                      ...prev,
                      matches: formData.newPassword === confirmPassword,
                    }));
                  }}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent pr-10 ${formData.confirmPassword
                    ? passwordValidation.matches
                      ? 'border-green-500'
                      : 'border-red-500'
                    : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirmPassword: !showPasswords.confirmPassword })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords.confirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !passwordValidation.matches && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={isProcessing || !Object.values(passwordValidation).every(Boolean) || !formData.currentPassword}
              className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
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
            <div
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#004D40] hover:bg-gray-50 cursor-pointer"
              onClick={() => setActiveModal(true)}
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
          </div>
        </div>
      </div>

      {renderModal()}
    </main>
  );
}
