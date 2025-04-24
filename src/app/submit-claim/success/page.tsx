'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SubmissionDetails {
  trackingNumber: string;
  submissionDate: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  useEffect(() => {
    const submissionDetails = localStorage.getItem('submissionDetails');
    if (submissionDetails) {
      const details = JSON.parse(submissionDetails);
      setTrackingNumber(details.trackingNumber);
    }
  }, []);

  if (!trackingNumber) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Claim Submitted Successfully
          </h1>

          <p className="text-gray-600 mb-8">
            Your claim has been submitted. Use this tracking number to check your claim status.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="text-2xl font-semibold text-gray-900">{trackingNumber}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/portal')}
              className="w-full px-6 py-3 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] transition-colors"
            >
              Client Portal
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 border border-[#004D40] text-[#004D40] rounded-lg hover:bg-[#E0F2F1] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 