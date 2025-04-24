'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, BanknotesIcon } from '@heroicons/react/24/outline';

// Mock user data - In a real app, this would come from your auth system
const MOCK_USER = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+234 801 234 5678',
  email: 'john@example.com',
  bankDetails: {
    accountName: 'John Doe',
    accountNumber: '0123456789',
    bankName: 'Access Bank',
  },
};

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [bankDetails, setBankDetails] = useState(MOCK_USER.bankDetails);
  const [isEditingBank, setIsEditingBank] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/portal');
    }
  }, [router]);

  const handleEmailSave = () => {
    // In a real app, this would make an API call to update the email
    setIsEditing(false);
    // You would update the user's email in the backend here
  };

  const handleBankDetailsSave = () => {
    // In a real app, this would make an API call to update bank details
    setIsEditingBank(false);
    // You would update the bank details in the backend here
  };

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
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{MOCK_USER.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{MOCK_USER.lastName}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{MOCK_USER.phoneNumber}</p>
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

        {/* Bank Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BanknotesIcon className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
            </div>
            {!isEditingBank && (
              <button
                onClick={() => setIsEditingBank(true)}
                className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
              >
                Edit Bank Details
              </button>
            )}
          </div>

          <div className="space-y-4">
            {isEditingBank ? (
              <>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    placeholder="Enter account name"
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
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setIsEditingBank(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBankDetailsSave}
                    className="px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{bankDetails.bankName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{bankDetails.accountName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{bankDetails.accountNumber}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 